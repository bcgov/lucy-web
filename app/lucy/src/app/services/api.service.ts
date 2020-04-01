/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SsoService } from './sso.service';
import { ErrorService, ErrorType } from './error.service';

/*------------------------------------------------------------------------*/
export enum APIRequestMethod {
  PUT,
  POST,
  GET,
}

export interface APIRequestResult {
  success: boolean;
  response: any;
}

export enum APIErrorDescision {
  Retry,
  Stop,
}

export interface APIError {
  endpoint: string;
  body: any;
  method: APIRequestMethod;
  error: any;
  attempts: number;
}
/*------------------------------------------------------------------------*/
export interface APIRequest {
  URL: string;
  method: APIRequestMethod;
  promise: Promise<Object> | null;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  /**
   * Maximum number of Request retry calls
   * After failures.
   */
  private MAX_NUMBER_OF_API_RETRY = 3;
  private APIRequests: APIRequest[] = [];
  private BearerToken = ``;

  constructor(private httpClient: HttpClient, private ssoService: SsoService, private errorService: ErrorService) { }

  /**
   * Returns headers
   */
  private getHeaders(): HttpHeaders {
    const bearer = this.ssoService.getBearerAccessToken();
    // console.log(bearer);
    this.BearerToken = bearer;
    return new HttpHeaders({
      'Authorization': bearer,
      'Content-Type': 'application/json'
    });
  }

  /*------------------------------------TRYING SOMETHING------------------------------------*/

  /**
   * Check if a request at the specided Endpoint
   * With the specified Method exists.
   * @param url endpoint
   * @param method GET | POST | PUT
   * @returns existing APIRequest | null
   */
  private requestExists(url: string, method: APIRequestMethod): APIRequest | null {
    for (const apiRequest of this.APIRequests) {
      if (apiRequest.URL === url && apiRequest.method === method && apiRequest.promise !== null) {
        return apiRequest;
      }
    }
    return null;
  }

  /**
   * Create an APIRequest object and add
   * to the APIRequests array.
   * @param url;
   * @param method;
   * @param promise;
   */
  private cacheRequstPromise(url: string, method: APIRequestMethod, promise: Promise<Object>) {
    if (!this.requestExists(url, method)) {
      // TODO: experiment with unshift() vs push().
      this.APIRequests.push({
        URL: url,
        method: method,
        promise: promise
      });
    }
  }

  /**
   * @param request
   */
  private endRequest(request: APIRequest) {
    if (request === null || request === undefined || this.APIRequests.length < 1) {
      return;
    }
    let index = -1
    this.APIRequests.forEach((item, i) => {
      if (item.URL === request.URL && item.method === request.method) {
        index = i
      }
    });
    if (index > -1) {
      this.APIRequests.splice(index, 1);
    }
    if (this.APIRequests.length < 1) {
      // console.log(`** No more requests in waiting **`);
    }
  }

  /**
   * Remove all requests in APIRequests
   * where promise === null.
   */
  private removeEndedRequests() {
    console.log(`Removing nulled before`);
    console.dir(this.APIRequests)
    this.APIRequests = this.APIRequests.filter(item => item.promise !== null);
    console.log(`Removing nulled after`);
    console.dir(this.APIRequests);
  }
  /*------------------------------------END OF TYING SOMETHING------------------------------------*/
  /*------------------------------------Requests------------------------------------*/
  /**
   * Make an API call and get the response.
   * @param method GET PUT POST
   * @param endpoint string
   * @param body any
   * @returns Fail | Success & Response
   */
  public async request(method: APIRequestMethod, endpoint: string, body: any): Promise<APIRequestResult> {
    switch (method) {
      case APIRequestMethod.GET:
        return await this.getCall(endpoint, 0);
      case APIRequestMethod.POST:
        return await this.postCall(endpoint, body, 0);
      case APIRequestMethod.PUT:
        return await this.putCall(endpoint, body, 0);
    }
  }

  /**
   * Make an API call and get the response.
   * User Internally by API Service to re-try calls after errors.
   * Number of attempts are limited.
   * @param method GET PUT POST
   * @param endpoint string
   * @param body any
   * @returns Success | Fail & Response
   */
  private async requestRetry(method: APIRequestMethod, endpoint: string, body: any, attempts: number): Promise<APIRequestResult> {
    switch (method) {
      case APIRequestMethod.GET:
        return await this.getCall(endpoint, attempts);
      case APIRequestMethod.POST:
        return await this.postCall(endpoint, body, attempts);
      case APIRequestMethod.PUT:
        return await this.putCall(endpoint, body, attempts);
    }
  }

  /**
   * Make an POST call to specified endpoint,
   * with the specified body and return result.
   * If an Error occurs, try to handle it with handleError()
   * @param endpoint string
   * @param body JSON
   * @param attempts #of attempts (there is cap set in api service);
   * @returns Success | Fail & Response
   */
  private async postCall(endpoint: string, body: any, attempts: number): Promise<APIRequestResult> {
    const jsonBody = JSON.parse(JSON.stringify(body));
    const headers = this.getHeaders();
    try {
      const promise = this.httpClient.post<any>(endpoint, jsonBody, { headers: headers }).toPromise();
      const result = await promise;
      const requestResult: APIRequestResult = {
        success: true,
        response: result['data']
      };
      return requestResult;

    } catch (error) {
      console.log(`API ERROR`);
      const apiError: APIError = {
        endpoint: endpoint,
        body: body,
        method: APIRequestMethod.POST,
        error: error,
        attempts: (attempts + 1)
      };
      return await this.handleError(apiError);
    }
  }

  /**
  * Make a PUT call to specified endpoint
  * with the specified body and return result.
  * If an Error occurs, try to handle it with handleError()
  * @param endpoint string
  * @param body JSON
  * @param attempts #of attempts (there is cap set in api service);
  * @returns Success | Fail & Response
  */
  private async putCall(endpoint: string, body: any, attempts: number): Promise<APIRequestResult> {
    const jsonBody = JSON.parse(JSON.stringify(body));
    const headers = this.getHeaders();
    try {
      const promise = this.httpClient.put<any>(endpoint, jsonBody, { headers: headers }).toPromise();
      const result = await promise;
      const requestResult: APIRequestResult = {
        success: true,
        response: result['data']
      };
      return requestResult;

    } catch (error) {
      const apiError: APIError = {
        endpoint: endpoint,
        body: body,
        method: APIRequestMethod.PUT,
        error: error,
        attempts: (attempts + 1)
      };
      return await this.handleError(apiError);
    }
  }

  /**
   * Make a GET call to specified endpoint and return result.
   * If an Error occurs, try to handle it with handleError()
   * @param endpoint url
   * @param attempts #of attempts (there is cap set in api service);
   * @returns Success | Fail & Response
   */
  private async getCall(endpoint: string, attempts: number): Promise<APIRequestResult> {
    const headers = this.getHeaders();
    try {
      let promise: Promise<Object>;
      // Check if a call to this endpoint has already been initiated and awaiting response
      const existingRequest = this.requestExists(endpoint, APIRequestMethod.GET)
      if (existingRequest !== null) {
        promise = existingRequest.promise;
      } else {
        promise = this.httpClient.get(endpoint, { headers: headers }).toPromise();
      }
      // Cache the promise to fullfill the top code block next time
      this.cacheRequstPromise(endpoint, APIRequestMethod.GET, promise);
      const result = await promise;
      const requestResult: APIRequestResult = {
        success: true,
        response: result['data']
      };
      // remove cached request
      this.endRequest({
        URL: endpoint,
        method: APIRequestMethod.GET,
        promise: null
      });
      return requestResult;

    } catch (error) {
      const apiError: APIError = {
        endpoint: endpoint,
        body: null,
        method: APIRequestMethod.GET,
        error: error,
        attempts: (attempts + 1)
      }
      return await this.handleError(apiError);
    }
  }

  /*------------------------------------END Of Requests------------------------------------*/

  /*------------------------------------ERROR Handling------------------------------------*/
  /**
   * Handle Erros based on status codes
   * @param error APIError
   * @returns Result of hendleErrorDescision()
   */
  private async handleError(error: APIError): Promise<APIRequestResult> {
    switch (error.error.status) {
      case 401:
        // console.log(`Error 401 received, refreshing`);
        return await this.hendleErrorDescision(error, await this.decideOn401(error));
      case 404:
        // console.log(`Error 404 received: Resource is not Available`);
        return await this.hendleErrorDescision(error, APIErrorDescision.Stop);
      case 500:
        // console.log(`Error 500 received: Resource is not Available`);
        return await this.hendleErrorDescision(error, APIErrorDescision.Stop);
      case 422:
          // console.log(`Error 422 received: Unprocessable Entity`);
          return await this.hendleErrorDescision(error, APIErrorDescision.Stop);
      default:
        // console.log(`ERRPR CASE NOT HANDLED.\n Error Code received: ${error.error.status}\nObject:`);
        console.dir(error);
        return await this.hendleErrorDescision(error, APIErrorDescision.Stop);
    }
  }

  /**
   * Handle An API Error and descision:
   *  * if Retry, retry the request.
   *  * if Stop, Send fail responce to api caller
   * @param error APIError
   * @param descision APIErrorDescision
   * @returns
   *  Based on descision:
   *  * Retry:
   *    * result of requestRetry()
   *  * Stop:
   *    * !Success & empty response
   */
  private async hendleErrorDescision(error: APIError, descision: APIErrorDescision): Promise<APIRequestResult> {
    switch (descision) {
      case APIErrorDescision.Retry:
        return await this.requestRetry(error.method, error.endpoint, error.body, error.attempts);
      case APIErrorDescision.Stop:
        return {
          success: false,
          response: error,
        };
    }
  }

  /**
   * Decide how to handle a 401 error.
   * @param error APIError
   * @returns APIErrorDescision Retry | Stop
   */
  private async decideOn401(error: APIError): Promise<APIErrorDescision> {
    if (error.attempts >= this.MAX_NUMBER_OF_API_RETRY) {
      console.log(`REQUEST REACHED MAX NUMBER OF ATTEMPTS:`);
      console.dir(error);
      this.errorService.show(ErrorType.AccessDenied);
      return APIErrorDescision.Stop;
    }
    const refreshed = await this.ssoService.refreshToken();
    return refreshed ? APIErrorDescision.Retry : APIErrorDescision.Stop;
  }
  /*------------------------------------END OF ERROR Handling------------------------------------*/
}

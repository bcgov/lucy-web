import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SsoService } from './sso.service';

export enum APIRequestMethod {
  PUT,
  POST,
  GET,
}

export enum APIErrorDescision {
  Retry,
  Stop,
}

export interface APIError {
  endpoint: string
  body: any
  method: APIRequestMethod
  error: any
  attempts: number
}

export interface APIRequestResult {
  success: boolean
  response: any
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private MAX_NUMBER_OF_API_RETRY: number = 3;

  constructor(private httpClient: HttpClient, private ssoService: SsoService) { }

  /**
   * Returns headers
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': this.ssoService.getBearerAccessToken(),
      'Content-Type': 'application/json'
    });
  }

  /**
   * Make an API call and get the response.
   * @param method GET PUT POST
   * @param endpoint string
   * @param body any
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
   */
  private async postCall(endpoint: string, body: any, attempts: number): Promise<APIRequestResult> {
    console.log("POST: ")
    console.dir(body)
    const jsonBody = JSON.parse(JSON.stringify(body))
    try {
      const result = await this.httpClient.post<any>(endpoint, jsonBody, { headers: this.getHeaders() }).toPromise();
      console.log(result['message'])

      const requestResult: APIRequestResult = {
        success: true,
        response: result['data']
      }
      return requestResult

    } catch (error) {
      const apiError: APIError = {
        endpoint: endpoint,
        body: body,
        method: APIRequestMethod.POST,
        error: error,
        attempts: (attempts + 1)
      }
      return await this.handleError(apiError);
    }
  }

  /**
  * Make a PUT call to specified endpoint 
  * with the specified body and return result.
  * If an Error occurs, try to handle it with handleError()
  * @param endpoint string
  * @param body JSON
  */
  private async putCall(endpoint: string, body: any, attempts: number): Promise<APIRequestResult> {
    console.log("PUT: ")
    console.dir(body)
    const jsonBody = JSON.parse(JSON.stringify(body))
    console.log(jsonBody);
    console.dir(this.getHeaders());
    try {
      const result = await this.httpClient.put<any>(endpoint, jsonBody, { headers: this.getHeaders() }).toPromise();
      console.log(result['message'])

      const requestResult: APIRequestResult = {
        success: true,
        response: result['data']
      }
      return requestResult

    } catch (error) {
      const apiError: APIError = {
        endpoint: endpoint,
        body: body,
        method: APIRequestMethod.PUT,
        error: error,
        attempts: (attempts + 1)
      }
      return await this.handleError(apiError);
    }
  }

  /**
   * Make a GET call to specified endpoint and return result.
   * If an Error occurs, try to handle it with handleError()
   * @param endpoint 
   * @param body 
   */
  private async getCall(endpoint: string, attempts: number): Promise<APIRequestResult> {
    try {
      const result = await this.httpClient.get(endpoint, { headers: this.getHeaders() }).toPromise();
      console.log(result['message'])

      const requestResult: APIRequestResult = {
        success: true,
        response: result['data']
      }
      return requestResult

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

  private async hendleErrorDescision(error: APIError, descision: APIErrorDescision): Promise<APIRequestResult> {
    switch (descision) {
      case APIErrorDescision.Retry:
        return await this.requestRetry(error.method, error.endpoint, error.body, error.attempts);
      case APIErrorDescision.Stop:
        return {
          success: false,
          response: null
        }
    }
  }

  private async handleError(error: APIError): Promise<APIRequestResult> {
    switch (error.error.status) {
      case 401:
        console.log("Error 401 received, refreshing");
        return await this.hendleErrorDescision(error, await this.decideOn401(error));
      default:
          console.log(`Unhandled error received ${error.error.status}`);
        return {
          success: false,
          response: null
        }
    }
  }

  private async decideOn401(error: APIError): Promise<APIErrorDescision> {
    if (error.attempts >= this.MAX_NUMBER_OF_API_RETRY) {
      return APIErrorDescision.Stop;
    }
    const refreshed = await this.ssoService.refreshToken();
    return refreshed ? APIErrorDescision.Retry : APIErrorDescision.Stop;
  }
}

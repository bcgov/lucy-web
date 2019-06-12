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
  endpoint: string;
  body: any;
  method: APIRequestMethod;
  error: any
}

export interface APIRequestResult {
  success: boolean,
  Response: any,
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {

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
   * Make an POST call to specified endpoint, 
   * with the specified body and return result.
   * If an Error occurs, try to handle it with handleError()
   * @param endpoint string
   * @param body JSON
   */
  public async postCall(endpoint: string, body: any): Promise<any> {
    console.log("POST: ")
    console.dir(body)
    const jsonBody = JSON.parse(JSON.stringify(body))
    try {
      const result = await this.httpClient.post<any>(endpoint, jsonBody, { headers: this.getHeaders() }).toPromise();
      console.log(result['message'])
      return result['data']
    } catch (error) {
      console.log(error.status)
      return error
    }
  }

  /**
  * Make a PUT call to specified endpoint 
  * with the specified body and return result.
  * If an Error occurs, try to handle it with handleError()
  * @param endpoint string
  * @param body JSON
  */
  public async putCall(endpoint: string, body: any): Promise<any> {
    console.log("PUT: ")
    console.dir(body)
    const jsonBody = JSON.parse(JSON.stringify(body))
    try {
      const result = await this.httpClient.put<any>(endpoint, jsonBody, { headers: this.getHeaders() }).toPromise();
      console.log(result['message'])
      return result['data']
    } catch (error) {
      console.log(error.status)
      return error
    }
  }

  /**
   * Make a GET call to specified endpoint and return result.
   * If an Error occurs, try to handle it with handleError()
   * @param endpoint 
   * @param body 
   */
  public async getCall(endpoint: string): Promise<any> {
    try {
      const result = await this.httpClient.get(endpoint, { headers: this.getHeaders() }).toPromise();
      console.log(result['message'])
      return result['data']
    } catch (error) {
      console.log(error.status)
      return error
    }
  }

  /**
   * Make an API call and get the response.
   * @param method GET PUT POST
   * @param endpoint string
   * @param body any
   */
  public async request(method: APIRequestMethod, endpoint: string, body: any): Promise<any> {
    switch (method) {
      case APIRequestMethod.GET:
        return await this.getCall(endpoint);
      case APIRequestMethod.POST:
        return await this.postCall(endpoint, body);
      case APIRequestMethod.PUT:
        return await this.putCall(endpoint, body);
    }
  }

  private async hendleErrorDescision(error: APIError, descision: APIErrorDescision): Promise<any> {
    switch(descision) {
      case APIErrorDescision.Retry:
        return await this.request(error.method, error.endpoint, error.body);
      case APIErrorDescision.Stop: 
        break;
    }
  }

  private async handleError(error: APIError): Promise<any> {
    switch (error.error.status) {
      case 401:
        console.log("Error 401 received");
        return await this.hendleErrorDescision(error, await this.decideOn401(error));
    }
  }

  private async decideOn401(error: APIError): Promise<APIErrorDescision> {
    const refreshed = await this.ssoService.refreshToken();
    return refreshed? APIErrorDescision.Retry : APIErrorDescision.Stop;
  }
}

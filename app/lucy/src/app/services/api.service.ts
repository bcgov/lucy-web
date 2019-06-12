import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SsoService } from './sso.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient, private ssoService: SsoService){ }

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
   * with the specified body
   * and return result
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
      return error
    }
  }

   /**
   * Make a PUT call to specified endpoint, 
   * with the specified body
   * and return result
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
      return error
    }
  }

  /**
   * Make a GET call to specified endpoint and return result
   * @param endpoint 
   * @param body 
   */
  public async getCall(endpoint: string): Promise<any> {
    try {
      const result = await this.httpClient.get(endpoint, { headers: this.getHeaders() }).toPromise();
      return result['data']
    } catch (error) {
      return error
    }
  }
}

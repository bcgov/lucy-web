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
import { Router, ActivatedRoute } from '@angular/router';
import { AppConstants } from '../constants';
import { CookieService } from 'ngx-cookie-service';

import * as queryString from 'querystring';
import * as jwtDecode from 'jwt-decode';

interface TokenReponse {
  success: boolean;
  accessToken: string;
  accessTokenExpiery: number;
  refreshToken: string;
  refreshTokenTokenExpiery: number;
}

export enum SSOLoginProvider {
  BCeID,
  idir
}

@Injectable({
  providedIn: 'root'
})

export class SsoService {
  private static instance: SsoService;

  private code = ``;
  private refreshTimer: any;
  private refreshTokenExpieryTimer: any;
  private bearerToken: string | null = null;
  private tokenExpiery: Date | null;

  private accessTokenCookie = 'accessToken';
  private refreshTokenCookie = 'refreshToken';
  private refreshTokenExpieryCookie = 'refreshTokenExpiery';
  private accessTokenExpieryCookie = 'accessTokenExpiery';

  constructor(private cookieService: CookieService, private httpClient: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {
    // If user is not authenticated, listen to route changes
    if (!this.isAuthenticated()) {
      this.listenForRidirect();
    } else {
      // User is not authenticated. wait for redirect.
      this.beginTokenRefreshTimer();
    }
  }

  /***** Computed variables *****/

  /**
  * Return Login endpoint by concatenating Constants from AppConstants -> SSOConstants
  */
  private SSO_LoginEndpoint(): string {
    const baseAuthEndpoint = `${AppConstants.SSOConstants.SSO_BASE_URL}/auth/realms/${AppConstants.SSOConstants.SSO_REALM_NAME}/protocol/openid-connect`;
    return `${baseAuthEndpoint}/auth?response_type=code&client_id=${AppConstants.SSOConstants.SSO_CLIENT_ID}&redirect_uri=${AppConstants.SSOConstants.SSO_LOGIN_REDIRECT_URI}&code_challenge_method=${AppConstants.SSOConstants.SSO_CODE_CHALLENGE_METHOD}`;
  }

  private SSO_idirLoginEndpoint(): string {
    return `${this.SSO_LoginEndpoint()}&kc_idp_hint=idir`;
  }

  private SSO_BCeidLoginEndpoint(): string {
    return `${this.SSO_LoginEndpoint()}&kc_idp_hint=bceid`;
  }

  /**
   * Returns Token endpoint by concatenating Constants from AppConstants -> SSOConstants
   */
  private SSO_TokenEndpoint(): string {
    return `${AppConstants.SSOConstants.SSO_BASE_URL}/auth/realms/${AppConstants.SSOConstants.SSO_REALM_NAME}/protocol/openid-connect/token`;
  }

  /**
   * Returns endpoint for logout
   */
  private SSO_LogoutEndpoint(): string {
    return `${AppConstants.SSOConstants.SSO_BASE_URL}/auth/realms/${AppConstants.SSOConstants.SSO_REALM_NAME}/protocol/openid-connect/logout?redirect_uri=${AppConstants.SSOConstants.SSO_LOGIN_REDIRECT_URI}`;
  }

  /**
   * Returns endpoint to refresh token using refresh token
   */
  private SSO_RefreshTokenEndpoint(): string {
    return `${AppConstants.SSOConstants.SSO_BASE_URL}/auth/realms/${AppConstants.SSOConstants.SSO_REALM_NAME}/protocol/openid-connect/token`;
  }

  /**
   * Returns headers that avoid CORS issue
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });
  }
  /***** End of computed variables *****/

  /**
   * NOTE: This one is currently not used.
   *
   * For this alternative:
   * - This should be used in combination with this.isAuthenticated2()
   * - Constructor should be empty
   * - Call this on each page refresh
   *
   * If access token doesnt exist, but refresh token exists -> Refresh access token
   * otherwise listen for redirect.
   * (if both exist, user is autenticated and no action is required.
   *  isAuthenticated2() will also do the refresh.
   * )
   */
  private initAuthenticator() {
    if (!this.cookieService.check(this.accessTokenCookie) && this.cookieService.check(this.refreshTokenCookie)) {
      // User is autneticated but access token is expired.
      this.refreshToken();
    } else {
      // User is not authenticated. wait for redirect.
      this.listenForRidirect();
    }
  }

  /**
   * Triggers a refreshToken()
   * when
   * Access token expires.
   */
  private beginTokenRefreshTimer() {
    const expiresIn = this.convertUTCDateStringToMillisecondsFromNow(this.getAccessTokenExpiery());
    if (Number(expiresIn) && expiresIn < 0 && this.cookieService.check(this.refreshTokenCookie)) {
      this.refreshToken();
    } else if (Number(expiresIn)) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = setTimeout(() => {
        // stop refresh token refresh timer
        clearTimeout(this.refreshTokenExpieryTimer);
        this.refreshToken();
      }, (expiresIn - 5000)); // set expiery to 5 seconds before the time specified in token
    } else {
      console.log(`invalid expiery`);
    }
  }

  /**
   * When a refresh token is expired, we can no longer
   * refresh the access token.
   */
  private beginRefreshExpieryTimer() {
    const expiresIn = this.convertUTCDateStringToMillisecondsFromNow(this.getRefreshTokenExpiery());
    if (Number(expiresIn) && expiresIn <= 0) {
      this.logout();
    } else if (Number(expiresIn)) {
      clearTimeout(this.refreshTokenExpieryTimer);
      this.refreshTokenExpieryTimer = setTimeout(() => {
        // stop token refresh timer
        clearTimeout(this.refreshTimer);
        this.refreshToken();
      }, (expiresIn - 5000)); // set expiery to 5 seconds before the time specified in token
    } else {
      console.log(`invalid expiery`);
    }
  }

  /**
   * Check if access token OR exiery token exist
   */
  public isAuthenticated(): boolean {
    // console.log('\nChcecking is authenticated.\n')
    return (this.cookieService.check(this.accessTokenCookie) || this.cookieService.check(this.refreshTokenCookie));
  }

  /**
   * Check if access token exists
   * otherwise check if it can be refreshed
   * 
   */
  public async isAuthenticatedAsync(): Promise<boolean> {
    if (!this.cookieService.check(this.accessTokenCookie)) {
      // If access token is expired, check if the refresh token is still valid
      if (!this.cookieService.check(this.refreshTokenCookie)) {
        // If refresh token is expired too, return false
        return false;
      } else {
        return await this.refreshToken();
      }
    } else {
      return true;
    }
  }

  /**
   * Perform Login by opening URL specified by SSO_LoginEndpoint()
   * After successful login, user will be re-directed back to the redirect uri spesified in
   * AppConstants -> SSOConstants -> SSO_LOGIN_REDIRECT_URI
   * THe route will include a code that we will use in getToken() to get the user's token
   * @param provider SSOLoginProvider
   */
  public async login(provider: SSOLoginProvider) {
    AppConstants.getAuthorizationParams().then((authorizationParams) => {
      switch (provider) {
        case SSOLoginProvider.idir: {
          window.open(`${this.SSO_idirLoginEndpoint()}&code_challenge=${encodeURIComponent(authorizationParams.code_challenge)}&state=${encodeURIComponent(authorizationParams.state)}&nonce=${encodeURIComponent(authorizationParams.nonce)}`, `_self`);
          break;
        }
        case SSOLoginProvider.BCeID: {
          window.open(`${this.SSO_BCeidLoginEndpoint()}&code_challenge=${encodeURIComponent(authorizationParams.code_challenge)}&state=${encodeURIComponent(authorizationParams.state)}&nonce=${encodeURIComponent(authorizationParams.nonce)}`, `_self`);
          break;
        }
        default: {
          window.open(`${this.SSO_LoginEndpoint()}&code_challenge=${encodeURIComponent(authorizationParams.code_challenge)}&state=${encodeURIComponent(authorizationParams.state)}&nonce=${encodeURIComponent(authorizationParams.nonce)}`, `_self`);
          break;
        }
      }
    });
  }

  /**
   * Remove cookies,
   * end refresh timer,
   * and end keycloak session
   */
  public logout() {
    this.removeCookies();
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      clearTimeout(this.refreshTokenExpieryTimer);
    }
    this.endKeycloakSession();
  }

  /**
   * Remove Cookies
   */
  private removeCookies() {
    this.cookieService.delete(this.accessTokenCookie);
    this.cookieService.delete(this.refreshTokenCookie);
    this.cookieService.delete(this.refreshTokenExpieryCookie);
    this.cookieService.delete(this.accessTokenExpieryCookie);
  }

  /**
   * End session on Keycloak
   */
  private endKeycloakSession() {
    window.open(this.SSO_LogoutEndpoint(), '_self');
  }

  /**
   * Refresh Access token using refresh token
   */
  public async refreshToken(): Promise<boolean> {
    const result = await this.getAccessTokenFromRefreshToken(this.getRefreshToken());
    if (result !== undefined) {
      this.storeAccessToken(result.accessToken, result.accessTokenExpiery);
      this.storeRefreshToken(result.refreshToken, result.refreshTokenTokenExpiery);
      return (this.getAccessToken() !== '');
    } else {
      this.removeCookies();
      return false;
    }
  }

  /**
   * Retruns Access token fetched using refresh token
   */
  private async getAccessTokenFromRefreshToken(refreshToken: string): Promise<TokenReponse | undefined> {
    const data = {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      redirect_uri: AppConstants.SSOConstants.SSO_LOGIN_REDIRECT_URI,
      client_id: AppConstants.SSOConstants.SSO_CLIENT_ID,
    };

    try {
      const result = await this.httpClient.post<any>(this.SSO_RefreshTokenEndpoint(), queryString.stringify(data), { headers: this.getHeaders() }).toPromise();
      return this.getTokensFromAPIResult(result);
    } catch (error) {
      console.log(`Refresh token failed with Error:`);
      console.dir(error);
      return undefined;
    }
  }

  private getTokensFromAPIResult(result: any): TokenReponse | undefined {
    // PKCE Validation
    const oidc_nonce = sessionStorage.getItem('oidc_nonce');
    const tokenNonce = jwtDecode(result.refresh_token)['nonce'];

    if (result['success'] === false || oidc_nonce !== tokenNonce) {
      return undefined;
    } else {
      const accessToken = result['access_token'];
      const expiresIn = result['expires_in'];
      const newRefreshToken = result['refresh_token'];
      const newRefreshTokenExpiery = result['refresh_expires_in'];

      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('code_verifier');
      sessionStorage.removeItem('code_challenge');

      if (!accessToken || !expiresIn || !newRefreshToken || !newRefreshTokenExpiery) {
        console.log('response doesnt have all required data');
        return undefined;
      } else {
        return {
          success: true,
          accessToken: accessToken,
          accessTokenExpiery: expiresIn,
          refreshToken: newRefreshToken,
          refreshTokenTokenExpiery: newRefreshTokenExpiery,
        };
      }
    }
  }

  /**
   * Returns extracted code from route
   */
  private extractCodeFromRoute(): string {
    return this.activatedRoute.snapshot.queryParams['code'];
  }

  /**
  * Listen for route change and wait for code to exists in route.
  */
  private listenForRidirect() {
    // Before initiating listener, check if code is already there
    if (this.extractCodeFromRoute() !== '' && this.extractCodeFromRoute() !== undefined) {
      this.handleLoginOnRedirect();
      return;
    }
    const listener = this.router.events.subscribe((val) => {
      if (this.extractCodeFromRoute() !== '' && this.extractCodeFromRoute() !== undefined) {
        listener.unsubscribe();
        this.handleLoginOnRedirect();
      }
    });
  }

  /**
   * if the activated route contains the 'code' query parameter:
   * Use fetchAndStoreTokenFromCode()) to get
   * and store user tokens in cookies.
   * then clear query parameters.
   */
  private async handleLoginOnRedirect(): Promise<boolean> {
    // console.log("** We were re-directed... getting code from route\n")
    const codeFromRoute = this.extractCodeFromRoute();
    // console.log("** Code: \n")
    // console.log(codeFromRoute);

    /**
     * This function gets called from listenForRidirect().
     * the listener in listenForRidirect() could be sending multiple
     * calls to this function before being unsubscribed.
     *
     * lets make sure we only make 1 api call for each code
     */
    if (this.code === codeFromRoute) {
      return this.isAuthenticated();
    } else {
      this.code = codeFromRoute;
    }

    // console.log("\nhere")

    return await this.fetchAndStoreTokenFromCode(codeFromRoute);
  }

  /**
   * Get User's Access and Refresh token and store them in cookies
   * then clears query parameters.
   * @param code
   */
  private async fetchAndStoreTokenFromCode(code: string): Promise<boolean> {
    // console.log("**getting tokens from code\n")
    const result = await this.getTokensFromCode(code);
    // console.dir(result);
    if (result.success) {
      this.storeAccessToken(result.accessToken, result.accessTokenExpiery);
      this.storeRefreshToken(result.refreshToken, result.refreshTokenTokenExpiery);
      this.clearQueryParams();

      // Verify that the tokens are stored.
      return (this.getAccessToken() !== '' && this.getRefreshToken() !== '');
    } else {
      return false;
    }
  }

  /**
   * Makes a Post call to URL generated by SSO_TokenEndpoint()
   * to get user's tokens from code returned in login()
   * Returns User's Tokens
   * @param code
   */
  private async getTokensFromCode(code: string): Promise<TokenReponse> {
    const data = {
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: AppConstants.SSOConstants.SSO_LOGIN_REDIRECT_URI,
      client_id: AppConstants.SSOConstants.SSO_CLIENT_ID,
      code_verifier: sessionStorage.getItem('code_verifier')
    };

    const response: TokenReponse = {
      success: false,
      accessToken: '',
      accessTokenExpiery: 0,
      refreshToken: '',
      refreshTokenTokenExpiery: 0,
    };

    try {
      const result = await this.httpClient.post<any>(this.SSO_TokenEndpoint(), queryString.stringify(data), { headers: this.getHeaders() }).toPromise();
      return this.getTokensFromAPIResult(result);
    } catch (error) {
      console.log(`login fails with Error: ${error}`);
      console.dir(error);
      response.success = false;
      return response;
    }
  }

  /**
   * Clear QueryParameters
   */
  private clearQueryParams() {
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {} });
  }

  /**
   * Store access token in cookies
   * Also store token's expiery time in UTC format.
   * @param token
   * @param expiery
   */
  storeAccessToken(token: string, expiery: number) {
    this.bearerToken = token;
    const tokenExpieryInSconds = Date.now() + (expiery * 1000);
    const expieryDate = new Date(tokenExpieryInSconds);
    const expieryDateUTC = expieryDate.toUTCString();
    this.cookieService.set(this.accessTokenCookie, token, expieryDate, null, null, true, 'None');
    this.cookieService.set(this.accessTokenExpieryCookie, expieryDateUTC, expieryDate, null, null, true, 'None');
    this.beginTokenRefreshTimer();
  }

  /**
   * Store refresh token in cookies
   * @param token
   * @param expiery
   */
  storeRefreshToken(token: string, expiery: number) {
    const tokenExpieryInSconds = Date.now() + (expiery * 1000);
    const expieryDate = new Date(tokenExpieryInSconds);
    const expieryDateUTC = expieryDate.toUTCString();
    this.cookieService.set(this.refreshTokenCookie, token, expieryDate, null, null, true, 'None');
    this.cookieService.set(this.refreshTokenExpieryCookie, expieryDateUTC, expieryDate, null, null, true, 'None');
    this.beginRefreshExpieryTimer();
  }

  /**
   * Return Access Token stored in cookies.
   * Return empty string if doesnt exist.
   */
  private getAccessToken(): string {
    if (this.bearerToken !== null) {
      return this.bearerToken;
    }
    const token = this.cookieService.get(this.accessTokenCookie);
    if (token === undefined) {
      return ``;
    } else {
      this.bearerToken = (token);
      return token;
    }
  }

  /**
   * Return Access Token expiery date stored
   * in cookies.
   * Return empty string if doesnt exist.
   */
  private getAccessTokenExpiery(): string {
    const expieryDateUTCString = this.cookieService.get(this.accessTokenExpieryCookie);
    if (expieryDateUTCString === undefined) {
      return ``;
    } else {
      return expieryDateUTCString;
    }
  }

  private getRefreshTokenExpiery(): string {
    const expieryDateUTCString = this.cookieService.get(this.refreshTokenExpieryCookie);
    if (expieryDateUTCString === undefined) {
      return ``;
    } else {
      return expieryDateUTCString;
    }
  }

  /**
   * Convert UTC date in string format
   * to milliseconds from now
   * NOTE: Returns -1 if string is emtpty.
   * @param dateUTCString
   */
  private convertUTCDateStringToMillisecondsFromNow(dateUTCString): number {
    if (dateUTCString === ``) {
      return -1;
    }
    const expieryDate = new Date(Date.parse(dateUTCString));
    return expieryDate.getTime() - new Date().getTime();
  }

  /**
   * Return Refresh token stored in cookies.
   * Return empty string if doesnt exist.
   */
  private getRefreshToken(): string {
    const token = this.cookieService.get(this.refreshTokenCookie);
    if (token === undefined) {
      return ``;
    } else {
      return token;
    }
  }

  /**
   * Return access token with 'bearer' appended
   */
  public getBearerAccessToken(): string {
    return (`Bearer ${this.getAccessToken()}`);
  }

  /**
   * Decode JWT token and return result
   */
  public getTokenInformation(): any {
    const token = this.getAccessToken();
    if (token === ``) { return null; }
    return jwtDecode(token);
  }

  /**
   * Extract Username from token
   */
  public getUsername(): string {
    const jwtDecoded = this.getTokenInformation();
    if (jwtDecoded == null) {
      return undefined;
    }
    const username = jwtDecoded['preferred_username'];
    return username;
  }
}

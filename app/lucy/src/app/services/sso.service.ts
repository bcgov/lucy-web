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

interface RefreshTokenReponse {
  success: boolean;
  accessToken: string;
  accessTokenExpiery: number;
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

  private code: string = "";
  private refreshTimer = null;

  // public static get shared(): SsoService {
  //   return this.instance || (this.instance = new this());
  // }

  constructor(private cookieService: CookieService, private httpClient: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {
    // If user is not authenticated, listen to route changes
    if (!this.isAuthenticated()) {
      this.listenForRidirect();
    } else {
      // User is not authenticated. wait for redirect.
      this.beginTokeRefreshTimer()
    }
  }

  /***** Computed variables *****/

   /**
   * Return Login endpoint by concatenating Constants from AppConstants -> SSOConstants
   */
  private SSO_LoginEndpoint(): string {
    const baseAuthEndpoint = `${AppConstants.SSOConstants.SSO_BASE_URL}/auth/realms/${AppConstants.SSOConstants.SSO_REALM_NAME}/protocol/openid-connect`;
    return `${baseAuthEndpoint}/auth?response_type=code&client_id=${AppConstants.SSOConstants.SSO_CLIENT_ID}&redirect_uri=${AppConstants.SSOConstants.SSO_LOGIN_REDIRECT_URI}`;
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
    if (!this.cookieService.check('accessToken') && this.cookieService.check('refreshToken')) {
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
  private beginTokeRefreshTimer() {
    const expiresIn = this.convertUTCDateStringToMillisecondsFromNow(this.getAccessTokenExpiery());

    if (expiresIn < 0 && this.cookieService.check('refreshToken')) {
      this.refreshToken();
    } else {
      this.refreshTimer = setTimeout(function () {
        this.refreshToken();
      }, (expiresIn));
    }
  }

  /**
   * Check if access token OR exiery token exist
   */
  public isAuthenticated(): boolean {
    return (this.cookieService.check('accessToken') || this.cookieService.check('refreshToken'));
  }

  /**
   * NOTE: This one is currently not used.
   * 
   * Check if access token exists
   * otherwise check if it can be refreshed
   * 
   */
  private async isAuthenticated2(): Promise<boolean> {
    if (!this.cookieService.check('accessToken')) {
      // If access token is expired, check if the refresh token is still valid
      if (!this.cookieService.check('refreshToken')) {
        // If refresh token is expired too, return false
        return false
      } else {
        return await this.refreshToken();
      }
    } else {
      return true
    }
  }

  /**
   * Perform Login by opening URL specified by SSO_LoginEndpoint()
   * After successful login, user will be re-directed back to the redirect uri spesified in 
   * AppConstants -> SSOConstants -> SSO_LOGIN_REDIRECT_URI 
   * THe route will include a code that we will use in getToken() to get the user's token
   * @param provider SSOLoginProvider
   */
  public login(provider: SSOLoginProvider) {
    switch(provider) { 
      case SSOLoginProvider.idir: { 
         window.open(this.SSO_idirLoginEndpoint(), "_self");
         break; 
      } 
      case SSOLoginProvider.BCeID: { 
         window.open(this.SSO_BCeidLoginEndpoint(), "_self");
         break; 
      } 
      default: { 
         window.open(this.SSO_LoginEndpoint(), "_self");
         break; 
      } 
   } 
  }

  /**
   * Remove cookies 
   * end refresh timer
   * and end keycloak session
   */
  public logout() {
    this.removeCookies();
    if (this.refreshTimer != null) {
      clearTimeout(this.refreshTimer);
    }
    this.endKeycloakSession();
  }

  /**
   * Remove Cookies
   */
  private removeCookies(){
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
    this.cookieService.delete('accessTokenExpiery');
  }

  /**
   * End session on Keycloak
   */
  endKeycloakSession() {
    window.open(this.SSO_LogoutEndpoint(), "_self");
  }

  /**
   * Refresh Access token using refresh token
   */
  private async refreshToken(): Promise<boolean> {
    const result = await this.getAccessTokenFromRefreshToken(this.getRefreshToken());
    if (result.success) {
      this.storeAccessToken(result.accessToken, result.accessTokenExpiery);
      return (this.getAccessToken() != "");
    } else {
      this.removeCookies()
      return false;
    }
  }

  /**
   * Retruns Access token fetched using refresh token
   */
  private async getAccessTokenFromRefreshToken(refreshToken: string): Promise<RefreshTokenReponse> {
    const data: object = {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      redirect_uri: AppConstants.SSOConstants.SSO_LOGIN_REDIRECT_URI,
      client_id: AppConstants.SSOConstants.SSO_CLIENT_ID,
    };

    var response: RefreshTokenReponse = {
      success: false,
      accessToken: "",
      accessTokenExpiery: 0,
    };

    try {
      const result = await this.httpClient.post<any>(this.SSO_RefreshTokenEndpoint(), queryString.stringify(data), { headers: this.getHeaders() }).toPromise();
      if (result['success'] == false) {
        response.success = false;
        return response;
      } else {
        const accessToken = result["access_token"];
        const expiresIn = result["expires_in"];
        if (accessToken == undefined || expiresIn == undefined) {
          response.success = false;
          return response;
        } else {
          response.accessToken = accessToken;
          response.accessTokenExpiery = expiresIn;
          response.success = true
          return response;
        }
      }

    } catch (error) {
      console.log(`Refresh token failed with Error: ${error}`);
      console.dir(error);
      response.success = false;
      return response;
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
    if (this.extractCodeFromRoute() != "" && this.extractCodeFromRoute() != undefined) {
      this.handleLoginOnRedirect();
      return;
    }
    var listener = this.router.events.subscribe((val) => {
      if (this.extractCodeFromRoute() != "" && this.extractCodeFromRoute() != undefined) {
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
    const codeFromRoute = this.extractCodeFromRoute();

    /**
     * This function gets called from listenForRidirect().
     * the listener in listenForRidirect() could be sending multiple 
     * calls to this function before being unsubscribed. 
     * 
     * lets make sure we only make 1 api call for each code
     */
    if (this.code == codeFromRoute) {
      return this.isAuthenticated();
    } else {
      this.code = codeFromRoute;
    }

    return await this.fetchAndStoreTokenFromCode(codeFromRoute);
  }

  /**
   * Get User's Access and Refresh token and store them in cookies
   * then clears query parameters.
   * @param code 
   */
  private async fetchAndStoreTokenFromCode(code: string): Promise<boolean> {
    const result = await this.getTokensFromCode(code);
    if (result.success) {
      this.storeAccessToken(result.accessToken, result.accessTokenExpiery);
      this.storeRefreshToken(result.refreshToken, result.refreshTokenTokenExpiery);
      this.clearQueryParams();

      // Verify that the tokens are stored.
      return (this.getAccessToken() != "" && this.getRefreshToken() != "");
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
    const data: object = {
      code: code,
      grant_type: "authorization_code",
      redirect_uri: AppConstants.SSOConstants.SSO_LOGIN_REDIRECT_URI,
      client_id: AppConstants.SSOConstants.SSO_CLIENT_ID,
    };

    var response: TokenReponse = {
      success: false,
      accessToken: "",
      accessTokenExpiery: 0,
      refreshToken: "",
      refreshTokenTokenExpiery: 0,
    };

    try {
      const result = await this.httpClient.post<any>(this.SSO_TokenEndpoint(), queryString.stringify(data), { headers: this.getHeaders() }).toPromise();

      if (result['success'] == false) {
        response.success = false;
        return response;
      } else {
        const accessToken = result["access_token"];
        const expiresIn = result["expires_in"];
        const refreshToken = result['refresh_token'];
        const refreshExpiresIn = result["refresh_expires_in"];
        if (
          accessToken == undefined ||
          expiresIn == undefined ||
          refreshExpiresIn == undefined ||
          refreshToken == undefined
        ) {
          response.success = false;
          return response;
        } else {
          response.accessToken = accessToken;
          response.accessTokenExpiery = expiresIn;
          response.refreshToken = refreshToken;
          response.refreshTokenTokenExpiery = refreshExpiresIn;
          response.success = true
          return response;
        }
      }

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
  private storeAccessToken(token: string, expiery: number) {
    const tokenExpieryInSconds = Date.now() + (expiery * 1000);
    const expieryDate = new Date(tokenExpieryInSconds)
    const expieryDateUTC = expieryDate.toUTCString()
    this.cookieService.set('accessToken', token, expieryDate);
    this.cookieService.set('accessTokenExpiery', expieryDateUTC, expieryDate);
    // TODO: consider using this.beginTokeRefreshTimer()
  }

  /**
   * Store refresh token in cookies
   * @param token 
   * @param expiery 
   */
  private storeRefreshToken(token: string, expiery: number) {
    const tokenExpieryInSconds = Date.now() + (expiery * 1000);
    this.cookieService.set('refreshToken', token, new Date(tokenExpieryInSconds));
  }

  /**
   * Return Access Token stored in cookies.
   * Return empty string if doesnt exist.
   */
  private getAccessToken(): string {
    const token = this.cookieService.get('accessToken');
    if (token == undefined) {
      return "";
    } else {
      return token
    }
  }

  /**
   * Return Access Token expiery date stored
   * in cookies.
   * Return empty string if doesnt exist.
   */
  private getAccessTokenExpiery(): string {
    const expieryDateUTCString = this.cookieService.get('accessTokenExpiery');
    if (expieryDateUTCString == undefined) {
      return "";
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
    if (dateUTCString == "") {
      return -1
    }
    const expieryDate = new Date(Date.parse(dateUTCString));
    return expieryDate.getTime() - new Date().getTime();
  }

  /**
   * Return Refresh token stored in cookies.
   * Return empty string if doesnt exist.
   */
  private getRefreshToken(): string {
    const token = this.cookieService.get('refreshToken');
    if (token == undefined) {
      return "";
    } else {
      return token
    }
  }

  /**
   * Return qccess token with 'bearer' appended
   */
  public getBearerAccessToken(): string {
    return ("Bearer " + this.getAccessToken());
  }

  /**
   * Decode JWT token and return result
   */
  private getTokenInformation() {
    const token = this.getAccessToken();
    if (token == "") { return null };
    return jwtDecode(token);
  }

  /**
   * Extract Username from token
   */
  public getUsername(): string {
    const jwtDecoded = this.getTokenInformation();
    if (jwtDecoded == null) {
      return undefined
    }
    const username = jwtDecoded['preferred_username'];
    return username;
  }
}




export class AppConstants {

    // SSO
    static SSOConstants = {
        SSO_CLIENT_ID : "lucy",
        SSO_BASE_URL : "https://sso.pathfinder.gov.bc.ca",
        SSO_REALM_NAME : "dfmlcg7z",
        SSO_LOGIN_REDIRECT_URI : "http://localhost:4200/Profile",
    }

    static SSO_LoginEndpoint() : string {
        const baseAuthEndpoint = `${this.SSOConstants.SSO_BASE_URL}/auth/realms/${this.SSOConstants.SSO_REALM_NAME}/protocol/openid-connect`;
        return `${baseAuthEndpoint}/auth?response_type=code&client_id=${this.SSOConstants.SSO_CLIENT_ID}&redirect_uri=${this.SSOConstants.SSO_LOGIN_REDIRECT_URI}`;
    }

    static SSO_TokenEndpoint() : string {
        return `${this.SSOConstants.SSO_BASE_URL}/auth/realms/${this.SSOConstants.SSO_REALM_NAME}/protocol/openid-connect/token`;
    }
    

}



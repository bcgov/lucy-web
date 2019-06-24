


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

    // API
    static API_baseURL: string = "http://localhost:80/api/v1";

    // API authenticated user endpoints
    static API_me: string = `${AppConstants.API_baseURL}/account/me`;
    static API_DataEntryAccessRequest: string = `${AppConstants.API_baseURL}/request-access`;
    static API_messages: string = `${AppConstants.API_baseURL}/account/message`;

    static API_allUsers: string = `${AppConstants.API_baseURL}/account/users`;

    // API Non static endpoints
    static API_user(id: number) : string {
        return `${AppConstants.API_baseURL}/account/user/${id}`;
    }

    static API_updateUserMessage(id: number): string {
        return `${AppConstants.API_baseURL}/account/message/${id}`;
    }

    static API_AcessRequestResponse(id: number): string {
        return `${AppConstants.API_baseURL}/request-access/${id}`;
    }

    // API Reference data
    static API_refrenceData = {
        roles: `${AppConstants.API_baseURL}/account/roles`
    }
    

}



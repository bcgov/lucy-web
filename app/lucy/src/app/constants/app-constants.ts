
/**
 * @description Advance declare window obj
 */
declare var window: any;
export class AppConstants {

    // SSO
    static SSOConstants = {
        SSO_CLIENT_ID : `lucy`,
        SSO_BASE_URL : `https://sso.pathfinder.gov.bc.ca`,
        SSO_REALM_NAME : `dfmlcg7z`,
        SSO_LOGIN_REDIRECT_URI : `http://${window.location.host}`,
    };

    // API
    static API_baseURL = 'http://localhost:80/api';

    // Default Config
    static CONFIG = {
        apiHost: 'localhost',
        changeVersion: 'NA',
        env: 'prod',
        version: 'NA'
    };

    // API authenticated user endpoints
    static get API_me(): string { return `${AppConstants.API_baseURL}/account/me`; }
    static get API_DataEntryAccessRequest(): string { return `${AppConstants.API_baseURL}/request-access`; }
    static get API_messages(): string { return `${AppConstants.API_baseURL}/account/message`; }
    static get API_allUsers(): string { return `${AppConstants.API_baseURL}/account/users`; }

    // Form Config Mechanical
    static get API_Form_MechanicalTreatment(): string { return `${AppConstants.API_baseURL}/treatment/mechanical/config`; }
    // Form Config Observation
    static get API_Form_Observation(): string { return `${AppConstants.API_baseURL}/observation/config`; }
     // Form Config Chemical
     static get API_Form_ChemicalTreatment(): string { return `${AppConstants.API_baseURL}/treatment/chemical/config`; }

    // Observation
    static get API_observation(): string { return `${AppConstants.API_baseURL}/observation`; }
    static get API_observationSpecies(): string { return `${AppConstants.API_baseURL}/observation/species`; }

    // Code Tables
    static get API_CodeTables(): string { return `${AppConstants.API_baseURL}/codes`; }

    static API_observationWith(id: number): string {
         return `${AppConstants.API_baseURL}/observation/${id}`;
    }

    // Mechanical Treatment
    static get API_mechanicalTreatment(): string { return `${AppConstants.API_baseURL}/treatment/mechanical`; }
    static API_mechanicalTreatmentWith(id: number): string {
        return `${AppConstants.API_baseURL}/treatment/mechanical/${id}`;
   }

    // SSO non static endpoints
    static SSO_LoginEndpoint(): string {
        const baseAuthEndpoint = `${this.SSOConstants.SSO_BASE_URL}/auth/realms/${this.SSOConstants.SSO_REALM_NAME}/protocol/openid-connect`;
        return `${baseAuthEndpoint}/auth?response_type=code&client_id=${this.SSOConstants.SSO_CLIENT_ID}&redirect_uri=${this.SSOConstants.SSO_LOGIN_REDIRECT_URI}`;
    }

    static SSO_TokenEndpoint(): string {
        return `${this.SSOConstants.SSO_BASE_URL}/auth/realms/${this.SSOConstants.SSO_REALM_NAME}/protocol/openid-connect/token`;
    }

    // API Non static endpoints
    static API_user(id: number): string {
        return `${AppConstants.API_baseURL}/account/user/${id}`;
    }

    static API_updateUserMessage(id: number): string {
        return `${AppConstants.API_baseURL}/account/message/${id}`;
    }

    static API_AcessRequestResponse(id: number): string {
        return `${AppConstants.API_baseURL}/request-access/${id}`;
    }

    // API Reference data
    static get API_Roles(): string { return `${AppConstants.API_baseURL}/account/roles`; }
}



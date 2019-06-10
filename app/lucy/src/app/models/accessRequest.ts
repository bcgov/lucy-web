export interface accessRequest {
    id: number;
    username: string;
    name: string;
    currentRole: string;
    requestedRole: string;
    reasons: string;
    
    responseRole: string,
    responseMessage: string,
}


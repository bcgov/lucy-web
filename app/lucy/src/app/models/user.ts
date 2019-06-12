export enum UserAccessType {
    Admin,
    DataViewer,
    DataEditor,
    SuperUser,
}

export interface accessCode {
    code: string;
    createdAt: string;
    description: string;
    role: string;
    role_code_id: number;
    updateAt: string;
}
export interface User {
    // first: string;
    // last: string;
    // email: string;
    // id: string;
    // access: any;
    // organization: string;
    // roleInOrganization: string;

    createdAt: string;
    currentSessionId: number;
    email: string;
    firstName: string;
    lastName: string;
    preferredUsername: string;
    updateAt: string;
    user_id: number;
    accessCodes: accessCode[];
}

export enum UserAccessType {
    Admin,
    DataViewer,
    DataEditor,
    SuperUser,
}

export interface Role {
    code: string;
    createdAt: string;
    description: string;
    role: string;
    role_code_id: number;
    updateAt: string;
}
export interface User {
    accountStatus: number;
    createdAt: string;
    currentSessionId: number;
    email: string;
    firstName: string;
    lastName: string;
    preferredUsername: string;
    roles: Role[];
    updateAt: string;
    user_id: number;
}

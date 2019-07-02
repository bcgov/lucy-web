export interface Role {
    code: string;
    createdAt: string;
    description: string;
    role: string;
    role_code_id: number;
    updateAt: string;
}

export enum UserAccessType {
    Admin,
    DataViewer,
    DataEditor,
    SuperUser,
}
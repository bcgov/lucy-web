import { Role } from './Role';

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

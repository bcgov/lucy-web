import { User } from './User';
import { Role } from './Role';

export interface AccessRequest {
    createdAt: string;
    updateAt: string;
    request_id: number;
    requestNote: string;
    status: number;
    approverNote: string;
    requestedAccessCode: Role;
    requester: User;
    approver: User | null;
}
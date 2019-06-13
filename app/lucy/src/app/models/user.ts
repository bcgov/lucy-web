export enum UserAccessType {
    admin,
    view,
    dataEntry,
}

export interface User {
    first: string;
    last: string;
    email: string;
    id: string;
    access: any;
    organization: string;
    roleInOrganization: string;
}

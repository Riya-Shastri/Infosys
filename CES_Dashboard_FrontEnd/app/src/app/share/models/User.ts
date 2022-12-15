import { TokenUserInfo } from './TokenUserInfo';
export class User {
    id: any;
    firstName: string;
    lastName: string;
    wwid: string;
    email: string;
    roleId: number;
    role: string;
    dWwid: string;
    justification?: string;
    action?: string;

    constructor(data: {
        first_name: string, last_name: string, wwid: string, email: string,
        role_id: number, role_name: string, delegatee: string
    }) {

        this.firstName = data.first_name;
        this.lastName = data.last_name;
        this.wwid = data.wwid;
        this.email = data.email;
        this.roleId = data.role_id;
        this.role = data.role_name;
        this.dWwid = data.delegatee;
    }
    tokenUserInfo?: TokenUserInfo;

    setTokenUserInfo(tokenUserInfo: TokenUserInfo) {
        this.tokenUserInfo = tokenUserInfo;
    }

    getTokenUserInfo() {
        return this.tokenUserInfo;
    }



}


export interface Roles {
    role_id: number;
    role_name: string;
}

export class RegUser {
    firstName?: string;
    lastName?: string;
    wwid?: string;
    email?: string;
}

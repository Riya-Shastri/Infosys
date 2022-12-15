import { TokenUserInfo } from './TokenUserInfo';

export class Tokens {
    idToken: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenUserInfo?: TokenUserInfo;

    constructor(tokens: {access_token: string, id_token: string, refresh_token: string, expires_in: number }) {
        this.accessToken = tokens.access_token;
        this.idToken = tokens.id_token;
        this.refreshToken = tokens.refresh_token;
        this.expiresIn = tokens.expires_in;
    }

    setTokenUserInfo(tokenUserInfo: TokenUserInfo) {
        this.tokenUserInfo = tokenUserInfo;
    }

    getTokenUserInfo() {
        return this.tokenUserInfo;
    }
}

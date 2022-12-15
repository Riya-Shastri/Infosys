// User information extracted from token
export class TokenUserInfo {
    nickname: string; // wwid
    givenName: string; // first name
    familyName: string; // last name
    email: string; // email

    constructor(data: {nickname: string, given_name: string, family_name: string, email: string}) {
        this.nickname = data.nickname;
        this.givenName = data.given_name;
        this.familyName = data.family_name;
        this.email = data.email;
    }
}

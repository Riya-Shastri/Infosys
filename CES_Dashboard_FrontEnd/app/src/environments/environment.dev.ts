


const authDomainUrl = 'https://cummins-dev-pool.auth.us-east-1.amazoncognito.com';
const responseType = 'code';
const scope = 'openid+profile';
const appId = 'GDC-RAD-272';
const clientId = '54uufi5rcfoig84c0gihnk9sms';
const redirectUri = 'https://cmpdashboard-dev.cummins.com';
const apiUrl = 'http://localhost:8080';
const accessManagement = 'https://rolerequestmanager.gdc-rad.com';
const apiAccessManagement = 'https://rolerequestmanager.gdc-rad.com/api';
const xApiKeyAccessManagement = '7oS2QtdWm78n3gQf0uxGQ5OXgkn70Xj42ZMvX2kU';
const RRMTokenInterceptor = 'api/verify-access';
const S3UploadInterceptor = 's3.amazonaws.com';
const googleKeyLocal = 'G-MGN7F5CB3Y';
const gtmauth="&gtm_auth=-owveRUNomY-meXdL8YwgQ&gtm_preview=env-5&gtm_cookies_win=x";
export const environment = {
    production: false,
    gtmKey: `${googleKeyLocal}`,
    gtmauth: `${gtmauth}`,
    rrmAccessManagement: `${accessManagement}`,
    apiAccessManagement: `${apiAccessManagement}`,
    RRMTokenInterceptor: `${RRMTokenInterceptor}`,
    S3UploadInterceptor: `${S3UploadInterceptor}`,
    xApiKeyAccessManagement: `${xApiKeyAccessManagement}`,
    apiUrl: `${apiUrl}`,
    appId: `${appId}`,
    cesCallBackUrl: `${authDomainUrl}/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=12345&scope=${scope}/api&idp_identifier=AzureAD `,
    redirectUrlValue: `${redirectUri}`,
    codeToTokenServiceUrl: `${authDomainUrl}/oauth2/token`,
    contentTypeKey: 'Content-Type',
    contentTypeValue: 'application/x-www-form-urlencoded',
    apiHostUrl: 'https://api.cmpdashboard-dev.cummins.com/api',
    authentication_url: `${authDomainUrl}/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`,
    oauth2: {
        loginUrl: `${authDomainUrl}/oauth2/authorize`,
        redirect_uri: `${redirectUri}`,
        tokenUrl: `${authDomainUrl}/oauth2/token`,
        clientId: `${clientId}`,
        scope: `${scope}`,
        responseType: `${responseType}`,
        grantType: 'authorization_code',
        logoutUrl: `${authDomainUrl}/logout`,
        logoutRedirectUrl: `${redirectUri}/logout`
    },
    oam_logout_url: 'https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0'

};

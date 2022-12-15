
const authDomainUrl = 'https://cummins-prd-pool.auth.us-east-2.amazoncognito.com';
const responseType = 'code';
const scope = 'openid+profile';
const appId = 'GDC-RAD-12';
const clientId = '57d79rbn2r5p8pn7toeou1ukd3';
const redirectUri = 'https://cmpdashboard.cummins.com';
const apiUrl = 'https://api.cmpdashboard.cummins.com';
const accessManagement = 'https://rolerequestmanager.cummins.com/';
const apiAccessManagement = 'https://rolerequestmanager.cummins.com/api';
const xApiKeyAccessManagement = 'MZyrLsExHk3Tw0lgzjyoqu9DzvJq68A3Y8NFJxb4';
const RRMTokenInterceptor = 'prd/verify-access';
const S3UploadInterceptor ='s3.amazonaws.com';
const googleKeyLocal = 'G-RN45QYK9WE';
 const gtmauth="&gtm_auth=54ldm0yQMVlcL4mqbHESbw&gtm_preview=env-1&gtm_cookies_win=x";
export const environment = {
    production: false,
    gtmKey: `${googleKeyLocal}`,
    gtmauth: `${gtmauth}`,
    rrmAccessManagement: `${accessManagement}`,
    apiAccessManagement: `${apiAccessManagement}`,
    RRMTokenInterceptor: `${RRMTokenInterceptor}`,
    xApiKeyAccessManagement: `${xApiKeyAccessManagement}`,
    S3UploadInterceptor: `${S3UploadInterceptor}`,
    apiUrl: `${apiUrl}`,
    appId: `${appId}`,
    cesCallBackUrl: `${authDomainUrl}/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=12345&scope=${scope}/api&idp_identifier=AzureAD `,
    redirectUrlValue: `${redirectUri}`,
    codeToTokenServiceUrl: `${authDomainUrl}/oauth2/token`,
    contentTypeKey: 'Content-Type',
    contentTypeValue: 'application/x-www-form-urlencoded',
    apiHostUrl: 'https://api.cmpdashboard.cummins.com/api',
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


const authDomainUrl = 'https://cummins-stg-pool.auth.us-east-1.amazoncognito.com';
const responseType = 'code';
const scope = 'openid+profile';
const appId = 'GDC-RAD-31';
const clientId = '328pe4sj1151umrpa03mvontp5';
const redirectUri = 'https://cmpdashboard-stg.cummins.com';
const apiUrl = 'https://api.cmpdashboard-stg.cummins.com';
const accessManagement = 'https://rolerequestmanager-stg.cummins.com/';
const apiAccessManagement = 'https://rolerequestmanager-stg.cummins.com/api';
const xApiKeyAccessManagement = 'HfwaB66jxPVAwEo74jOs3NvxIZN0kQMaNsrJ5Bvb';
const RRMTokenInterceptor = 'stg/verify-access';
const S3UploadInterceptor ='s3.amazonaws.com';
const googleKeyLocal = 'G-03CL6W77SH';
 const gtmauth="&gtm_auth=NalcaJIHZ8F6lysYo8LWiQ&gtm_preview=env-6&gtm_cookies_win=x";
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
    apiHostUrl: 'https://api.cmpdashboard-stg.cummins.com/api',
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

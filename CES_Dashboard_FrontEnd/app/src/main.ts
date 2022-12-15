import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}


// Google Tag Manager
const script = document.createElement('script');
script.setAttribute('nonce','2726c7f26c');
script.type = 'text/javascript';
var code = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(), event: 'gtm.js'}); var f = d.getElementsByTagName(s)[0],j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src ='https://www.googletagmanager.com/gtm.js?id='+i+dl+'"+environment.gtmauth+"';f.parentNode.insertBefore(j, f);}) (window, document, 'script', 'dataLayer', 'GTM-W37ZTLD');";
script.text = code;
document.body.appendChild(script);
// End Google Tag Manager
// Google Tag Manager (noscript)
const noscript = document.createElement('noscript');
var codeNosrc = '<iframe title="tagmamanger" name="tagmamanger" src="https://www.googletagmanager.com/ns.html?id=GTM-W37ZTLD&'+environment.gtmauth+'" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
noscript.innerHTML = codeNosrc;
document.body.appendChild(noscript);
// End Google Tag Manager (noscript)

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

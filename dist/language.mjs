const LANGUAGE_KEY='vat-navigator-language';
const HANDOFF_KEY='vat-navigator-language-handoff-v1';
const root=new URL('.',import.meta.url);
export const currentLanguage=document.documentElement.lang==='de'?'de':'zh';
const allowed=lang=>['zh','de'].includes(lang);
const explicit=new URL(location.href).searchParams.get('lang');
let preferred;
try{preferred=localStorage.getItem(LANGUAGE_KEY);}catch{}
if(allowed(explicit)){
 try{localStorage.setItem(LANGUAGE_KEY,explicit);}catch{}
 preferred=explicit;
}
if(allowed(preferred)&&preferred!==currentLanguage){
 const target=new URL(preferred==='de'?'de/':'./',root);
 target.searchParams.set('lang',preferred);
 target.hash=location.hash;
 location.replace(target.href);
}
for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===currentLanguage));
export function readLanguageHandoff(){
 let raw;
 try{raw=sessionStorage.getItem(HANDOFF_KEY);sessionStorage.removeItem(HANDOFF_KEY);}catch{}
 if(location.hash.startsWith('#vat-handoff=')){
  raw=decodeURIComponent(location.hash.slice('#vat-handoff='.length));
  history.replaceState(null,'',location.pathname+location.search);
 }
 if(!raw)return null;
 try{const value=JSON.parse(raw);return value?.version===1?value:null;}catch{return null;}
}
export function switchLanguage(language,snapshot){
 if(!allowed(language)||language===currentLanguage)return;
 const target=new URL(language==='de'?'de/':'./',root);
 target.searchParams.set('lang',language);
 const raw=JSON.stringify({version:1,...snapshot});
 try{sessionStorage.setItem(HANDOFF_KEY,raw);}catch{target.hash='vat-handoff='+encodeURIComponent(raw);}
 try{localStorage.setItem(LANGUAGE_KEY,language);}catch{}
 location.assign(target.href);
}

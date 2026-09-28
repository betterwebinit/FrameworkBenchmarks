'use client';
import {useEffect,useSyncExternalStore} from 'react';
const subscribe=(callback:()=>void)=>{window.addEventListener('storage',callback);window.addEventListener('themechange',callback);return()=>{window.removeEventListener('storage',callback);window.removeEventListener('themechange',callback);};};
const read=()=>{try{return localStorage.getItem('betterweb-benchmarks-theme')==='light'?'light':'dark';}catch{return 'dark';}};
export function ThemeToggle({pt=false}:{pt?:boolean}){
 const theme=useSyncExternalStore(subscribe,read,()=> 'dark');
 useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.lang=pt?'pt-BR':'en';},[theme,pt]);
 return <button className="theme-toggle" aria-label={pt?`Ativar tema ${theme==='light'?'escuro':'claro'}`:`Use ${theme==='light'?'dark':'light'} theme`} onClick={()=>{try{localStorage.setItem('betterweb-benchmarks-theme',theme==='light'?'dark':'light');window.dispatchEvent(new Event('themechange'));}catch{document.documentElement.dataset.theme=theme==='light'?'dark':'light';}}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{theme==='light'?<path d="M20 14a8 8 0 0 1-10-10 8.5 8.5 0 1 0 10 10Z"/>:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/></>}</svg></button>;
}

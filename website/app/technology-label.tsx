import {technologyIcon,type TechnologyKind} from './technology-model';

export function TechnologyLabel({name,kind='framework',identity}:{name:string;kind?:TechnologyKind;identity?:string}){
 const icon=technologyIcon(kind,name,identity);
 return <span className={`technology-label technology-${kind}`} title={name}>
  {icon?<span className={`technology-mark${['framework-blacksheep.ico','framework-vidi.svg','framework-drogon.png'].includes(icon)?' technology-mark-dark':''}`} aria-hidden="true">
   {/* Local SVGs have fixed dimensions; no raster image optimization is needed. */}
   {/* eslint-disable-next-line @next/next/no-img-element */}
   <img src={`/technology/${icon.includes('.')?icon:`${icon}.svg`}`} width={16} height={16} alt="" decoding="async"/>
  </span>:!['none','unknown',''].includes(name.toLowerCase())&&<span className="technology-mark technology-placeholder" aria-hidden="true"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.2">{kind==='framework'?<path d="m10 3 7 3.5-7 3.5-7-3.5L10 3Zm-7 7 7 3.5 7-3.5M3 13.5l7 3.5 7-3.5"/>:kind==='database'?<><ellipse cx="10" cy="5" rx="6" ry="3"/><path d="M4 5v10c0 4 12 4 12 0V5M4 10c0 4 12 4 12 0"/></>:kind==='os'?<path d="M2 3h16v11H2V3Zm4 14h8m-4-3v3"/>:<path d="m7 5-5 5 5 5m6-10 5 5-5 5m-2-12-2 14"/>}</svg></span>}
  <span className="technology-name">{name}</span>
 </span>;
}

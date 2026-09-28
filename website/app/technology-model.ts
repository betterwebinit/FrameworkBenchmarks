import {frameworkArtwork} from './framework-artwork.ts';
const languages:Record<string,string>={
 'c':'c','c++':'cplusplus','c#':'csharp','csharp':'csharp','clojure':'clojure',
 'common lisp':'commonlisp','crystal':'crystal','d':'d','dart':'dart','elixir':'elixir',
 'erlang':'erlang','f#':'fsharp','fsharp':'fsharp','fortran':'fortran','go':'go',
 'groovy':'groovy','haskell':'haskell','java':'java','javascript':'javascript',
 'julia':'julia','kotlin':'kotlin','lua':'lua','nim':'nim','ocaml':'ocaml','php':'php',
 'perl':'perl','prolog':'prolog','python':'python','r':'r','racket':'racket','ruby':'ruby',
 'rust':'rust','scala':'scala','swift':'swift','typescript':'typescript','v':'v',
 'vb':'visualbasic','visual basic':'visualbasic','vala':'vala','zig':'zig',
};
const frameworks:Record<string,string>={
 'actix':'actix','actix-web':'actix','akka':'akka','akka-http':'akka','asp.net core':'dotnetcore',
 'aspnetcore':'dotnetcore','aspcore':'dotnetcore','aspcore-mono':'dotnetcore','aspcore-vb-mw':'dotnetcore',
 'bun':'bun','cakephp':'cakephp','codeigniter':'codeigniter','deno':'denojs','django':'django',
 'dropwizard':'dropwizard','express':'express','fastapi':'fastapi','fastify':'fastify',
 'feathersjs':'feathersjs','fiber':'fiber','flask':'flask','falcon':'falcon','gin':'gin',
 'go':'go','go-std':'go','grails':'grails','hono':'hono','koa':'koa','ktor':'ktor',
 'laravel':'laravel','nestjs':'nestjs','nest':'nestjs','nextjs':'nextjs','next.js':'nextjs',
 'nginx':'nginx','nodejs':'nodejs','node.js':'nodejs','phalcon':'phalcon','phoenix':'phoenix',
 'php':'php','quarkus':'quarkus','rails':'rails','ruby on rails':'rails','rocket':'rocket',
 'sanic':'sanic','sinatra':'rubysinatra','spring':'spring','spring-webflux':'spring',
 'symfony':'symfony','uwsgi':'uwsgi','vapor':'vapor','vert.x':'vertx','vertx':'vertx',
 'vertx-web':'vertx','yii':'yii','yii2':'yii',
};
const databases:Record<string,string>={'postgres':'postgresql','postgresql':'postgresql','mysql':'mysql','mongodb':'mongodb','mariadb':'mariadb','sqlite':'sqlite','redis':'redis','sql server':'microsoftsqlserver','mssql':'microsoftsqlserver'};
const systems:Record<string,string>={'linux':'linux','ubuntu':'ubuntu','debian':'debian','windows':'windows11','windows server':'windows11','macos':'apple','osx':'apple','os x':'apple'};
export type TechnologyKind='framework'|'language'|'database'|'os';
const normalize=(name:string)=>name.trim().toLowerCase().replace(/\s+/g,' ');
// Only declared families accept variant suffixes. Never use substring matching
// (e.g. Java/JavaScript, C/C++/C#, warp/warp-rust or hyper/hyperexpress).
const families=['actix','akka-http','aspnetcore','aspcore','cakephp','codeigniter','django','dropwizard','express','fastapi','fastify','feathersjs','fiber','flask','falcon','gin','grails','hono','koa','ktor','laravel','nestjs','nextjs','nodejs','phalcon','phoenix','quarkus','rails','rocket','sanic','sinatra','spring','symfony','vapor','vertx','yii2'];
export function technologyIcon(kind:TechnologyKind,name:string,identity?:string):string|null{
 if(kind!=='framework'){
  const lookup=kind==='language'?languages:kind==='database'?databases:systems;
  return Object.hasOwn(lookup,normalize(name))?lookup[normalize(name)]:null;
 }
 // Snapshot metadata takes precedence over display names, which may be aliases.
 for(const candidate of [identity,name]){
  if(!candidate)continue;
  const normalized=normalize(candidate);
  if(Object.hasOwn(frameworks,normalized))return frameworks[normalized];
  if(Object.hasOwn(frameworkArtwork,normalized))return frameworkArtwork[normalized];
  const family=families.find(key=>normalized.startsWith(`${key}-`)||normalized.startsWith(`${key}_`)||normalized.startsWith(`${key} [`));
  if(family)return frameworks[family];
 }
 return null;
}

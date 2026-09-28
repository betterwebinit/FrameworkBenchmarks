import {readdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'../..');
const testKeys={json:'json_url',db:'db_url',query:'query_url',fortune:'fortune_url',update:'update_url',plaintext:'plaintext_url','cached-query':'cached_query_url'};
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});let files=[];for(const e of entries){if(e.isDirectory())files.push(...await walk(resolve(dir,e.name)));else if(e.name==='benchmark_config.json')files.push(resolve(dir,e.name));}return files;}
const rows=[];
for(const file of await walk(resolve(root,'frameworks'))){const config=JSON.parse(await readFile(file,'utf8'));const path=relative(root,file);const variants=[];for(const block of config.tests??[])for(const [key,v] of Object.entries(block)){if(!v||typeof v!=='object')continue;variants.push({name:v.display_name||key,language:v.language||path.split('/')[1],database:v.database||'None',classification:v.classification||'Unspecified',tests:Object.entries(testKeys).filter(([,field])=>v[field]).map(([type])=>type)});}if(!variants.length)continue;rows.push({id:path,name:config.framework||path.split('/')[2],language:variants[0].language,variants:variants.length,databases:[...new Set(variants.map(v=>v.database))],tests:[...new Set(variants.flatMap(v=>v.tests))],path:path.substring(0,path.lastIndexOf('/')),configPath:path});}
rows.sort((a,b)=>a.name.localeCompare(b.name));
const commit=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
const summary={frameworks:rows.length,variants:rows.reduce((s,r)=>s+r.variants,0),languages:[...new Set(rows.map(r=>r.language))].sort(),testTypes:Object.keys(testKeys),commit};
await writeFile(resolve(root,'website/public/catalog.json'),JSON.stringify({summary,rows}));
await writeFile(resolve(root,'website/app/catalog-summary.json'),JSON.stringify(summary,null,2)+'\n');
console.log(`Catalog: ${summary.frameworks} framework configurations, ${summary.variants} variants, ${summary.languages.length} languages`);

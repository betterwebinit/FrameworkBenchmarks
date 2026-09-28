// Capture public TechEmpower data as static, source-attributed snapshots.
// Run explicitly; normal builds use the checked-in snapshot and need no network.
import {writeFile,mkdir} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import vm from 'node:vm';
const base='https://www.techempower.com/benchmarks/';
const execute=promisify(execFile);
const get=async url=>(await execute('curl',['--fail','--location','--silent','--show-error','--max-time','60',url],{maxBuffer:40*1024*1024})).stdout;
const html=await get(base),asset=html.match(/src="\.\/(assets\/index-[^"]+\.js)"/)?.[1];
if(!asset)throw Error('Cannot locate upstream data manifest.');
const js=await get(base+asset);
function literal(name){
 const start=js.indexOf(name+'={')+name.length+1;
 if(start<name.length+1)throw Error('Missing manifest '+name);
 let depth=0,quote='',escape=false,end=start;
 for(;end<js.length;end++){const c=js[end];if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c===quote)quote='';}else if(c==='"'||c==="'")quote=c;else if(c==='{')depth++;else if(c==='}'&&!--depth){end++;break;}}
 return JSON.parse(JSON.stringify(vm.runInNewContext('('+js.slice(start,end)+')',Object.create(null),{timeout:1000})));
}
const rounds=literal('zs'),attributes=literal('er'),legacy=literal('tr');
const legacyMeta={};
for(const [id,item] of Object.entries(legacy)){
 const meta={name:item.i,display_name:item.t||item.i,versus:item.v?.map(String)||[]};
 for(const [key,attribute] of Object.entries(attributes))meta[key]=String(attribute.list[item[attribute.code]]||'unknown').replace(/^-/,'').toLowerCase();
 legacyMeta[id]=meta;legacyMeta[item.i]=meta;
}
const kinds=['json','db','query','cached-query','fortune','update','plaintext'];
const out=new URL('../public/official/',import.meta.url);await mkdir(out,{recursive:true});
const number=value=>Number.isFinite(Number(value))&&Number(value)>=0?Number(value):0;
const jobs=Object.values(rounds).flatMap(round=>['ph',...(round.cloud?['cl']:[])].map(hardware=>({round,hardware})));
const snapshots=[];
for(let offset=0;offset<jobs.length;offset+=5){await Promise.all(jobs.slice(offset,offset+5).map(async({round,hardware})=>{
 const url=base+`results/round${round.num}/${hardware}.json`;
 let data;try{data=JSON.parse(await get(url));}catch(error){if(error.stderr?.includes('404')){process.stdout.write(`Unavailable upstream: round ${round.num} / ${hardware}\n`);return;}throw Error(`Snapshot ${url}: ${error.message}`);}
 const metadata=Object.fromEntries((data.testMetadata||[]).map(meta=>[meta.name,meta]));
 const duration=round.duration;
 const levels=Object.fromEntries(kinds.map(kind=>[kind,['query','update'].includes(kind)?data.queryIntervals:kind==='cached-query'?(data.cachedQueryIntervals||data.queryIntervals):kind==='plaintext'?(data.pipelineConcurrencyLevels||data.concurrencyLevels):data.concurrencyLevels]));
 const tests={};
 for(const kind of kinds){if(!data.rawData?.[kind])continue;const failures=new Set((data.failed?.[kind]||[]).map(String));
 tests[kind]=Object.entries(data.rawData[kind]).filter(([,runs])=>Array.isArray(runs)).map(([key,runs])=>{
 const meta=metadata[key]||legacyMeta[key]||{name:key,display_name:key};
 const failed=failures.has(key)||failures.has(meta.name);
 const samples=runs.map(run=>{if(!run||run.totalRequests===undefined)return null;const errors=number(run.connect)+number(run.read)+number(run.write)+number(run['5xx']);return {rps:Math.floor(Math.max(0,number(run.totalRequests)-errors)/duration),errors,timeout:number(run.timeout),latency:String(run.latencyAvg||'—'),max:String(run.latencyMax||'—'),stdev:String(run.latencyStdev||'—')};});
 return {id:key,name:meta.name||key,display:meta.display_name||meta.name||key,meta:Object.fromEntries(['language','platform','webserver','classification','database','orm','approach','os','database_os','framework','notes','versus'].map(k=>[k,meta[k]??'unknown'])),failed,samples};
 });
 // Preserve failure records even when the runner produced no samples.
 for(const key of failures)if(!tests[kind].some(row=>row.id===key||row.name===key)){const meta=metadata[key]||legacyMeta[key]||{};tests[kind].push({id:key,name:meta.name||key,display:meta.display_name||meta.name||key,meta,failed:true,samples:[]});}
 }
 const snapshot={round:round.num,hardware,date:round.date,duration,source:url,run:data.uuid||null,git:data.git||null,levels,tests};
 await writeFile(new URL(`r${round.num}-${hardware}.json`,out),JSON.stringify(snapshot));
 snapshots.push({round:round.num,hardware,date:round.date,duration,environment:hardware==='ph'?round.physical:round.cloud,source:url,logs:round.logs||null,details:round['run-details']?.[hardware==='ph'?'physical':'cloud']||null,blog:round.blog?new URL(round.blog,'https://www.techempower.com').href:null});
 process.stdout.write(`Round ${round.num} / ${hardware}: ${Object.keys(tests).length} workloads\n`);
 }));}
const manifest={retrieved:new Date().toISOString(),upstream:base,method:'floor(max(0, totalRequests − connect − read − write − 5xx) / published round duration)',snapshots:snapshots.sort((a,b)=>b.round-a.round||a.hardware.localeCompare(b.hardware))};
await writeFile(new URL('../app/official-manifest.json',import.meta.url),JSON.stringify(manifest,null,2)+'\n');

export type Run={name:string;rps:number;latency:string;errors:number;seconds:number};
export type ResultsFile={name:string;environment:string;rawData:Record<string,Record<string,unknown[]>>;failed:Record<string,string[]>;levels:Record<string,unknown[]>};
const kinds=['json','db','query','fortune','update','plaintext','cached-query'];
const object=(value:unknown):value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value);
export function parseResults(value:unknown):ResultsFile {
 if(!object(value)||!object(value.rawData))throw Error('Expected a FrameworkBenchmarks results.json with rawData.');
 const rawData:ResultsFile['rawData']={};const failed:ResultsFile['failed']={};
 for(const kind of kinds){const data=value.rawData[kind];if(!object(data))continue;const entries=Object.entries(data);if(entries.length>5000)throw Error('Too many framework entries.');rawData[kind]={};for(const [name,runs] of entries){if(Array.isArray(runs)&&runs.length<=500)rawData[kind][name]=runs;}
 const failures=object(value.failed)?value.failed[kind]:undefined;failed[kind]=Array.isArray(failures)?failures.filter((x):x is string=>typeof x==='string'):[];}
 if(!Object.values(rawData).some(d=>Object.values(d).some(r=>r.length>0)))throw Error('No supported benchmark samples found.');
 const levels:ResultsFile['levels']={};for(const kind of kinds){const field=['query','update'].includes(kind)?'queryIntervals':kind==='cached-query'?'cachedQueryIntervals':kind==='plaintext'?'pipelineConcurrencyLevels':'concurrencyLevels';levels[kind]=Array.isArray(value[field])?value[field]:[];}
 return {name:typeof value.name==='string'?value.name.slice(0,200):'Imported run',environment:typeof value.environmentDescription==='string'?value.environmentDescription.slice(0,500):'',rawData,failed,levels};
}
export function samplesAt(file:ResultsFile,kind:string,index:number):{rows:Run[];skipped:number} {
 const rows:Run[]=[];let skipped=0;for(const [name,runs] of Object.entries(file.rawData[kind]??{})){
 if(file.failed[kind]?.includes(name)){skipped++;continue;}const run=runs[index];if(!object(run)){skipped++;continue;}
 const total=run.totalRequests,start=run.startTime,end=run.endTime;
 if(typeof total!=='number'||!Number.isSafeInteger(total)||total<0||typeof start!=='number'||typeof end!=='number'||!Number.isFinite(start)||!Number.isFinite(end)||end<=start){skipped++;continue;}
 const rps=total/(end-start);if(!Number.isFinite(rps)){skipped++;continue;}
 const errors=['connect','read','write','timeout','5xx'].reduce((sum,k)=>sum+(typeof run[k]==='number'&&Number.isFinite(run[k])&&run[k]>=0?run[k]:0),0);
 rows.push({name,rps,seconds:end-start,errors,latency:typeof run.latencyAvg==='string'?run.latencyAvg.slice(0,40):'—'});
 }return {rows:rows.sort((a,b)=>b.rps-a.rps),skipped};
}

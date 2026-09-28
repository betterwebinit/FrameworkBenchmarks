export type Sample={rps:number;errors:number;timeout:number;latency:string;max:string;stdev:string};
export type Entry={id:string;name:string;display:string;failed:boolean;meta:Record<string,string|string[]>;samples:(Sample|null)[]};
export type Snapshot={round:number;hardware:string;date:string;duration:number;source:string;run:string|null;git:unknown;levels:Record<string,number[]>;tests:Record<string,Entry[]>};
export function selectedSample(entry:Entry,selection:string):Sample|null{
 if(entry.failed)return null;
 if(selection!=='best')return entry.samples[Number(selection)]??null;
 return entry.samples.reduce<Sample|null>((best,sample)=>sample&&(!best||sample.rps>best.rps)?sample:best,null);
}
export function milliseconds(value:string){const match=value.match(/^([\d.]+)\s*(ns|us|µs|ms|s)$/);if(!match)return null;const n=Number(match[1])*({ns:0.000001,us:0.001,'µs':0.001,ms:1,s:1000}[match[2]]??1);return Number.isFinite(n)?n:null;}
export function baselineFor(entry:Entry,entries:Entry[],selection:string){const versus=entry.meta.versus;const keys=Array.isArray(versus)?versus:[versus];const baseline=entries.find(row=>row.id!==entry.id&&keys.some(key=>key&&key!=='None'&&(row.id===key||row.name===key)));return baseline?{entry:baseline,sample:selectedSample(baseline,selection)}:null;}

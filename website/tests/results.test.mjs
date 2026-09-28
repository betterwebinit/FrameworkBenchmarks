import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {parseResults,samplesAt} from '../app/results-parser.ts';
import {selectedSample,milliseconds,baselineFor} from '../app/official-model.ts';
import {readFileSync} from 'node:fs';
import {technologyIcon} from '../app/technology-model.ts';
import {frameworkArtwork} from '../app/framework-artwork.ts';
test('technology logos distinguish related names and honor benchmark metadata',()=>{
 assert.deepEqual(['C','c++','C#','CSharp','Java','Javascript'].map(name=>technologyIcon('language',name)),['c','cplusplus','csharp','csharp','java','javascript']);
 assert.equal(technologyIcon('framework','Quarkus, Vert.x','quarkus'),'quarkus');
 assert.equal(technologyIcon('framework','vertx-web-postgres'),'vertx');
 for(const name of ['hyperexpress','springboard','warp-rust','constructor','unknown'])assert.equal(technologyIcon('framework',name),null);
 assert.equal(technologyIcon('language','constructor'),null);
 assert.equal(technologyIcon('framework','ntex [tokio,db]','ntex'),'framework-ntex.png');
 assert.equal(technologyIcon('database','Postgres'),'postgresql');
 assert.equal(technologyIcon('database','None'),null);
 assert.equal(technologyIcon('os','Linux'),'linux');
 assert.equal(technologyIcon('os','unknown'),null);
});
test('every registered framework image is local and present',()=>{
 for(const filename of new Set(Object.values(frameworkArtwork))){
  assert.match(filename,/^[a-z0-9-]+\.(svg|png|ico|jpg|webp)$/);
  assert.ok(readFileSync(new URL(`../public/technology/${filename}`,import.meta.url)).length>0,filename);
 }
 const audit=JSON.parse(readFileSync(new URL('../public/technology/framework-coverage.json',import.meta.url)));
 const catalog=JSON.parse(readFileSync(new URL('../public/catalog.json',import.meta.url)));
 assert.deepEqual(audit.entries.map(e=>e.framework).sort(),catalog.rows.map(r=>r.name).sort());
});
const sample=(extra={})=>({totalRequests:30000,startTime:100,endTime:130,latencyAvg:'1.2ms',...extra});
test('uses measured seconds and excludes failures and invalid timing',()=>{const file=parseResults({duration:1,rawData:{json:{fast:[sample()],failed:[sample()],zero:[sample({endTime:100})],invalid:[sample({totalRequests:'30000'})]}},failed:{json:['failed']}});const result=samplesAt(file,'json',0);assert.equal(result.rows.length,1);assert.equal(result.rows[0].rps,1000);assert.equal(result.skipped,3);});
test('matches query workload intervals without treating metadata as measurements',()=>{const file=parseResults({queryIntervals:[1,5],rawData:{query:{framework:[sample(),sample({totalRequests:60000})]},slocCounts:{framework:100}}});assert.deepEqual(file.levels.query,[1,5]);assert.equal(samplesAt(file,'query',1).rows[0].rps,2000);assert.deepEqual(samplesAt(file,'query',2).rows,[]);});
test('rejects unrelated and empty files',()=>{for(const value of [null,[],{}, {rawData:{json:{a:[]}}}])assert.throws(()=>parseResults(value));});
test('keeps valid zero throughput and reports error events',()=>{const file=parseResults({rawData:{json:{a:[sample({totalRequests:0,connect:2,timeout:3})]}}});const row=samplesAt(file,'json',0).rows[0];assert.equal(row.rps,0);assert.equal(row.errors,5);});
test('published ranking matches independently observed round 23 values',()=>{
 const snapshot=JSON.parse(readFileSync(new URL('../public/official/r23-ph.json',import.meta.url)));
 const rows=snapshot.tests.fortune.filter(row=>row.meta.approach==='realistic').map(entry=>({entry,sample:selectedSample(entry,'best')})).filter(row=>row.sample).sort((a,b)=>b.sample.rps-a.sample.rps);
 assert.deepEqual(rows.slice(0,3).map(row=>[row.entry.name,row.sample.rps]),[['may-minihttp',1327378],['h2o',1226814],['ntex-db',1210348]]);
});
test('failed runs never acquire a score and sample selection does not invent missing values',()=>{
 const entry={id:'a',name:'a',display:'a',meta:{},failed:false,samples:[{rps:10},{rps:50},null]};
 assert.equal(selectedSample(entry,'best').rps,50);assert.equal(selectedSample(entry,'0').rps,10);assert.equal(selectedSample(entry,'2'),null);assert.equal(selectedSample({...entry,failed:true},'best'),null);
 assert.equal(milliseconds('150us'),0.15);assert.equal(milliseconds('2s'),2000);assert.equal(milliseconds('—'),null);
});
test('overhead uses only an explicitly declared baseline in the same snapshot',()=>{
 const entry={id:'framework',name:'framework',meta:{versus:'platform'},failed:false,samples:[{rps:50}]};
 const baseline={id:'platform-id',name:'platform',meta:{},failed:false,samples:[{rps:100}]};
 assert.equal(baselineFor(entry,[entry,baseline],'best').sample.rps,100);assert.equal(baselineFor({...entry,meta:{}},[entry,baseline],'best'),null);
});
test('every advertised historical dataset exists and contains supported workloads',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../app/official-manifest.json',import.meta.url)));
 assert.equal(new Set(manifest.snapshots.map(s=>s.round)).size,21);assert.equal(manifest.snapshots.length,37);
 for(const info of manifest.snapshots){const snapshot=JSON.parse(readFileSync(new URL(`../public/official/r${info.round}-${info.hardware}.json`,import.meta.url)));assert.equal(snapshot.round,info.round);assert.equal(snapshot.source,info.source);assert.ok(snapshot.duration>0);assert.ok(Object.keys(snapshot.tests).length>=5);for(const entries of Object.values(snapshot.tests))for(const entry of entries)for(const sample of entry.samples)if(sample)assert.ok(Number.isInteger(sample.rps)&&sample.rps>=0);}
});

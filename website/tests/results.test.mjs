import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {parseResults,samplesAt} from '../app/results-parser.ts';
const sample=(extra={})=>({totalRequests:30000,startTime:100,endTime:130,latencyAvg:'1.2ms',...extra});
test('uses measured seconds and excludes failures and invalid timing',()=>{const file=parseResults({duration:1,rawData:{json:{fast:[sample()],failed:[sample()],zero:[sample({endTime:100})],invalid:[sample({totalRequests:'30000'})]}},failed:{json:['failed']}});const result=samplesAt(file,'json',0);assert.equal(result.rows.length,1);assert.equal(result.rows[0].rps,1000);assert.equal(result.skipped,3);});
test('matches query workload intervals without treating metadata as measurements',()=>{const file=parseResults({queryIntervals:[1,5],rawData:{query:{framework:[sample(),sample({totalRequests:60000})]},slocCounts:{framework:100}}});assert.deepEqual(file.levels.query,[1,5]);assert.equal(samplesAt(file,'query',1).rows[0].rps,2000);assert.deepEqual(samplesAt(file,'query',2).rows,[]);});
test('rejects unrelated and empty files',()=>{for(const value of [null,[],{}, {rawData:{json:{a:[]}}}])assert.throws(()=>parseResults(value));});
test('keeps valid zero throughput and reports error events',()=>{const file=parseResults({rawData:{json:{a:[sample({totalRequests:0,connect:2,timeout:3})]}}});const row=samplesAt(file,'json',0).rows[0];assert.equal(row.rps,0);assert.equal(row.errors,5);});

import assert from 'node:assert/strict';
import {evaluate,base,PRESETS,SOURCES,isEU,destinationOf} from './dist/engine.mjs';
import {testCases,runCase} from './dist/cases.mjs';
import {groups,definitions} from './dist/form.mjs';
const failed=[];
for(const t of testCases){if(!runCase(t))failed.push({name:t.name,expected:t.code,actual:evaluate(t.s).code});}
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exitCode=1;}else console.log(`${testCases.length} representative paths passed`);
let combinations=0;
for(const origin of ['DE','FR','PL'])for(const recipient of ['DE','EU','BRANCH','THIRD'])for(const buyer of ['B2B','B2C'])for(const transport of ['SUPPLIER','GMBH','CUSTOMER','UNKNOWN'])for(const purchaseVat of ['DE','FR','RO','AT','UNKNOWN'])for(const validity of ['YES','NO','UNKNOWN'])for(const evidence of ['YES','PENDING']){
 const s={...base,origin,supplierCountry:origin,recipient,buyer,transport,purchaseVat,purchaseValid:validity,evidence,zm:evidence==='YES'?'YES':'PENDING',triangleInvoice:evidence==='YES'?'YES':'PENDING',invoice:recipient==='BRANCH'?'BRANCH':'CHAIN'};const r=evaluate(s);combinations++;
 assert(r.title&&r.summary&&r.code,'每条路径有结构化结果');
 assert(r.refs.every(k=>SOURCES[k]),'法条ID均可解析');
 if(r.code.startsWith('ASK_'))assert.equal(r.wording,'','未知关键事实时不锁定开票');
 if(recipient==='BRANCH')assert(r.chain.includes('不构成'),'同一分支不构造第二次销售');
 if(r.code==='TRIANGLE_ELIGIBLE'){
  assert.equal(buyer,'B2B');assert(!['THIRD','BRANCH','DE'].includes(recipient));assert(r.checks.every(x=>x.status==='YES'));assert.equal(r.moving,'供应商 → GmbH');
 }
 if(r.code==='B2C_THRESHOLD_DE')assert.equal(origin,'DE','外国起运不能用德国门槛例外');
 if(r.code==='B2C_STATIC')assert(r.outgoing.some(x=>x.includes('不能')&&x.includes('OSS')),'静态销售不能直接进普通OSS');
 for(const keys of groups(s))for(const key of keys)assert(definitions[key],`表单字段存在：${key}`);
}
for(const p of PRESETS)assert(!evaluate(p.state).code.startsWith('ASK_'),`${p.id}: 示例能形成可用路径`);
console.log(JSON.stringify({representative_paths:testCases.length,failed_paths:failed.length,invariant_combinations:combinations,status:failed.length?'failed':'passed'},null,2));

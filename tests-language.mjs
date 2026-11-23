import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as zh from './dist/engine.mjs';
import * as de from './dist/de/engine.mjs';
import {definitions as zhFields,groups as zhGroups} from './dist/form.mjs';
import {definitions as deFields,groups as deGroups} from './dist/de/form.mjs';
import {testCases} from './dist/cases.mjs';
const han=/[\u3400-\u9fff]/u;
const messages=[];
function compare(s,name){const a=zh.evaluate(s),b=de.evaluate(s);
 for(const key of ['code','tone','triangleState','refs'])assert.deepEqual(b[key],a[key],`${name}: ${key}`);
 for(const key of ['known','pending','actions','incoming','outgoing','checks'])assert.equal(b[key].length,a[key].length,`${name}: ${key} count`);
 assert.deepEqual(b.checks.map(x=>x.status),a.checks.map(x=>x.status));
 assert.deepEqual(b.known.map(x=>x.refs),a.known.map(x=>x.refs));
 assert(!han.test(JSON.stringify(b)),`${name}: no untranslated Chinese in German result`);
 assert.deepEqual(deGroups(s),zhGroups(s));
}
for(const t of testCases)compare(t.s,t.name);
for(const [k,f] of Object.entries(zhFields)){
 assert.deepEqual(deFields[k].options.map(x=>x.value),f.options.map(x=>x.value),k);
 assert(!han.test(JSON.stringify(deFields[k])),'All German questions and options localized: '+k);
}
let count=0;
for(const origin of ['DE','FR','PL'])for(const recipient of ['DE','EU','BRANCH','THIRD'])for(const buyer of ['B2B','B2C'])for(const transport of ['SUPPLIER','GMBH','CUSTOMER','UNKNOWN'])for(const purchaseVat of ['DE','FR','RO','AT','UNKNOWN'])for(const validity of ['YES','NO','UNKNOWN'])for(const evidence of ['YES','PENDING']){
 compare({...zh.base,origin,supplierCountry:origin,recipient,buyer,transport,purchaseVat,purchaseValid:validity,evidence,zm:evidence==='YES'?'YES':'PENDING',triangleInvoice:evidence==='YES'?'YES':'PENDING',invoice:recipient==='BRANCH'?'BRANCH':'CHAIN'},'combination '+count++);
}
for(const f of ['sources.mjs','engine.mjs','form.mjs','app.mjs','index.html','cases-meta.mjs'])assert(!han.test(fs.readFileSync('dist/de/'+f,'utf8')),f+' fully localized');
console.log(`German/Chinese parity verified: ${testCases.length} representative paths, ${count} combinations, all form fields and German output strings.`);

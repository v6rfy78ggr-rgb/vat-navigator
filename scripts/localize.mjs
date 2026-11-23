import fs from 'node:fs';
const acorn={};new Function('exports','module',process.binding('natives')['internal/deps/acorn/acorn/dist/acorn'])(acorn,{exports:acorn});
const han=/[\u3400-\u9fff]/u;
const files=['sources.mjs','engine.mjs','form.mjs','app.mjs','cases.mjs','index.html'];
const entries=[];
const add=s=>{const key=s.trim();if(han.test(key)&&!entries.includes(key))entries.push(key);};
function chunks(s,fn){return s.split(/(<[^>]*>)/g).map(part=>part.startsWith('<')?part.replace(/(\b(?:aria-label|content|title|placeholder)=["'])([^"']*)(["'])/g,(_,a,b,c)=>a+fn(b)+c):fn(part)).join('');}
function nodes(source){const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'module'}),out=[];function walk(n){if(!n||typeof n!=='object')return;if(n.type==='Literal'&&typeof n.value==='string'&&han.test(n.value))out.push({start:n.start,end:n.end,value:n.value,literal:true});else if(n.type==='TemplateElement'&&han.test(n.value.raw))out.push({start:n.start,end:n.end,value:n.value.raw,literal:false});for(const [k,v] of Object.entries(n)){if(['start','end'].includes(k))continue;if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v);}}walk(ast);return out;}
for(const f of files){const source=fs.readFileSync('dist/'+f,'utf8');if(f.endsWith('.html'))chunks(source,s=>{add(s);return s;});else for(const n of nodes(source))chunks(n.value,s=>{add(s);return s;});}
if(process.argv.includes('--extract')){fs.writeFileSync('i18n/entries.json',JSON.stringify(entries,null,2));console.log(entries.length+' translation entries');process.exit();}
const de=JSON.parse(fs.readFileSync('i18n/de.json','utf8'));
const missing=entries.filter(k=>!de[k]);if(missing.length)throw Error('Missing translations: '+JSON.stringify(missing));
const translate=s=>chunks(s,part=>{const k=part.trim();if(!han.test(k))return part;const val=de[k];if(!val)throw Error('Missing: '+k);return part.slice(0,part.indexOf(k))+val+part.slice(part.indexOf(k)+k.length);});
fs.mkdirSync('dist/de',{recursive:true});
for(const f of files){let source=fs.readFileSync('dist/'+f,'utf8');if(f.endsWith('.html'))source=translate(source).replace('lang="zh-CN"','lang="de"').replace('href="./style.css"','href="../style.css"').replace('src="./language.mjs"','src="../language.mjs"');else for(const n of nodes(source).sort((a,b)=>b.start-a.start)){const val=translate(n.value);source=source.slice(0,n.start)+(n.literal?JSON.stringify(val):val)+source.slice(n.end);}
 if(f==='app.mjs')source=source.replace("from './language.mjs'","from '../language.mjs'").replace("toLocaleString('zh-CN'","toLocaleString('de-DE'").replace('LOGIC & SCOPE','REGELN & GRENZEN').replace('PATH VALIDATION','FALLPRÜFUNG');
 if(f==='index.html')source=source.replace('CROSS-BORDER VAT','GRENZÜBERSCHREITENDE UMSATZSTEUER').replace('>INPUT<','>EINGABE<').replace('>ASSESSMENT<','>BEURTEILUNG<').replace('ASSESSMENT RECORD','PRÜFPROTOKOLL');
 if(f==='app.mjs')source=source.replace('${r.known.length} Punkte','${r.known.length} ${r.known.length===1?"Punkt":"Punkte"}').replace('${r.pending.length} Punkte','${r.pending.length} ${r.pending.length===1?"Punkt":"Punkte"}').replace('Regelversion${VERSION}','Regelversion ${VERSION}');
 if(f==='sources.mjs')source=source.replaceAll('；','; ').replaceAll('、',', ').replaceAll('（',' (').replaceAll('）',')');
 if(f==='engine.mjs')source=source.replace('Exempt intra-Community supply – applicable dispatch-state implementation of Article 138 Directive 2006/112/EC.','Steuerfreie innergemeinschaftliche Lieferung – nach der anwendbaren Umsetzung von Art. 138 der Richtlinie 2006/112/EG im Abgangsstaat.').replace('Export exemption under the applicable dispatch-state rules – to be confirmed.','Ausfuhrbefreiung nach den anwendbaren Vorschriften des Abgangsstaats – noch zu bestätigen.').replace('Exempt intra-Community supply – dispatch-state conditions to be verified.','Steuerfreie innergemeinschaftliche Lieferung – Voraussetzungen im Abgangsstaat prüfen.');
 if(f==='cases.mjs'){
  // Run the original rules and assertions for validation; localize display metadata only.
  fs.writeFileSync('dist/de/cases-meta.mjs',source);
  source="import {testCases as original,runCase} from '../cases.mjs';\nimport {testCases as localized} from './cases-meta.mjs';\nexport const testCases=original.map((test,i)=>({...test,name:localized[i].name,expect:localized[i].expect}));\nexport {runCase};\n";
 }
 fs.writeFileSync('dist/de/'+f,source);
}
console.log('German pages and modules generated from the same source rules.');

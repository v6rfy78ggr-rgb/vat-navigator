import {readLanguageHandoff,switchLanguage} from './language.mjs';
import {evaluate,PRESETS,base,countries,EU,isEU,SOURCES,VERSION,REVIEW_DATE,caseLabel,label,destinationOf,resolveVat} from './engine.mjs';
import {definitions,stepNames,groups,activeKeys} from './form.mjs';
import {testCases,runCase} from './cases.mjs';
let state={...base},step=0,resultTab='overview',activePreset='export',currentView='case';
const handoff=readLanguageHandoff();
if(handoff){
 for(const key of Object.keys(base)){
  const value=handoff.state?.[key];
  if(value==='UNKNOWN'||definitions[key]?.options.some(option=>option.value===value))state[key]=value;
 }
 step=Number.isInteger(handoff.step)&&handoff.step>=0&&handoff.step<=4?handoff.step:0;
 resultTab=['overview','invoice','sources'].includes(handoff.resultTab)?handoff.resultTab:'overview';
 activePreset=PRESETS.some(p=>p.id===handoff.activePreset)?handoff.activePreset:null;
 currentView=['case','rules','validation'].includes(handoff.currentView)?handoff.currentView:'case';
}
const $=q=>document.querySelector(q);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=(items,cls='pending-list')=>`<ul class="${cls}">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const refLinks=refs=>`<div class="ref-links">${[...new Set(refs)].filter(k=>SOURCES[k]).map(k=>`<a class="ref-chip" href="${SOURCES[k].url}" target="_blank" rel="noopener noreferrer">${esc(SOURCES[k].label)} ↗</a>`).join('')}</div>`;
function renderField(key,index){const d=definitions[key];return `<fieldset class="field"><legend><span class="field-num">${String(index+1).padStart(2,'0')}</span>${esc(d.label)}</legend>${d.select?`<select aria-label="${esc(d.label)}" data-key="${key}">${d.options.map(x=>`<option value="${x.value}" ${state[key]===x.value?'selected':''}>${esc(x.label)}</option>`).join('')}</select>`:`<div class="choice-grid ${d.single?'single':''}" role="group" aria-label="${esc(d.label)}">${d.options.map(x=>`<button type="button" class="choice ${state[key]===x.value?'selected':''}" data-key="${key}" data-value="${x.value}" aria-pressed="${state[key]===x.value}">${esc(x.label)}</button>`).join('')}</div>`}${d.help?`<p class="field-help">${esc(d.help)}</p>`:''}</fieldset>`;}
function renderQuestions(){
 $('#steps').innerHTML=stepNames.map((n,i)=>`<button class="step ${step===i?'active':''}" data-step="${i}" role="tab" aria-selected="${step===i}"><b>0${i+1}</b>${n}</button>`).join('');
 const intros=['选择参与主体和客户类型；设立地、交付地与VAT号码分别核实。','先识别合同性质。工程模块可单独检查采购端或销售端。','实际运输、作业和完成方式决定供应地，不只看开票地址。','填写本交易实际使用的号码所属国；号码不单独改变供应地。','免税、OSS和三角简化各有条件；未落实的项目会保留在结果中。'];
 $('#question-body').innerHTML=`<p class="step-intro">${intros[step]}</p>`+groups(state)[step].map(renderField).join('')+(step===4?`<div class="mini-info"><strong>当前情形</strong><br>${esc(caseLabel(state))}<br>按实际事实选择；凭证、号码及申报状态均由使用者确认。</div>`:'');
 $('#step-count').textContent=`步骤 0${step+1} / 05`;$('#back').disabled=step===0;$('#next').innerHTML=step===4?'查看开票指引 <span>↗</span>':'下一步 <span>→</span>';
 $('#presets').innerHTML=PRESETS.map(p=>`<button class="preset ${activePreset===p.id?'active':''}" data-preset="${p.id}"><strong>${esc(p.name)}</strong><small>${esc(p.hint)}</small></button>`).join('');
}
function checksPanel(r){if(!r.checks.length)return '';return `<section class="detail-section"><h3 class="detail-title"><span>三角交易条件检查</span><span class="count">${esc(({ELIGIBLE:'已声明满足',POTENTIAL:'可能适用',NO:'不适用'})[r.triangleState]||'待检查')}</span></h3><div class="check-list">${r.checks.map(x=>`<div class="check-row"><span class="check-state ${x.status.toLowerCase()}">${x.status==='YES'?'✓':x.status==='NO'?'×':'?'}</span><span>${esc(x.label)}</span></div>`).join('')}</div>${refLinks(['triangle','triangleInvoice','zm'])}</section>`;}
function renderResult(){const r=evaluate(state),d=destinationOf(state),work=state.transaction==='WORK';
 $('#result-title').textContent=r.title;$('#result-summary').textContent=r.summary;$('#result-status').innerHTML=`<span class="status ${r.tone==='amber'?'amber':''}">${esc(r.status)}</span>`;
 $('#route-label').textContent=`${activePreset?'示例场景':'当前选择'} / ${work?(state.workLens==='IN'?'工程采购合同':'工程销售合同'):caseLabel(state)}`;
 $('#chain-result').textContent=r.chain;$('#moving-result').textContent=r.moving;$('#class-result').textContent=r.classification;$('#special-result').textContent=r.special;
 const branch=state.recipient==='BRANCH';
 $('#flow').innerHTML=`<div class="flow-label">${work?'本次合同与交易关系':'物流与合同链'}<span>${work?(state.workLens==='IN'?'评估采购端':'评估销售端'):'按实际供货核实'}</span></div><div class="flow-row"><div class="flow-node"><strong>供应商</strong><small>${esc(label(state.supplierCountry))}</small></div><span class="flow-arrow"></span><div class="flow-node emphasis"><strong>德国 GmbH</strong><small>${work?'分别核对上下游合同':'本交易中间方'}</small></div><span class="flow-arrow"></span><div class="flow-node"><strong>${branch?'欧盟分支':state.buyer==='B2C'?'终端消费者':'终端客户'}</strong><small>${esc(label(d))}${branch?' · 同一主体':''}</small></div></div><div class="flow-foot">${work?'工程分类：'+esc(r.classification)+' · 上下游分别判断':'货物：'+esc(label(state.origin))+' → '+esc(label(d))+' · '+(branch?'购货后内部结算':esc(state.buyer)+' 真实采购转售')}</div>`;
 document.querySelectorAll('[data-result]').forEach(el=>{el.classList.toggle('active',el.dataset.result===resultTab);el.setAttribute('aria-selected',el.dataset.result===resultTab);});
 let html='';
 if(resultTab==='overview'){
  if(r.known.length)html+=`<section class="detail-section"><h3 class="detail-title"><span><b class="icon">✓</b>按当前事实可确定</span><span class="count">${r.known.length}项</span></h3>${r.known.map(x=>`<div class="point"><strong>${esc(x.title)}</strong><p>${esc(x.text)}</p>${refLinks(x.refs)}</div>`).join('')}</section>`;
  html+=checksPanel(r);
  html+=`<section class="detail-section pending-section"><h3 class="detail-title"><span><b class="icon warn">!</b>仍须核实 / 满足的条件</span><span class="count">${r.pending.length}项</span></h3>${r.pending.length?list(r.pending):'<p class="source-intro">按当前声明未发现额外缺失事实；仍按实际证据及适用规则执行。</p>'}</section>`;
  if(r.actions.length)html+=`<section class="detail-section"><h3 class="detail-title">下一步怎么做</h3>${list(r.actions,'action-list')}</section>`;
 }else if(resultTab==='invoice'){
  html=`<section class="detail-section"><h3 class="detail-title">01 · 供应商 → GmbH：收票核对</h3>${r.incoming.length?list(r.incoming,'action-list'):'<p class="source-intro">先补齐关键事实，再锁定采购端发票处理。</p>'}</section><section class="detail-section"><h3 class="detail-title">02 · GmbH → 客户：开票处理</h3>${r.outgoing.length?list(r.outgoing,'action-list'):'<p class="source-intro">当前不锁定对外开票结论。</p>'}</section>`;
  if(r.wording)html+=`<section class="detail-section"><h3 class="detail-title">${work&&state.workLens==='IN'?'被评估采购合同的发票措辞':'适用路径的示例措辞'}</h3><div class="wording">${esc(r.wording)}</div><p class="wording-note">${esc(r.wordingNote)}</p><button class="btn secondary" id="copy-wording">复制示例措辞 ↗</button></section>`;
  if(!r.wording&&!r.code.startsWith('ASK_'))html+=`<p class="wording-note">${esc(r.wordingNote)}</p>`;
  html+=`<div class="mini-info">所用号码：购入端 ${esc(label(resolveVat(state,state.purchaseVat)))} · 对外 ${esc(label(resolveVat(state,state.salesVat)))}。税号所属国与供应地分别判断；三角简化要求两端同一合格VAT号。</div>`;
 }else html=`<section class="detail-section"><p class="source-intro">按当前路径列出官方依据。德国法不替代外国国内法；判例与行政解释的版本另有说明。</p>${r.refs.filter(k=>SOURCES[k]).map((k,i)=>{const x=SOURCES[k];return `<div class="source-row"><span class="source-no">${String(i+1).padStart(2,'0')}</span><div><a href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(x.label)} ↗</a><p>${esc(x.detail)}</p></div></div>`;}).join('')}</section>`;
 $('#result-content').innerHTML=html;
}
function render(){renderQuestions();renderResult();}
function setField(k,v){state[k]=v;activePreset=null;if(k==='recipient'){state.invoice=v==='BRANCH'?'BRANCH':'CHAIN';if(v!=='BRANCH'&&state.buyer==='INTERNAL')state.buyer='B2B';}render();}
function showView(v){currentView=v;for(const id of ['case','rules','validation'])$(`#${id}-view`).hidden=id!==v;document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===v));$('#breadcrumb').textContent={case:'交易判断',rules:'规则与边界',validation:'验证记录'}[v];if(v==='validation')renderValidation();window.scrollTo({top:0,behavior:'auto'});}
function report(){const r=evaluate(state);return [`VAT NAVIGATOR｜德国 GmbH 跨境 VAT 判断`,`规则版本 ${VERSION} · 法条核对 ${REVIEW_DATE}`,`生成于 ${new Date().toLocaleString('zh-CN',{timeZone:'Europe/Berlin'})}（柏林时间）`,'',...activeKeys(state).map(k=>`${definitions[k].label} ${definitions[k].options.find(x=>x.value===state[k])?.label||state[k]}`),'',`结论：${r.title}`,r.summary,`合同性质：${r.classification}`,`Reihengeschäft：${r.chain}`,`运输归属：${r.moving}`,`专项规则：${r.special}`,'','按当前事实可确定：',...r.known.map(x=>`• ${x.title}：${x.text}`),'','三角条件：',...r.checks.map(x=>`• [${x.status}] ${x.label}`),'','仍须核实：',...r.pending.map(x=>`• ${x}`),'','收票核对：',...r.incoming.map(x=>`• ${x}`),'','开票处理：',...r.outgoing.map(x=>`• ${x}`),'',r.wording,r.wordingNote,'','官方依据：',...r.refs.filter(k=>SOURCES[k]).map(k=>`${SOURCES[k].label}\n${SOURCES[k].url}`),'','事实、号码与证据由使用者确认；外国实施规则另查。工具不计算具体税额，不实时更新法律。'].join('\n');}
let toastTimer;function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2500);}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('已提交复制；也可打开记录手动复制或保存');}catch{$('#record-text').value=text;$('#record-dialog').showModal();$('#record-text').select();toast('请手动复制记录，或保存为文本');}}
function showRecord(){$('#record-text').value=report();$('#record-dialog').showModal();}
function downloadRecord(){const blob=new Blob([report()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='VAT-Navigator-判断记录.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function renderRules(){const rules=[
 ['01 / 供货链','先归属运输，再检查特别制度','普通货物链只有一段移动供应。第一供应商运输归购入端；客户运输归转售端；GmbH运输时再查事前使用的起运国号码。供应商实际承运，不一定代表其承担合同运输责任。',['chain','place']],
 ['02 / VAT号码','总部国家、号码国和货物流分别判断','记录GmbH购入及销售端号码、供方与客户号码。号码可改变某些归属及免税条件，但不会独自决定供应地；外国VAT号也不等于实际固定机构。',['acquisition','fixed']],
 ['03 / 三角交易','三个主体，还需要三国合格VAT号','移动供应须归购入端；GmbH两端用同一第三成员国号，客户用到货国号，GmbH不在到货国设立。发票及正确汇总申报是实施条件。货到德国的德国GmbH不因换号就满足条件。',['triangle','triangleInvoice','zm','luxury','buehler']],
 ['04 / B2C','卖给消费者，不自动适用OSS','只有GmbH作跨成员国移动销售且直接或间接参与运输，才继续测试Fernverkauf。若购入端移动，GmbH通常在终点作静态销售，普通本地货物销售不能直接进入OSS。',['distance','indirect','oss']],
 ['05 / €10,000','门槛是有限例外，不是统一免税额','德国GmbH须仅在德国一个成员国设立、从德国起运，上年及本年相关远程销售和TBE服务合计均≤€10k，且未放弃例外。外国起运不能套用该德国起运例外。',['distance','oss']],
 ['06 / 工程','先分类，再确认何时完成与供应地','加工他人物品并自备主要材料，可能是Werklieferung；仅辅料或纯人工通常是Werkleistung。自有材料定制不当然是Werklieferung。工程货物在起运前已完成，与目的地实质安装完成不同。',['work','workAdmin','install']],
 ['07 / 工程VAT','采购端与销售端分别评估','外国供方的真正Werklieferung与普通自有机器安装，在德国§13b下可能不同；GmbH采购端反向征税不能直接传至销售端。建筑工程还须核实受方资格。',['reverse','invoiceSpecial']],
 ['08 / 服务地','B2B受领地、B2C作业地、不动产所在地','动产Werkleistung的B2B一般看实际受领企业或分支；B2C看实际作业地（现行§3a Abs.3 Nr.3a Buchst.b）。不动产、第三国实际使用/利用规则另查。',['service']],
 ["09 / 术语", "一次运输，分清两段供货", "链式交易（Reihengeschäft）是多个供应商依次转售同一货物，但货物直接从第一方送到最后一方。有运输归属的那段称为移动供应（bewegte Lieferung）；另一段称为静态供应（ruhende Lieferung）。", ["chain", "place"]],
 ["10 / 术语", "免税、不在德国征税、反向征税要分开", "免税（steuerfrei）表示该交易进入德国征税范围，但满足免税条件。不在德国征税（nicht im Inland steuerbar）表示交易地点在境外。反向征税（Steuerschuldnerschaft des Leistungsempfängers）表示由买方申报税款，并不是免税。", ["place", "export", "reverse"]],
 ["11 / 术语", "跨境购货与进项抵扣", "欧盟内取得（innergemeinschaftlicher Erwerb）是企业从另一成员国购入并运抵货物时的取得征税。进项税额抵扣（Vorsteuerabzug）是按法定条件抵扣采购相关税款；外国VAT和因使用错误号码国税号产生的额外取得税，不能自动在德国抵扣。", ["acquisition", "input"]],
 ];
 $('#rules-view').innerHTML=`<div class="section-heading"><div class="eyebrow">LOGIC & SCOPE · V2</div><h1>更广的场景，同样清楚的边界。</h1><p>四类终端、B2B/B2C、三角简化与工程合同，使用同一条事实判断顺序。</p></div><div class="rules-grid">${rules.map(([no,title,text,refs])=>`<article class="rule-card"><span class="rule-no">${no}</span><h3>${title}</h3><p>${text}</p>${refLinks(refs)}</article>`).join('')}<article class="rule-card wide-card"><h3>覆盖范围与仍须另行核实的事项</h3><table class="rule-table"><thead><tr><th>范围</th><th>工具提供</th><th>保留事项</th></tr></thead><tbody><tr><td>德国 / 其他EU供应商</td><td>EU27起运，DE/EU/第三国交付</td><td>第三国起运进口、北爱尔兰及特殊领土另查</td></tr><tr><td>一般征税货物</td><td>分支、B2B/B2C、归属、税号与三角检查</td><td>特殊货物§13b、新车、消费税、VAT group、差额/小规模、平台视同供货等</td></tr><tr><td>加工 / 维修 / 安装</td><td>按所选采购或销售合同分类与定位</td><td>复杂单一/多项供应、具体合同与材料经济实质、外国法</td></tr><tr><td>免税与申报</td><td>条件、发票字样、收票清单及法条</td><td>凭证、VAT号有效性由用户核实；不计算金额或实时验证</td></tr></tbody></table><p>法条按${REVIEW_DATE}检索核对；行政解释链接标注原版本，现行法律优先。欧盟指令使用可检索合并版本2025-04-14。外国VAT税率、国内反向征税与登记义务须当地确认。</p><p>本工具在页面内处理选择，不需要真实客户名称、金额或号码，不上传凭证或使用外部分析脚本。语言偏好保存在本浏览器；切换语言时仅在当前会话中临时传递所选事实，以保留进度。公开版本不提供访问控制，请勿输入保密信息。</p></article></div><div class="section-actions"><button class="btn primary" data-view="case">返回交易判断 →</button></div>`;
}
function renderValidation(){const results=testCases.map(t=>({...t,pass:runCase(t)})),pass=results.filter(x=>x.pass).length;
 $('#validation-view').innerHTML=`<div class="section-heading"><div class="eyebrow">PATH VALIDATION · V2</div><h1>主要路径与反例，逐项检查。</h1><p>每次打开本页重新运行当前规则；测试覆盖结论和关键保护条件。</p></div><div class="validation-banner"><div><strong>${pass} / ${results.length} 条路径通过</strong><p>规则版本${VERSION} · 当前页面实时执行</p></div><span>${pass===results.length?'✓ 当前全部通过':'! 存在失败'}</span></div><div class="validation-table"><table class="rule-table"><thead><tr><th>场景</th><th>预期行为</th><th>结果</th></tr></thead><tbody>${results.map(t=>`<tr><td>${esc(t.name)}</td><td>${esc(t.expect)}</td><td><span class="pass ${t.pass?'':'failed'}">${t.pass?'通过':'失败'}</span></td></tr>`).join('')}</tbody></table></div><p class="table-foot">测试验证程序与预定规则的匹配，不替代实际合同、号码、凭证、税务机关或外国专业人员确认。未知关键事实不得自动转为免税或三角简化已适用。</p><div class="section-actions"><button class="btn primary" data-view="case">开始判断 →</button></div>`;
}
function setPreset(id){const p=PRESETS.find(x=>x.id===id);state={...p.state};activePreset=id;step=0;render();}
function reset(){state={...base,supplierCountry:'UNKNOWN',recipient:'UNKNOWN',transaction:'UNKNOWN',scope:'UNKNOWN',origin:'UNKNOWN',direct:'UNKNOWN',disposal:'UNKNOWN',transport:'UNKNOWN',purchaseVat:'UNKNOWN',purchaseValid:'UNKNOWN',salesVat:'UNKNOWN',customerValid:'UNKNOWN',timing:'UNKNOWN'};step=0;activePreset=null;render();toast('已清空核心事实');}
function navigateStep(i){step=i;renderQuestions();$('.question-panel').scrollIntoView({behavior:'auto',block:'start'});}
 document.addEventListener('click',e=>{const el=e.target.closest('button,a.brand');if(!el)return;if(el.dataset.language){switchLanguage(el.dataset.language,{state,step,resultTab,activePreset,currentView});return;}if(el.matches('a.brand')){e.preventDefault();showView('case');return;}if(el.dataset.view){showView(el.dataset.view);return;}if(el.dataset.key){setField(el.dataset.key,el.dataset.value);return;}if(el.dataset.preset){setPreset(el.dataset.preset);return;}if(el.dataset.step!==undefined){navigateStep(Number(el.dataset.step));return;}if(el.dataset.result){resultTab=el.dataset.result;renderResult();return;}if(el.id==='next'){if(step<4)navigateStep(step+1);else{resultTab='invoice';renderResult();$('.result-tabs').scrollIntoView({behavior:'auto',block:'start'});}return;}if(el.id==='back'){navigateStep(Math.max(0,step-1));return;}if(el.id==='reset')reset();if(el.id==='copy-report')copy(report());if(el.id==='show-record')showRecord();if(el.id==='copy-wording')copy(evaluate(state).wording);if(el.id==='download-record')downloadRecord();if(el.id==='close-record')$('#record-dialog').close();if(el.id==='copy-record-text')copy($('#record-text').value);if(el.id==='print-report'){$('#print-area').textContent=report();window.print();}});
 document.addEventListener('change',e=>{if(e.target.matches('select[data-key]'))setField(e.target.dataset.key,e.target.value);});
renderRules();render();if(currentView!=='case')showView(currentView);

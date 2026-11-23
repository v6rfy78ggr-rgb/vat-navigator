import {EU,THIRD,countries,isEU,destinationOf,resolveVat} from './engine.mjs';
const o=(value,label)=>({value,label});
const opts=obj=>Object.entries(obj).map(([value,label])=>({value,label}));
const yesNo=[o('YES','是，已核实'),o('NO','否'),o('UNKNOWN','待核实')];
const euro=opts(EU),outside=opts(THIRD),all=opts({...EU,...THIRD,UNKNOWN:'待确认'}),vat=[...euro,o('NONE','未使用 / 无有效号码'),o('UNKNOWN','待核实')];
const field=(label,options,help='',select=false,single=false)=>({label,options,help,select,single});
export const definitions={
 supplierCountry:field('供应商设立在哪个国家？',[...euro,o('UNKNOWN','待确认')],'与实际起运国分开填写；本版供方为德国或其他欧盟国家。',true),
 recipient:field('终端收货方属于哪一类？',[o('THIRD','第三国终端客户'),o('BRANCH','欧盟境内分支'),o('EU','欧盟境内客户'),o('DE','德国终端客户')],'德国客户与其他欧盟客户按实际交付国区分。'),
 destEU:field('货物交付到哪个成员国？',euro,'分支可选欧盟各国；德国终端客户使用“德国终端客户”类别。',true),
 thirdCountry:field('具体第三国',outside,'英国选项不包括北爱尔兰货物特殊规则；第三国本地法仍须当地确认。',true),
 identity:field('分支与 GmbH 是同一法律及 VAT 主体吗？',[o('SAME','同一主体的 Niederlassung'),o('SEPARATE','独立子公司 / 其他主体'),o('UNKNOWN','待核实')],'独立子公司应选择“欧盟境内客户”。真实固定机构与仅持有VAT号不同。',false,true),
 buyer:field('终端客户以什么身份采购？',[o('B2B','B2B · 企业经营用途'),o('B2C','B2C · 私人消费者')],'本版B2C指私人消费者；有特殊取得门槛的机构客户需专项分析。'),
 customerSeat:field('客户实际企业 / 受领分支或住所地', [o('DEST','与实际交付国相同'),...all],'服务地与客户自运出口时尤其重要；收货地址不一定等于客户设立地。',true),
 scope:field('是否为一般征税、无特殊制度的交易？',[o('NORMAL','是 · 一般征税'),o('SPECIAL','VAT group / 特殊制度'),o('UNKNOWN','待核实')],'特殊制度包括小规模/差额征税、新车、消费税、平台视同供货、寄售及自有货物调拨。'),
 transaction:field('本次要判断什么合同？',[o('GOODS','普通货物采购转售'),o('WORK','工程 / 加工 / 维修'),o('UNKNOWN','合同性质尚不明确')],'工程路径先分类，再判断服务地或货物供应地。',false,true),
 workLens:field('工程模块本次评估哪一段合同？',[o('OUT','销售端：GmbH → 客户'),o('IN','采购端：供应商 → GmbH')],'同一工程上下游合同须分别判断；在两段之间切换可分别核对。',false,true),
 foreignAsset:field('承包方是否加工他人所有的物品？',yesNo,'客户提供的部件/原物通常属于他人物品；完全自有材料定制不因此成为Werklieferung。'),
 materials:field('承包方自行提供什么材料？',[o('MAIN','自行提供非仅附属、次要性质的材料'),o('AUX','仅辅料 / 次要材料'),o('NONE','不供材料，纯人工'),o('UNKNOWN','待核实')],'按经济实质与材料性质判断；材料价格比例不是通用硬门槛。'),
 immovable:field('是否直接与不动产关联？',yesNo,'固定设备、机器是否构成不动产的一部分，需要结合实际安装及拆除影响判断。'),
 installation:field('交付物在何时完成？',[o('DEST','目的地实质安装后才完成'),o('NONE','起运前已完成，无实质安装'),o('REASSEMBLY','仅为运输拆卸后复装'),o('UNKNOWN','待核实')],'工程供应不一律在安装地；为运输复装与实质安装完成不同。',false,true),
 origin:field('货物实际起运国',[...euro,o('UNKNOWN','待确认')],'查仓库和提货地址；工程已完成后运输时，填本次合同货物的起运国。',true),
 invoice:field('合同与开票关系',[o('CHAIN','供应商 → GmbH → 独立客户'),o('BRANCH','供应商 → GmbH；分支内部结算'),o('AGENCY','供应商直开客户；GmbH仅收服务费'),o('UNKNOWN','待核实')],'发票流要与真实供应和处置权一致。',false,true),
 direct:field('同一批货是否单次直接送达？',yesNo,'先入库、分段分别委托或其他复杂运输不自动套直接供货链。'),
 disposal:field('真实供货及支配货物的权利（Verfügungsmacht）转移已核实吗？',[o('YES','已核实'),o('UNKNOWN','尚未核实')],'同一分支路径仅核实供应商对GmbH的实际供货。'),
 transport:field('谁以自身责任安排整段运输？',[o('SUPPLIER','第一供应商'),o('GMBH','德国 GmbH'),o('CUSTOMER','最终客户'),o('MIXED','不同主体分段安排'),o('UNKNOWN','待核实')],'看实际运输合同责任。供应商若仅替GmbH承运、由GmbH承担运输责任，应按该事实选择GmbH。'),
 purchaseEntity:field('GmbH自运出口：采购以谁的名义缔约？',[o('HEAD','德国本部'),o('FOREIGN_BRANCH','境外分支以自己名义缔约'),o('UNKNOWN','待核实')],'§6 Abs.2 Nr.2的境外分支条件需单独核实。',false,true),
 purchaseVat:field('GmbH 向供应商使用哪个国家的号码？',vat,'填写实际用于本交易的号码国；不是GmbH总部所在地。',true),
 purchaseKind:field('购入端提供的是哪种号码？',[o('VAT','USt-IdNr. / VAT ID'),o('TAX','普通 Steuernummer'),o('NONE','未提供号码'),o('UNKNOWN','待核实')],'欧盟内免税和跨成员国中间商归属不能用普通Steuernummer替代VAT ID；出口规则另查。'),
 purchaseValid:field('GmbH购入端VAT号有效且已告知？',yesNo,'若使用普通税号，本项不替代其真实性核对；若是VAT号，留存有效性及告知记录。'),
 timing:field('该号码是否在运输开始前使用？',yesNo,'不能以事后在发票补填号码替代发货前使用事实。'),
 salesVat:field('GmbH 向客户使用哪个国家的 VAT 号？',vat,'三角简化通常要求购入与转售端使用同一第三成员国号；其他交易仍须匹配实际登记和开票。',true),
 supplierVat:field('供应商使用的已核实 VAT 号所属国',[o('ORIGIN','已确认：实际起运国VAT号'),...vat],'三角交易按实际交易所用号码国检查；并非按三个总部国家检查。',true),
 customerVat:field('B2B客户实际使用的 VAT 号所属国',[o('DEST','已确认：到货国VAT号'),...vat],'三角简化要求最终客户使用到货国号；欧盟内免税另核实他国有效号条件。',true),
 customerValid:field('客户VAT号在本交易有效且已告知？',yesNo,'货物免税需核对有效VAT号；服务B2B身份可结合其他适当证据，不能只凭号码猜测。'),
 destEstablishment:field('GmbH 在到货国有实际营业机构（feste Niederlassung）吗？',[o('NONE','没有设立机构'),o('VAT_ONLY','仅有VAT注册，无实际机构'),o('PRESENT','有实际营业 / 固定机构'),o('UNKNOWN','待核实')],'德国GmbH在德国设立；货到德国时不因改用外国号码就满足“不在到货国设立”。',false,true),
 evidence:field('运输 / 到货 / 出口及账簿记录已齐备？',[o('YES','已核实齐备'),o('PENDING','准备中 / 待核实'),o('NO','缺失 / 不一致')],'仅是用户声明；本工具不校验VAT号、不读取业务凭证。'),
 zm:field('相关欧盟交易汇总申报（Zusammenfassende Meldung，ZM）已正确落实？',[o('YES','已核实正确申报'),o('PENDING','拟申报 / 待核实'),o('NO','尚未申报 / 有错误')],'DE号三角交易需客户号、金额及三角标识；外国号码国按其实施规则确认。'),
 triangleUse:field('是否拟采用三角交易简化？',[o('CHECK','检查可行性'),o('APPLY','拟采用简化'),o('NO','尚未落实简化条件')],'系统按实际条件判断；拟采用不等于已满足，意向也不能排除已触发的法定结果。'),
 triangleInvoice:field('三角交易的发票实质条件已落实？',[o('YES','已列三角+RC说明、双方号且无税额'),o('PENDING','拟开具 / 待核实'),o('NO','已开票但有遗漏')],'必须明确最终买方纳税义务；事后更正不自动追溯原期。',false,true),
 sellerParticipation:field('GmbH 是否直接或间接参与配送？',yesNo,'联系/推荐承运人、传递配送资料或代收运费等可能构成间接参与；完全独立自提选“否”。'),
 threshold:field('统一 €10,000 门槛及放弃选项',[o('OVER','已超门槛，或已放弃例外'),o('LOW','上年与本年均≤€10k且未放弃'),o('UNKNOWN','尚未核实')],'按不含VAT的净额，合计欧盟内远程销售及电信、广播电视和电子服务（TBE-Leistungen）；不是每个客户国各€10,000。主动放弃门槛例外至少约束两个日历年。',false,true),
 euEstablishment:field('GmbH 在欧盟的实际设立情况',[o('DE_ONLY','仅在德国设立'),o('MULTI','其他成员国也有实际固定机构'),o('UNKNOWN','待核实')],'只有当地VAT注册本身不等于固定机构。',false,true),
 oss:field('Union OSS参与已生效且覆盖本期？',yesNo,'OSS是申报方式，不改变供应地，也不覆盖全部本地货物供应。'),
 personalLuggage:field('是否由消费者以个人行李带出欧盟？',yesNo,'个人行李出口另按§6 Abs.3a核实，不能直接沿用普通商业出口条件。'),
 workPlace:field('实际作业 / 安装完成 / 不动产所在国',all,'根据本次合同的经济实质选择；不一定等于客户国家。',true),
 workRecipient:field('采购端：GmbH实际受领企业/分支所在地',[o('DEST','德国本部（默认）'),...all],'服务按实际受领企业/分支；完成后运输的货物则填GmbH实际到货国。',true),
 thirdUse:field('动产B2B作业服务是否在第三国实际使用？',yesNo,'德国服务地可能受§3a Abs.8影响；外国服务地由当地规则另查。'),
 workTransport:field('完成后移动供货：谁安排本合同运输？',[o('PERFORMER','供方 / 承包方'),o('RECIPIENT','本合同受方'),o('UNKNOWN','待核实')],'本模块不推定普通三方同物链；出口客户自运及B2C配送另查。'),
 construction:field('本次合同是否属于§13b意义上的建筑工程？',yesNo,'不因名称带“工程”或一般机器安装就自动属于Bauleistung。'),
 builder:field('受方是否持续提供建筑服务且资格已确认？',yesNo,'德国建筑工程的受方资格单独核实；采购端指GmbH，销售端指终端客户。'),
 serviceSupplierPresence:field('GmbH在服务国是否有参与本合同的固定机构？',[o('NONE','无参与的当地机构'),o('INVOLVED','有参与的当地机构'),o('UNKNOWN','待核实')],'当地机构参与时不能自动采用跨境B2B服务的反向征税。',false,true),
 supplierDEPresence:field('外国供方是否有参与本合同的德国机构？',[o('NONE','无参与的德国机构'),o('INVOLVED','有参与的德国机构'),o('UNKNOWN','待核实')],'仅有DE VAT号不等于德国设立；机构涉入会影响§13b。',false,true),
};
export const stepNames=['交易主体','合同性质','物流履行','VAT号码','专项条件'];
export function groups(s){const d=destinationOf(s),branch=s.recipient==='BRANCH',work=s.transaction==='WORK';const cross=isEU(s.origin)&&isEU(d)&&s.origin!==d;const goodsWork=s.foreignAsset==='NO'||s.materials==='MAIN';
 const subject=['supplierCountry','recipient',...(['BRANCH','EU'].includes(s.recipient)?['destEU']:s.recipient==='THIRD'?['thirdCountry']:[]),...(branch?['identity']:['buyer','customerSeat'])];
 const contract=['scope','transaction',...(work?['workLens','foreignAsset',...(s.foreignAsset==='YES'?['materials']:[]),'immovable',...(goodsWork?['installation']:[])]:[])];
 if(work){const completeMove=goodsWork&&s.immovable==='NO'&&['NONE','REASSEMBLY'].includes(s.installation);return [subject,contract,[...(completeMove?['origin','workTransport']:['workPlace']),...(s.workLens==='IN'?['workRecipient',...(completeMove&&s.workTransport==='RECIPIENT'?['purchaseEntity']:[])]:[]),...(!goodsWork&&s.immovable==='NO'&&(s.workLens==='IN'||s.buyer==='B2B')?['thirdUse',...(s.workLens==='OUT'?['serviceSupplierPresence']:[])]:[]),'construction',...(s.construction==='YES'?['builder']:[]),...(s.workLens==='IN'&&s.supplierCountry!=='DE'?['supplierDEPresence']:[])],['purchaseVat','purchaseKind','purchaseValid',...(s.workLens==='OUT'?['salesVat',...(s.buyer==='B2B'?['customerVat','customerValid']:[])]:[])],['evidence',...(completeMove&&s.workLens==='OUT'&&!isEU(d)&&s.buyer==='B2C'&&s.workTransport==='RECIPIENT'?['personalLuggage']:[]),...(completeMove&&s.workLens==='OUT'&&s.buyer==='B2C'?['sellerParticipation','threshold','euEstablishment','oss']:[]),...(!goodsWork&&s.buyer==='B2C'&&s.workLens==='OUT'?['oss']:[]),'zm']];}
 return [subject,contract,['origin','invoice','direct','disposal',...(!branch?['transport',...(s.recipient==='THIRD'&&s.transport==='GMBH'?['purchaseEntity']:[])]:[])],['purchaseVat','purchaseKind','purchaseValid',...(s.transport==='GMBH'&&!branch?['timing']:[]),...(!branch?['salesVat']:[]),...(cross&&!branch&&s.buyer==='B2B'?['supplierVat','customerVat','customerValid','destEstablishment']:[])],['evidence',...(cross?['zm']:[]),...(cross&&!branch&&s.buyer==='B2B'?['triangleUse','triangleInvoice']:[]),...(cross&&!branch&&s.buyer==='B2C'?['sellerParticipation','threshold',...(s.threshold==='LOW'?['euEstablishment']:[]),'oss']:[]),...(s.recipient==='THIRD'&&s.buyer==='B2C'&&s.transport==='CUSTOMER'?['personalLuggage']:[])]];
}
export const activeKeys=s=>[...new Set(groups(s).flat())];

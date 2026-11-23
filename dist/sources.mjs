const G='https://www.gesetze-im-internet.de/ustg_1980/';
const D='https://www.gesetze-im-internet.de/ustdv_1980/';
const E='https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:02006L0112-20250414';
export const SOURCES={
 chain:{label:'§ 3 Abs. 6a UStG',url:G+'__3.html',detail:'先识别真实供货与单一运输，再依据运输责任及事前使用的起运国号码分配运输。'},
 place:{label:'§ 3 Abs. 6、7 UStG；Art. 31、32 MwStSystRL',url:G+'__3.html',detail:'移动供应通常在起运地；链式静态供应分别在移动供应之前的起点或之后的终点。'},
 export:{label:'§ 4 Nr. 1a、§ 6 UStG',url:G+'__6.html',detail:'出口免税实质条件；客户自运还要审查外国买方，B2C个人行李另有条件。'},
 ics:{label:'§ 4 Nr. 1b、§ 6a UStG',url:G+'__6a.html',detail:'欧盟内供应须核实买方、他国有效VAT号、运输及汇总申报等。'},
 acquisition:{label:'§ 3d UStG；Art. 40、41 MwStSystRL',url:G+'__3d.html',detail:'到货国取得与不同税号国额外取得；真正适用三角简化时另有规则。'},
 input:{label:'§ 15 Abs. 1 Nr. 1、3、4 UStG',url:G+'__15.html',detail:'依法应纳德国税额、实际德国取得税及反向征税的抵扣条件各不相同。'},
 invoice:{label:'§ 14 Abs. 4 UStG',url:G+'__14.html',detail:'发票基本要素、税额或免税说明；外国发票须按其适用规则审核。'},
 invoiceSpecial:{label:'§ 14a Abs. 1、3、5、7 UStG',url:G+'__14a.html',detail:'跨境服务、欧盟内供应、反向征税及三角交易的特别开票要求。'},
 evidence:{label:'§§ 8–10、13、17a、17b UStDV',url:D+'index.html',detail:'出口证明、账簿记录及欧盟内到货证明。用户勾选不代表工具已验证文件。'},
 eu:{label:'MwStSystRL 2006/112/EG',url:E,detail:'Art. 31/32（供应地）、36a（欧盟内链）、138（欧盟内供应）、146（出口）、226（发票）。'},
 distance:{label:'§ 3c Abs. 1、4、5 UStG',url:G+'__3c.html',detail:'B2C远程销售、€10,000例外及安装等排除；先确认GmbH是否作移动供应。'},
 oss:{label:'§ 18j UStG；欧委会 OSS 指南',url:'https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en',detail:'Union OSS覆盖及€10,000资格；外国起运不适用德国单一设立者的该门槛例外。'},
 ossLaw:{label:'§ 18j UStG',url:G+'__18j.html',detail:'Union OSS范围与参与；普通境内静态货物销售不能一概放入OSS。'},
 indirect:{label:'Art. 5a VO (EU) 282/2011（2019/2026修订）',url:'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019R2026',detail:'远程销售中的直接或间接参与运输，不仅看谁支付运费。'},
 triangle:{label:'§ 25b UStG；Art. 42、141、197 MwStSystRL',url:G+'__25b.html',detail:'三角简化：三方所用不同成员国VAT号、中间商购入端移动、到货国未设立等条件。'},
 triangleAdmin:{label:'UStAE 25b.1 Abs.6、8 · 官方解释',url:'https://ao.bundesfinanzministerium.de/usth/2024/A-Umsatzsteuergesetz/VI-Sonderregelungen/Paragraf-25b/ae-25b-1.html',detail:'满足全部条件后的法定税债转移与三角发票实质要求；页面为官方2024手册。'},
 triangleInvoice:{label:'§ 14a Abs. 7 UStG',url:G+'__14a.html',detail:'三角交易及最终买方纳税义务说明、双方VAT号、不单列VAT。'},
 zm:{label:'§ 18a Abs. 1、2、7 Nr. 1/3/4、10 UStG',url:G+'__18a.html',detail:'分别覆盖欧盟内货物供应、跨境B2B服务和三角交易的汇总申报（Zusammenfassende Meldung），并注意更正义务。'},
 luxury:{label:'EuGH C-247/21 · Luxury Trust',url:'https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62021CJ0247',detail:'三角发票关键说明属于实质条件；不能假定事后补写自动追溯原期。'},
 buehler:{label:'EuGH C-580/16 · Hans Bühler',url:'https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=CELEX:62016CJ0580',detail:'中间商在起运国设立或注册不当然阻止简化；本交易实际使用的VAT号很重要。'},
 work:{label:'§ 3 Abs. 4 UStG；UStAE 3.8',url:G+'__3.html',detail:'他人物品加工并自备主要材料可能是Werklieferung；纯自有原料定制不当然属于该类。'},
 workAdmin:{label:'UStAE 3.8 · 官方解释',url:'https://usth.bundesfinanzministerium.de/usth/2023/A-Umsatzsteuergesetz/I-Steuergegenstand-und-Geltungsbereich/Paragraf-3/ae-3-8.html',detail:'维修和加工按经济实质分类；材料比例不是通用硬门槛。'},
 service:{label:'§ 3a Abs. 2、3、8 UStG',url:G+'__3a.html',detail:'B2B受领企业/分支地；B2C动产作业现行为Abs.3 Nr.3a Buchst.b；不动产及第三国使用另查。'},
 install:{label:'Art. 36 MwStSystRL；UStAE 3.12 Abs. 4',url:E,detail:'在目的地安装完成的供货通常定位安装地；为运输拆卸后复装，不当然改变为安装地供应。'},
 reverse:{label:'§ 13b Abs. 1、2 Nr. 1/4、5、7 UStG',url:G+'__13b.html',detail:'外国作业服务、真正Werklieferung及建筑工程分别判断；普通自有机器安装不自动适用。'},
 transfer:{label:'§ 3 Abs. 1a UStG；Art. 17 MwStSystRL',url:G+'__3.html',detail:'自有货物调拨另行识别；直接向同一GmbH分支购货不是对分支的第二次销售。'},
 fixed:{label:'Art. 11 Abs. 3 VO (EU) 282/2011',url:'https://eur-lex.europa.eu/eli/reg/2011/282/oj?locale=de',detail:'持有当地VAT号本身不等于当地固定机构；实际机构仍需事实审查。'},
};
export const EU={DE:'德国',AT:'奥地利',BE:'比利时',BG:'保加利亚',HR:'克罗地亚',CY:'塞浦路斯',CZ:'捷克',DK:'丹麦',EE:'爱沙尼亚',FI:'芬兰',FR:'法国',GR:'希腊',HU:'匈牙利',IE:'爱尔兰',IT:'意大利',LV:'拉脱维亚',LT:'立陶宛',LU:'卢森堡',MT:'马耳他',NL:'荷兰',PL:'波兰',PT:'葡萄牙',RO:'罗马尼亚',SK:'斯洛伐克',SI:'斯洛文尼亚',ES:'西班牙',SE:'瑞典'};
export const THIRD={THIRD:'第三国（待按具体国家核实）',CH:'瑞士',GB:'英国（不含北爱尔兰货物特殊规则）',US:'美国',CN:'中国',TN:'突尼斯'};
export const countries={...EU,...THIRD,UNKNOWN:'待确认',NONE:'未使用 / 无有效VAT号'};
export const isEU=(c)=>Boolean(EU[c]);
export const label=(c)=>countries[c]||'待确认';

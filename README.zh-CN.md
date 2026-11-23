# VAT Navigator 2.1

[English](README.md) · [Deutsch](README.de.md) · [简体中文](README.zh-CN.md)

[项目入口](https://v6rfy78ggr-rgb.github.io/v6rfy78ggr-rgb/zh-CN.html) · [一分钟试用](TRY_IT.md) · [版本下载](https://github.com/v6rfy78ggr-rgb/vat-navigator/releases) · [打开演示](https://v6rfy78ggr-rgb.github.io/vat-navigator/)

从德国 GmbH 角度梳理跨境采购和销售 VAT 的浏览器工具。根据事实选项生成判断路径、未满足条件、开票提示和官方来源链接，方便专业人员复核。

## 如何试用

通过 **Code → Download ZIP** 下载并解压，在项目目录运行 `python3 -m http.server 8000 --directory dist`，然后打开 <http://localhost:8000>。先选择内置案例，再改变一个关键事实观察结果。项目使用 ES 模块，需要本地 HTTP 服务，不能直接双击 HTML。

界面支持**德语和中文**；英文 README 不代表已有英文界面。运行不需要安装第三方包。开发测试使用 Node.js 20 或以上，执行 `npm test`。

## 可以做什么

- 梳理德国、其他欧盟国家和第三国目的地的货物流转，分别记录运输归属和使用的 VAT 号所属国。
- 初步检查三角贸易、B2B/B2C、远程销售与 OSS、同一主体分支机构情形。
- 区分 Werklieferung、Werkleistung 和安装供应，采购与转售分别判断。
- 打印或下载事实、条件及来源记录；关键事实不明时，不直接给出无条件开票措辞。

## 当前状态与边界

这是专业筛查原型。规则来源复核基准为 **2026年11月5日**，本次发布检查为 **2026年11月23日**；发布检查不等于更新法律。外国注册义务、当地 VAT 和反向征税须另行核实。特殊制度、欧盟外起运的进口以及复杂组合合同不在通用流程覆盖范围。VAT 号、证据及机构事实由使用者确认，没有税局或在线接口核验。

`npm test` 已通过 110 个代表场景、2,880 组事实组合和德中结果一致性检查。测试证明所测的软件行为，不构成对所有税务情形的保证。

## 数据与开发

判断在浏览器内完成。语言偏好保存在本地；切换语言时通过会话存储传递事实，失败时使用 URL 片段。请勿输入保密标识。网站托管方可能接收正常访问元数据。

`dist/` 为中文源模块；德语翻译维护在 `i18n/de.json`。修改后执行 `npm run build:locales` 和 `npm test`，不要单独修改生成的德语模块。

最希望收到运输归属、遗漏事实、开票条件和德语术语方面的反馈。请使用虚构案例，并附上预期结果及对应法规来源。

## 参与完善

[提交问题或建议](https://github.com/v6rfy78ggr-rgb/vat-navigator/issues/new/choose)，支持中文、德语和英语。请只使用虚构数据，公开 Issue 任何人都能看到。协作流程见 [CONTRIBUTING.md](CONTRIBUTING.md)，MIT 许可见 [LICENSE](LICENSE)。

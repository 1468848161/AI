"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, BookOpen, Bot, Braces, ChevronDown, CircleGauge, Code2, Copy, Headphones, KeyRound, Layers3, ListFilter, Menu, MessageSquareText, Moon, Search, Sparkles, Star, Video, Workflow, X, Zap } from "lucide-react";
import { BrandLogo } from "./brand";
import { platformModels, type ModelKind } from "./data";

function ApiHeader() {
  const [open, setOpen] = useState(false);
  return <header className="api-header"><Link href="/api"><BrandLogo/><span>开放平台</span></Link><nav className={open ? "open" : ""}><Link href="/api">首页</Link><Link href="/account?tab=keys">控制台</Link><Link href="/api/pricing">模型广场</Link><Link href="/api/rankings">模型排行</Link><Link href="/apidoc">文档</Link></nav><div><button><Headphones/>在线客服</button><button><Moon/></button><Link href="/home">进入主站</Link><button className="api-mobile-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></header>;
}

export function ApiLanding() {
  return <main className="api-site"><ApiHeader/>
    <section className="api-hero-section"><div className="api-glow"/><div className="api-hero-copy"><span><Sparkles/>人工智能应用基座</span><h1><em>API</em> AI 开放平台</h1><p>一个 Base URL 接入主流模型，兼容 OpenAI / Anthropic / Gemini 协议，覆盖聊天、图片、视频和音频。</p><div><Link href="/account?tab=keys">进入控制台 <ArrowRight/></Link><Link href="/api/pricing">查看模型与价格</Link><Link href="/apidoc"><Braces/>开发文档</Link></div></div>
      <div className="api-terminal"><header><i/><i/><i/><span>POST /v1/chat/completions</span><em>200 OK</em></header><pre><code><b>curl</b> -X POST <span>&quot;/v1/chat/completions&quot;</span> {`\\`}<br/>  -H <span>&quot;Authorization: Bearer sk-••••&quot;</span> {`\\`}<br/>  -d {`'{`}<br/>    <strong>&quot;model&quot;</strong>: <span>&quot;gpt-5&quot;</span>,<br/>    <strong>&quot;messages&quot;</strong>: [{`{`} <strong>&quot;role&quot;</strong>: <span>&quot;user&quot;</span> {`}`} ]<br/>  {`}'`}</code></pre><footer><span><i/>142 ms</span><span>27 tokens</span><span>$0.00081</span><b>stream · sse</b></footer></div>
    </section>
    <section className="api-number-strip"><span><b>500+</b>模型</span><span><b>30+</b>厂商</span><span><b>3</b>兼容协议</span><span><b>99.9%</b>综合可用性</span></section>
    <section className="api-feature-section"><header><span>核心功能</span><h2>为开发者打造，<br/>为规模而设计</h2></header><div className="api-feature-grid">
      <article><em>01</em><i><Layers3/></i><h3>协议兼容</h3><p>OpenAI、Anthropic、Gemini 三协议，替换 Base URL 即可使用。</p><footer><span>OpenAI</span><span>Claude</span><span>Gemini</span></footer></article>
      <article><em>02</em><i><Workflow/></i><h3>渠道智能调度</h3><p>按价格、速度、成功率或自定义权重自动选择最佳线路。</p><footer><span>自动容灾</span><span>负载均衡</span></footer></article>
      <article><em>03</em><i><Video/></i><h3>媒体生成</h3><p>图片、视频、音频统一任务入口，提交、轮询、回调完整支持。</p><footer><span>异步任务</span><span>Webhook</span></footer></article>
      <article><em>04</em><i><Bot/></i><h3>Skills 与工具</h3><p>让 AI 编程工具自动读取能力与文档，快速完成零配置接入。</p><footer><span>SDK</span><span>CLI</span><span>MCP</span></footer></article>
    </div></section>
    <section id="docs" className="protocol-section"><header><span>统一接口</span><h2>一个 Base URL，覆盖全部能力</h2></header><div><article><MessageSquareText/><b>兼容 OpenAI</b><p>/v1/chat/completions、/v1/responses 与 /v1/models</p></article><article><Braces/><b>兼容 Anthropic</b><p>/v1/messages，Claude Code 等工具可以直接接入</p></article><article><Zap/><b>兼容 Gemini</b><p>原生 generateContent 与双版本模型路径</p></article></div></section>
    <section className="api-steps"><header><span>快速开始</span><h2>三步接入全部模型</h2></header><div><article><i>1</i><KeyRound/><b>创建 API 密钥</b><p>登录控制台创建密钥并设置额度与渠道策略。</p></article><article><i>2</i><WalletIcon/><b>充值共享余额</b><p>API 与创作主站使用同一账户余额和账单。</p></article><article><i>3</i><Code2/><b>替换 Base URL</b><p>保留现有 SDK 调用方式即可切换到聚合平台。</p></article></div></section>
    <section className="api-final-cta"><Sparkles/><h2>准备好简化你的 AI 集成了吗？</h2><p>创建一个 API 密钥，即可调用平台全部已启用模型。</p><Link href="/account?tab=keys">进入控制台 <ArrowRight/></Link><Link href="/api/pricing">模型与价格</Link></section>
    <ApiFooter/>
  </main>;
}

function WalletIcon(){return <CircleGauge/>}

export function ApiPricing() {
  const [query,setQuery]=useState("");
  const [kind,setKind]=useState<"全部"|ModelKind>("全部");
  const [vendor,setVendor]=useState("全部");
  const [tag,setTag]=useState("");
  const [favorites,setFavorites]=useState<string[]>([]);
  const results=useMemo(()=>platformModels.filter(model=>(kind==="全部"||model.kind===kind)&&(vendor==="全部"||model.vendor===vendor)&&(!tag||model.tags.includes(tag))&&`${model.name}${model.description}${model.tags.join("")}`.toLowerCase().includes(query.toLowerCase())),[query,kind,vendor,tag]);
  return <main className="api-site api-pricing"><ApiHeader/><section className="pricing-hero"><span>本站当前已启用模型，总计 {platformModels.length} 个</span><h1>模型广场</h1><p>探索精选 AI 模型，清晰比较价格、协议与能力。</p><label><Search/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索名称、简介、厂商、协议或标签…"/><button>搜索</button></label></section>
    <section className="pricing-layout"><aside><header><b>筛选</b><button onClick={()=>{setKind("全部");setVendor("全部");setTag("");setQuery("")}}>重置</button></header><FilterGroup title="模型类型" items={["全部","聊天","图片","视频","音频"]} value={kind} change={value=>setKind(value as "全部"|ModelKind)}/><FilterGroup title="供应商" items={["全部",...new Set(platformModels.map(model=>model.vendor))]} value={vendor} change={setVendor}/><div className="tag-filter"><b>能力标签</b><div>{["长上下文","多模态","工具调用","文生图","图生视频","有声视频","多语言","高性价比","语音克隆"].map(item=><button className={tag===item?"active":""} onClick={()=>setTag(tag===item?"":item)} key={item}>{item}</button>)}</div></div></aside><div className="pricing-results"><header><span>找到 <b>{results.length}</b> 个模型</span><button><ListFilter/>综合排序 <ChevronDown/></button></header><div>{results.map(model=><article key={model.id}><header><i className={`model-symbol ${model.tone}`}>{model.symbol}</i><span><h3>{model.name}{model.badge&&<em>{model.badge}</em>}</h3><small>{model.vendor} · {model.kind}</small></span><button className={favorites.includes(model.id)?"active":""} onClick={()=>setFavorites(items=>items.includes(model.id)?items.filter(item=>item!==model.id):[...items,model.id])} aria-label="收藏模型"><Star/></button></header><p>{model.description}</p><div>{model.tags.map(item=><span key={item}>{item}</span>)}</div><section><span><small>计费方式</small><b>{model.billing}</b></span><span><small>兼容协议</small><b>{model.kind==="聊天"?"OpenAI":"媒体任务"}</b></span></section><footer><Link href="/apidoc">API 文档</Link><Link href="/home">立即体验 <ArrowRight/></Link></footer></article>)}</div></div></section><ApiFooter/></main>;
}

function FilterGroup({title,items,value,change}:{title:string;items:string[];value:string;change:(value:string)=>void}){return <div className="filter-group"><b>{title}<ChevronDown/></b>{items.map(item=><button className={value===item?"active":""} onClick={()=>change(item)} key={item}><span>{item}</span><small>{item==="全部"?platformModels.length:platformModels.filter(model=>model.kind===item||model.vendor===item).length}</small></button>)}</div>}

export function ApiRankings(){
  const [kind,setKind]=useState<"综合榜"|"对话榜"|"图像榜"|"视频榜">("综合榜");
  const type=kind==="对话榜"?"聊天":kind==="图像榜"?"图片":kind==="视频榜"?"视频":null;
  const rows=platformModels.filter(model=>!type||model.kind===type).slice(0,10);
  return <main className="api-site rankings-page"><ApiHeader/><section className="ranking-hero"><span><BarChart3/>实时数据</span><h1>模型综合排行</h1><p>根据调用成功率、响应速度、用户评分与价格表现综合计算。</p></section><section className="ranking-board"><header>{["综合榜","对话榜","图像榜","视频榜"].map(item=><button className={kind===item?"active":""} onClick={()=>setKind(item as typeof kind)} key={item}>{item}</button>)}<span>每小时更新</span></header>{rows.map((model,index)=><article key={model.id}><em className={index<3?`top-${index+1}`:""}>{index+1}</em><i className={`model-symbol ${model.tone}`}>{model.symbol}</i><span><b>{model.name}</b><small>{model.vendor} · {model.kind}</small></span><div><small>成功率</small><b>{(99.9-index*.13).toFixed(2)}%</b></div><div><small>平均响应</small><b>{(0.8+index*.21).toFixed(2)}s</b></div><div><small>用户评分</small><b>★ {(4.9-index*.04).toFixed(1)}</b></div><Link href="/home">体验</Link></article>)}</section><ApiFooter/></main>
}

const docSections = [
  { id:"quick", title:"快速开始", method:"GET", path:"/v1/models", description:"获取当前令牌可访问的模型列表。", code:`curl https://api.your-domain.com/v1/models \\\n+  -H "Authorization: Bearer sk-your-key"` },
  { id:"chat", title:"聊天补全", method:"POST", path:"/v1/chat/completions", description:"兼容 OpenAI Chat Completions，支持流式输出与工具调用。", code:`curl https://api.your-domain.com/v1/chat/completions \\\n+  -H "Authorization: Bearer sk-your-key" \\\n+  -H "Content-Type: application/json" \\\n+  -d '{"model":"gpt-5","messages":[{"role":"user","content":"你好"}]}'` },
  { id:"responses", title:"Responses API", method:"POST", path:"/v1/responses", description:"面向智能体与多模态工作流的统一响应接口。", code:`const response = await client.responses.create({
  model: "gpt-5",
  input: "为新产品制定发布计划"
});` },
  { id:"anthropic", title:"Anthropic 兼容", method:"POST", path:"/v1/messages", description:"Claude SDK 可直接替换 Base URL 接入。", code:`const anthropic = new Anthropic({
  apiKey: "sk-your-key",
  baseURL: "https://api.your-domain.com"
});` },
  { id:"media", title:"媒体任务", method:"POST", path:"/v1/media/generations", description:"提交图片、视频或音频异步任务，并通过任务 ID 查询结果。", code:`POST /v1/media/generations
{
  "model": "seedance-2",
  "prompt": "电影感产品短片",
  "duration": 10
}` },
];

export function ApiDocs(){
  const [active,setActive]=useState(docSections[0]);
  const [copied,setCopied]=useState(false);
  const [query,setQuery]=useState("");
  const visibleDocs=docSections.filter(section=>`${section.title}${section.path}${section.description}`.toLowerCase().includes(query.toLowerCase()));
  function copy(){void navigator.clipboard?.writeText(active.code);setCopied(true);window.setTimeout(()=>setCopied(false),1500)}
  return <main className="api-site api-docs"><ApiHeader/><section className="docs-shell"><aside><header><BookOpen/><span><b>开发文档</b><small>API Reference</small></span></header><label><Search/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索文档…"/></label><nav>{visibleDocs.map(section=><button className={active.id===section.id?"active":""} onClick={()=>setActive(section)} key={section.id}><span>{section.title}</span><small>{section.method}</small></button>)}</nav><footer><Link href="/api/pricing">模型与价格 <ArrowRight/></Link><Link href="/account?tab=keys">管理 API 密钥 <ArrowRight/></Link></footer></aside><article><span className="docs-kicker">API REFERENCE</span><h1>{active.title}</h1><p>{active.description}</p><div className="endpoint-line"><em>{active.method}</em><code>{active.path}</code></div><section><header><b>请求示例</b><button onClick={copy}><Copy/>{copied?"已复制":"复制"}</button></header><pre><code>{active.code}</code></pre></section><div className="docs-notes"><h2>认证与响应</h2><p>所有请求使用 <code>Authorization: Bearer sk-...</code>。成功时返回 JSON；失败时包含标准错误对象、状态码与可追踪的 request_id。</p><div><span><b>200</b>请求成功</span><span><b>401</b>密钥无效</span><span><b>429</b>达到速率限制</span></div></div></article></section><ApiFooter/></main>
}

function ApiFooter(){return <footer className="api-footer"><BrandLogo/><p>企业级 AI 模型聚合与开放平台</p><nav><Link href="/about">关于我们</Link><Link href="/privacy">隐私政策</Link><Link href="/terms">用户协议</Link><Link href="/api">服务状态</Link></nav><small>© 2026 灵智 AI</small></footer>}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, Bot, Braces, ChevronDown, CircleGauge, Code2, Headphones, KeyRound, Layers3, ListFilter, Menu, MessageSquareText, Moon, Search, Sparkles, Star, Video, Workflow, X, Zap } from "lucide-react";
import { BrandLogo } from "./brand";
import { platformModels, type ModelKind } from "./data";

function ApiHeader() {
  const [open, setOpen] = useState(false);
  return <header className="api-header"><Link href="/api"><BrandLogo/><span>开放平台</span></Link><nav className={open ? "open" : ""}><Link href="/api">首页</Link><Link href="/account?tab=keys">控制台</Link><Link href="/api/pricing">模型广场</Link><Link href="/api/rankings">模型排行</Link><a href="#docs">文档</a></nav><div><button><Headphones/>在线客服</button><button><Moon/></button><Link href="/home">进入主站</Link><button className="api-mobile-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></header>;
}

export function ApiLanding() {
  return <main className="api-site"><ApiHeader/>
    <section className="api-hero-section"><div className="api-glow"/><div className="api-hero-copy"><span><Sparkles/>人工智能应用基座</span><h1><em>API</em> AI 开放平台</h1><p>一个 Base URL 接入主流模型，兼容 OpenAI / Anthropic / Gemini 协议，覆盖聊天、图片、视频和音频。</p><div><Link href="/account?tab=keys">进入控制台 <ArrowRight/></Link><Link href="/api/pricing">查看模型与价格</Link><a href="#docs"><Braces/>开发文档</a></div></div>
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
  const results=useMemo(()=>platformModels.filter(model=>(kind==="全部"||model.kind===kind)&&(vendor==="全部"||model.vendor===vendor)&&`${model.name}${model.description}${model.tags.join("")}`.toLowerCase().includes(query.toLowerCase())),[query,kind,vendor]);
  return <main className="api-site api-pricing"><ApiHeader/><section className="pricing-hero"><span>本站当前已启用模型，总计 {platformModels.length} 个</span><h1>模型广场</h1><p>探索精选 AI 模型，清晰比较价格、协议与能力。</p><label><Search/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索名称、简介、厂商、协议或标签…"/><button>搜索</button></label></section>
    <section className="pricing-layout"><aside><header><b>筛选</b><button onClick={()=>{setKind("全部");setVendor("全部");setQuery("")}}>重置</button></header><FilterGroup title="模型类型" items={["全部","聊天","图片","视频","音频"]} value={kind} change={value=>setKind(value as "全部"|ModelKind)}/><FilterGroup title="供应商" items={["全部",...new Set(platformModels.map(model=>model.vendor))]} value={vendor} change={setVendor}/><div className="tag-filter"><b>能力标签</b><div>{["长上下文","联网搜索","多模态","工具调用","文生图","图生视频","有声视频","4K","多语言"].map(tag=><button key={tag}>{tag}</button>)}</div></div></aside><div className="pricing-results"><header><span>找到 <b>{results.length}</b> 个模型</span><button><ListFilter/>综合排序 <ChevronDown/></button></header><div>{results.map(model=><article key={model.id}><header><i className={`model-symbol ${model.tone}`}>{model.symbol}</i><span><h3>{model.name}{model.badge&&<em>{model.badge}</em>}</h3><small>{model.vendor} · {model.kind}</small></span><button><Star/></button></header><p>{model.description}</p><div>{model.tags.map(tag=><span key={tag}>{tag}</span>)}</div><section><span><small>计费方式</small><b>{model.billing}</b></span><span><small>兼容协议</small><b>{model.kind==="聊天"?"OpenAI":"媒体任务"}</b></span></section><footer><button>API 文档</button><Link href="/home">立即体验 <ArrowRight/></Link></footer></article>)}</div></div></section><ApiFooter/></main>;
}

function FilterGroup({title,items,value,change}:{title:string;items:string[];value:string;change:(value:string)=>void}){return <div className="filter-group"><b>{title}<ChevronDown/></b>{items.map(item=><button className={value===item?"active":""} onClick={()=>change(item)} key={item}><span>{item}</span><small>{item==="全部"?platformModels.length:platformModels.filter(model=>model.kind===item||model.vendor===item).length}</small></button>)}</div>}

export function ApiRankings(){const rows=[...platformModels].slice(0,10);return <main className="api-site rankings-page"><ApiHeader/><section className="ranking-hero"><span><BarChart3/>实时数据</span><h1>模型综合排行</h1><p>根据调用成功率、响应速度、用户评分与价格表现综合计算。</p></section><section className="ranking-board"><header><button className="active">综合榜</button><button>对话榜</button><button>图像榜</button><button>视频榜</button><span>每小时更新</span></header>{rows.map((model,index)=><article key={model.id}><em className={index<3?`top-${index+1}`:""}>{index+1}</em><i className={`model-symbol ${model.tone}`}>{model.symbol}</i><span><b>{model.name}</b><small>{model.vendor} · {model.kind}</small></span><div><small>成功率</small><b>{(99.9-index*.13).toFixed(2)}%</b></div><div><small>平均响应</small><b>{(0.8+index*.21).toFixed(2)}s</b></div><div><small>用户评分</small><b>★ {(4.9-index*.04).toFixed(1)}</b></div><Link href="/home">体验</Link></article>)}</section><ApiFooter/></main>}

function ApiFooter(){return <footer className="api-footer"><BrandLogo/><p>企业级 AI 模型聚合与开放平台</p><nav><a href="#">关于我们</a><a href="#">隐私政策</a><a href="#">用户协议</a><a href="#">服务状态</a></nav><small>© 2026 灵智 AI</small></footer>}

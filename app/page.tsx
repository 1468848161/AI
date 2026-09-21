"use client";

import { useMemo, useState } from "react";
import {
  Aperture, ArrowUp, Bell, Bot, Boxes, Check, ChevronDown, CircleDollarSign,
  Code2, Compass, Copy, FileText, Headphones, Image as ImageIcon, KeyRound,
  LayoutGrid, Menu, MessageCircle, MessageSquareText, MoreHorizontal, Paperclip,
  Pin, PinOff, Plus, Search, Send, Settings2, Sparkles, SquarePen, Upload,
  UserRound, UsersRound, Video, WalletCards, WandSparkles, X, Zap,
} from "lucide-react";

type MainView = "models" | "agents" | "inspiration" | "api" | "mine";
type ModelType = "全部" | "聊天" | "图片" | "视频" | "音频" | "我的";
type Modal = "notice" | "recharge" | null;

type Model = {
  id:string; name:string; vendor:string; type:Exclude<ModelType,"全部"|"我的">;
  desc:string; mark:string; tone:string; tags:string[]; price:string; hot?:boolean;
};

const nav = [
  {key:"models" as MainView,label:"大模型",icon:Boxes},
  {key:"agents" as MainView,label:"智能体",icon:Bot},
  {key:"inspiration" as MainView,label:"灵感广场",icon:Compass},
  {key:"api" as MainView,label:"开放 API",icon:Code2},
];
const models:Model[] = [
  {id:"gpt-5",name:"GPT-5",vendor:"OpenAI",type:"聊天",desc:"复杂推理、代码与专业内容创作",mark:"G",tone:"emerald",tags:["推理","联网"],price:"¥0.020/次",hot:true},
  {id:"claude",name:"Claude Sonnet 4.5",vendor:"Anthropic",type:"聊天",desc:"长文理解、写作与文档分析",mark:"C",tone:"amber",tags:["长文本","写作"],price:"¥0.018/次"},
  {id:"gemini",name:"Gemini 2.5 Pro",vendor:"Google",type:"聊天",desc:"原生多模态与超长上下文",mark:"◇",tone:"blue",tags:["多模态","视频"],price:"¥0.015/次"},
  {id:"deepseek",name:"DeepSeek V3",vendor:"DeepSeek",type:"聊天",desc:"中文理解与高性价比推理",mark:"D",tone:"indigo",tags:["中文","推理"],price:"¥0.004/次",hot:true},
  {id:"flux",name:"FLUX 1.1 Pro",vendor:"Black Forest",type:"图片",desc:"高质量写实图像与商业视觉",mark:"F",tone:"pink",tags:["文生图","写实"],price:"¥0.12/张"},
  {id:"midjourney",name:"Midjourney V7",vendor:"Midjourney",type:"图片",desc:"创意插画、海报与艺术设计",mark:"M",tone:"purple",tags:["艺术","海报"],price:"¥0.18/张"},
  {id:"veo",name:"Veo 3",vendor:"Google",type:"视频",desc:"高质量视频与原生音效生成",mark:"V",tone:"blue",tags:["文生视频","音效"],price:"¥1.80/次",hot:true},
  {id:"kling",name:"可灵 2.1",vendor:"Kuaishou",type:"视频",desc:"人物运动与镜头语言控制",mark:"K",tone:"cyan",tags:["图生视频","运镜"],price:"¥0.80/次"},
  {id:"suno",name:"Suno V4.5",vendor:"Suno",type:"音频",desc:"歌曲创作、编曲与人声生成",mark:"S",tone:"orange",tags:["音乐","人声"],price:"¥0.30/首"},
];
const agents = [
  ["AI 视频策划","从创意到脚本、镜头和分镜的一站式策划","视频","🎬"],
  ["漫剧创作工坊","角色、场景、剧情、分镜连续创作","视频","🎭"],
  ["电商视觉大师","商品图、场景图和营销海报批量生成","图片","🛍️"],
  ["公文写作助手","通知、总结、方案与商务文书","文档","📝"],
  ["PPT 方案专家","从大纲到页面文案快速成稿","文档","📊"],
  ["无限创意画布","多模型协作的自由视觉工作区","工具","✨"],
  ["品牌 VI 设计师","Logo、配色和品牌视觉规范","图片","🎨"],
  ["长视频创作","脚本、角色和多镜头一致性生产","视频","🎞️"],
];
const ideas = [
  ["赛博东方城市","未来都市与东方建筑的视觉融合","AI 建筑","12.8k","purple"],
  ["玻璃质感产品海报","高端护肤品商业摄影构图","电商视觉","8.6k","cyan"],
  ["治愈系森林短片","微距镜头下的苔藓精灵世界","AI 视频","7.2k","green"],
  ["复古杂志人物写真","九十年代胶片杂志风格肖像","人物写真","6.9k","orange"],
  ["极简品牌视觉","黑白留白与瑞士排版体系","品牌设计","5.4k","blue"],
  ["国风水墨动画","山水画卷中的云雾与飞鸟","国风创作","9.1k","pink"],
];

function Logo(){return <div className="logo"><i><Sparkles size={18}/></i><b>灵智云</b><em>AI</em></div>}

export default function Home(){
  const [entered,setEntered]=useState(false);
  const [view,setView]=useState<MainView>("models");
  const [type,setType]=useState<ModelType>("全部");
  const [vendor,setVendor]=useState("全部厂商");
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(models[0]);
  const [pinned,setPinned]=useState<string[]>(["gpt-5"]);
  const [history,setHistory]=useState<{role:"user"|"ai";text:string}[]>([]);
  const [prompt,setPrompt]=useState("");
  const [modal,setModal]=useState<Modal>(null);
  const [mobile,setMobile]=useState(false);
  const [amount,setAmount]=useState(100);
  const filtered=useMemo(()=>models.filter(m=>(type==="全部"||type==="我的"&&pinned.includes(m.id)||m.type===type)&&(vendor==="全部厂商"||m.vendor===vendor)&&(m.name+m.vendor+m.desc).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>Number(pinned.includes(b.id))-Number(pinned.includes(a.id))),[type,vendor,query,pinned]);
  function send(){const text=prompt.trim();if(!text)return;setHistory(v=>[...v,{role:"user",text},{role:"ai",text:`已通过 ${selected.name} 接收你的任务。当前为演示模式，配置 New API 后会返回真实生成结果。`}]);setPrompt("")}
  if(!entered)return <Landing onStart={()=>setEntered(true)}/>;
  return <main className="app">
    <aside className={`rail ${mobile?"open":""}`}>
      <div className="rail-head"><Logo/><button onClick={()=>setMobile(false)} aria-label="关闭导航"><X size={19}/></button></div>
      <button className="create" onClick={()=>{setView("models");setHistory([])}}><SquarePen size={18}/>新建创作<kbd>⌘ K</kbd></button>
      <nav>
        <label>创作中心</label>
        {nav.map(n=><button key={n.key} className={view===n.key?"active":""} onClick={()=>{setView(n.key);setMobile(false)}}><n.icon size={19}/>{n.label}{n.key==="agents"&&<em>NEW</em>}</button>)}
        <label>个人空间</label>
        <button className={view==="mine"?"active":""} onClick={()=>setView("mine")}><LayoutGrid size={19}/>我的作品</button>
        <button><FileText size={19}/>生成记录</button>
        <button><WalletCards size={19}/>消费记录</button>
        <button><UsersRound size={19}/>团队账号</button>
      </nav>
      <div className="rail-foot">
        <button onClick={()=>setModal("recharge")}><WalletCards size={17}/><span><b>账户余额</b><small>¥ 128.60</small></span><strong>充值</strong></button>
        <div className="user"><i>陈</i><span><b>陈先生</b><small>团队管理员</small></span><MoreHorizontal size={18}/></div>
      </div>
    </aside>

    <section className="main">
      <header className="topbar">
        <div><button className="hamb" onClick={()=>setMobile(true)}><Menu size={20}/></button><h1>{view==="models"?"大模型":view==="agents"?"智能体":view==="inspiration"?"灵感广场":view==="api"?"开放 API":"我的作品"}</h1></div>
        <div className="top-actions"><button onClick={()=>setModal("notice")} className="notice"><Bell size={18}/><i>3</i></button><button className="invite"><Zap size={16}/>邀请有礼</button><button className="support"><MessageCircle size={16}/>在线客服</button><button onClick={()=>setModal("recharge")} className="recharge">在线充值</button><span className="top-avatar">陈</span></div>
      </header>

      {view==="models"&&<div className="model-layout">
        <section className="catalog">
          <div className="catalog-title"><div><h2>探索大模型</h2><p>聚合全球领先模型，一个工作台完成所有 AI 创作</p></div><span><i/>服务运行正常</span></div>
          <div className="filters">
            <div className="tabs">{(["全部","聊天","图片","视频","音频","我的"] as ModelType[]).map(t=><button className={type===t?"active":""} onClick={()=>setType(t)} key={t}>{t}{t==="我的"&&<small>{pinned.length}</small>}</button>)}</div>
            <div className="filter-actions"><label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索模型"/></label><select value={vendor} onChange={e=>setVendor(e.target.value)}><option>全部厂商</option>{[...new Set(models.map(m=>m.vendor))].map(v=><option key={v}>{v}</option>)}</select></div>
          </div>
          <div className="resultbar"><span>共 {filtered.length} 个模型</span><button><Settings2 size={15}/>模型排序<ChevronDown size={14}/></button></div>
          <div className="model-grid">{filtered.map(m=><article key={m.id} className={selected.id===m.id?"selected":""} onClick={()=>setSelected(m)}>
            <div className="model-top"><i className={m.tone}>{m.mark}</i><div><h3>{m.name}{m.hot&&<em>热门</em>}</h3><small>{m.vendor}</small></div><button onClick={e=>{e.stopPropagation();setPinned(v=>v.includes(m.id)?v.filter(x=>x!==m.id):[...v,m.id])}} aria-label="置顶模型">{pinned.includes(m.id)?<PinOff size={16}/>:<Pin size={16}/>}</button></div>
            <p>{m.desc}</p><div className="tags">{m.tags.map(x=><span key={x}>{x}</span>)}</div><footer><span><Aperture size={14}/>{m.type}</span><b>{m.price}</b><button>立即使用 <ArrowUp size={14}/></button></footer>
          </article>)}</div>
          {filtered.length===0&&<div className="no-result"><Search size={28}/><b>没有找到匹配的模型</b><span>试试调整分类、厂商或搜索关键词</span></div>}
        </section>
        <ChatPanel model={selected} prompt={prompt} setPrompt={setPrompt} history={history} send={send}/>
      </div>}

      {view==="agents"&&<ContentPage title="智能体广场" desc="按任务选择专业智能体，把复杂工作变成简单流程">
        <PageFilters tabs={["全部","图片","视频","文档","工具"]} placeholder="搜索智能体"/>
        <div className="agent-grid">{agents.map((a,i)=><article key={a[0]}><i className={`agent-icon c${i%5}`}>{a[3]}</i><div className="agent-pin"><Pin size={15}/></div><span>{a[2]}</span><h3>{a[0]}</h3><p>{a[1]}</p><footer><small>已有 {(i+2)*1.7}k 人使用</small><button>开始使用 <ArrowUp size={14}/></button></footer></article>)}</div>
      </ContentPage>}

      {view==="inspiration"&&<ContentPage title="灵感广场" desc="发现优秀创作，一键复用提示词开启你的灵感">
        <PageFilters tabs={["推荐","图片","视频","设计","人物","国风"]} placeholder="搜索标题、提示词或标签"/>
        <div className="idea-grid">{ideas.map((x,i)=><article key={x[0]}><div className={`idea-cover ${x[4]}`}><i>{["✦","◈","❋","◎","△","云"][i]}</i><span>{x[2]}</span></div><div><h3>{x[0]}</h3><p>{x[1]}</p><footer><span>灵智创作者</span><b>♡ {x[3]}</b></footer><button>复用创作</button></div></article>)}</div><button className="load-more">加载更多灵感</button>
      </ContentPage>}

      {view==="api"&&<ContentPage title="开放 API" desc="使用统一接口调用多个模型，让你的应用快速获得 AI 能力">
        <div className="api-hero"><div><span><Code2 size={18}/>OpenAI 兼容接口</span><h2>一次接入，调用所有主流模型</h2><p>支持聊天、图像、视频、音频等标准接口，智能路由与额度管理由 New API 提供。</p><div><button><KeyRound size={16}/>创建 API 密钥</button><button><FileText size={16}/>查看开发文档</button></div></div><div className="code"><header><i/><i/><i/><span>快速调用示例</span><button><Copy size={14}/></button></header><pre>{`curl https://api.example.com/v1/chat/completions \\\n  -H "Authorization: Bearer sk-***" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "model": "gpt-5",\n        "messages": [...] }'`}</pre></div></div>
        <div className="api-stats"><div><b>0</b><span>API 密钥</span></div><div><b>0</b><span>今日调用</span></div><div><b>¥ 0.00</b><span>今日消耗</span></div><div><b>99.99%</b><span>服务可用性</span></div></div>
        <div className="key-empty"><KeyRound size={30}/><h3>还没有 API 密钥</h3><p>创建密钥后即可在你的应用中调用模型</p><button><Plus size={16}/>创建第一个密钥</button></div>
      </ContentPage>}

      {view==="mine"&&<ContentPage title="我的作品" desc="集中管理图片、视频、音频与灵感作品">
        <PageFilters tabs={["全部","视频","图片","音频","灵感"]} placeholder="搜索我的作品"/>
        <div className="works-empty"><ImageIcon size={34}/><h3>还没有作品</h3><p>作品默认保留 30 天，重要内容请及时下载</p><button onClick={()=>setView("models")}><Sparkles size={16}/>去创作第一个作品</button></div>
      </ContentPage>}
    </section>

    {modal&&<div className="overlay" onMouseDown={()=>setModal(null)}><div className={`modal ${modal}`} onMouseDown={e=>e.stopPropagation()}><header><div><i>{modal==="notice"?<Bell/>:<WalletCards/>}</i><span><b>{modal==="notice"?"系统公告":"在线充值"}</b><small>{modal==="notice"?"产品更新与服务通知":"充值余额实时到账"}</small></span></div><button onClick={()=>setModal(null)}><X size={19}/></button></header>{modal==="notice"?<div className="notice-list">{["无限画布与多模型协作正式上线","长期记忆功能开放体验","视频生成速度与清晰度优化"].map((x,i)=><button key={x}><i>{i===0?"新":"更"}</i><span><b>{x}</b><small>灵智云产品团队 · 2026-09-{18-i}</small></span><em>{i===0&&"未读"}</em></button>)}</div>:<div className="pay"><div className="paytabs"><button className="active">在线支付</button><button>卡密充值</button></div><label>选择充值金额</label><div className="amounts">{[20,50,100,200,500,1000].map(x=><button className={amount===x?"active":""} onClick={()=>setAmount(x)} key={x}><b>¥ {x}</b><small>到账 {x} 元</small></button>)}</div><label>支付方式</label><div className="paytypes"><button className="active"><i className="wechat">微</i>微信支付<Check size={16}/></button><button><i className="alipay">支</i>支付宝</button></div><button className="confirm">确认充值 ¥ {amount}</button><p>充值即代表同意《充值服务协议》，虚拟余额不支持提现</p></div>}</div></div>}
  </main>
}

const orbitModels = ["GPT-5","Claude","Gemini","DeepSeek","Veo 3","FLUX","可灵","Suno","Qwen","GLM","MJ V7","海螺","Kimi","通义","豆包","Hunyuan"];
const landingAgents = [
  ["01","一键生成漫剧","输入文案或参考图，AI 自动拆分镜头、生成角色、配音、合成视频，全流程一键完成。","▣"],
  ["02","智能长视频创作","多张参考图加文字描述，精准控制画面内容与时长，生成连贯的专业级长视频。","✣"],
  ["03","风格一键切换","赛博朋克、水墨国风、3D 动画、写实电影，海量风格随心切换。","◉"],
  ["04","画面配音自动匹配","智能语音合成与画面节奏匹配，解说版、剧情版自由选择。","♫"],
];
const capabilities = [
  ["智能对话","主流大模型自由切换，多轮推理、代码、写作、翻译一站搞定。",MessageSquareText],
  ["图像创作","多款绘画模型任选，输入文字即刻出图，写实、插画、3D 风格随心切换。",ImageIcon],
  ["视频生成","主流视频模型任选，文字或图片一键生成电影级视频。",Video],
  ["语音合成","多语言、多音色智能配音，从旁白到对白，拥有专业级声音。",Headphones],
];
const inspirationTiles = [
  ["未来城市的雨夜","赛博朋克","电影质感"],["极简产品视觉","商业摄影","品牌设计"],
  ["山海之间的旅人","中国风","唯美意境"],["复古胶片少女","时尚人像","真实感"],
  ["微缩森林世界","奇幻艺术","光影美学"],["机甲角色设定","3D 国漫","CG 质感"],
  ["海岛度假写真","写实摄影","氛围感"],["月球咖啡馆","创意广告","超现实"],
  ["东方庭院","空间设计","建筑美学"],["霓虹舞台","舞台视觉","音乐"],
  ["未来穿搭","AI 换装","潮流"],["水墨飞鸟","国风动画","意境"],
  ["玻璃香水海报","电商视觉","高级感"],["城市纪实","人文摄影","故事感"],
  ["星际旅行日志","科幻概念","叙事"],["纸雕童话世界","绘本","手工质感"],
];

function Landing({onStart}:{onStart:()=>void}){
  return <div className="landing">
    <header className="landing-nav">
      <Logo/>
      <nav><button><MessageCircle size={15}/>客服</button><button><Code2 size={15}/>开发者</button><button className="nav-start" onClick={onStart}>开始使用 <ArrowUp size={15}/></button><button>◎ 中文</button></nav>
    </header>
    <section className="hero">
      <div className="hero-grid"/>
      <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
      <div className="orbit-models">{orbitModels.map((m,i)=><div style={{"--i":i} as React.CSSProperties} key={m}><i>{m.slice(0,1)}</i><span>{m}</span></div>)}</div>
      <div className="hero-side left"><i>M</i><b>多模态全能参考</b><span>文本、图片、视频与音频任意组合</span></div>
      <div className="hero-side right"><i>V</i><b>Veo 3 视频生成</b><span>原生音效与电影级画面表现</span></div>
      <div className="hero-center">
        <label><i/> 新一代 AI 平台</label>
        <h1>让 AI 为你<br/><span>智能创作</span></h1>
        <p>聚合全球领先大模型，智能对话 / 图像创作 / 视频生成 / AI 智能体，<br/>一个平台，释放无限可能</p>
        <div className="hero-actions"><button onClick={onStart}>开始使用 <ArrowUp size={17}/></button><button><MessageCircle size={17}/>商务合作</button></div>
        <button className="newgift">✦ 注册领取新人免费大礼包，AI 绘画 / 视频 / 对话免费开用 <ArrowUp size={14}/></button>
        <div className="hero-stats"><span><b>500+</b><small>AI 模型</small></span><span><b>10K+</b><small>创作者</small></span><span><b>∞</b><small>创造力</small></span></div>
      </div>
    </section>

    <section className="dark-section agent-section">
      <SectionTitle eyebrow="AI AGENTS" line1="不只是工具" line2="是你的创作搭档" desc="从文案到视频、从灵感到成品 —— AI 智能体帮你全流程搞定，效率提升 10 倍。"/>
      <div className="landing-cards agent-cards">{landingAgents.map(a=><article key={a[0]}><span className="num">{a[0]}</span><i>{a[3]}</i><h3>{a[1]}</h3><p>{a[2]}</p><button onClick={onStart}>立即体验 <ArrowUp size={14}/></button></article>)}</div>
    </section>

    <section className="dark-section platform-section">
      <SectionTitle eyebrow="PLATFORM" line1="四大核心能力，" line2="一个平台"/>
      <div className="landing-cards capability-cards">{capabilities.map(([name,desc,Icon])=><article key={name as string}><i><Icon size={20}/></i><h3>{name as string}</h3><p>{desc as string}</p></article>)}</div>
    </section>

    <section className="dark-section inspiration-section">
      <SectionTitle eyebrow="INSPIRATION" line1="灵感广场" desc="看看大家都在用 AI 创作什么"/>
      <div className="masonry">{inspirationTiles.map((x,i)=><article className={`tile tile-${i%6}`} key={x[0]}><div className="tile-art"><i>{["✦","◈","☾","◎","❋","△"][i%6]}</i></div><h3>{x[0]}</h3><div><span>{x[1]}</span><span>{x[2]}</span></div></article>)}</div>
      <button className="more-inspiration" onClick={onStart}>加载更多灵感 <ChevronDown size={15}/></button>
    </section>

    <section className="landing-cta"><div className="cta-grid"/><h2>现在就开始<br/><span>你的 AI 创作之旅</span></h2><p>500+ 顶尖模型 / AI 智能体 / 灵感广场 —— 一站直达</p><div><button onClick={onStart}>立即注册 <ArrowUp size={17}/></button><button><MessageCircle size={17}/>联系客服</button></div></section>
    <footer className="landing-footer"><Logo/><div><span>企业级 AI 接口服务平台</span><a>联系客服</a><a>举报与反馈</a><a>关于我们</a><a>隐私政策</a><a>用户协议</a></div><div className="payments"><i>VISA</i><i>MC</i><i>支付宝</i><i>微信支付</i></div><p>Powered by <a href="https://github.com/QuantumNous/new-api" target="_blank">New API</a></p></footer>
    <button className="float-service"><MessageCircle size={21}/></button>
  </div>
}

function SectionTitle({eyebrow,line1,line2,desc}:{eyebrow:string;line1:string;line2?:string;desc?:string}){
 return <div className="section-title"><label>{eyebrow}</label><h2>{line1}{line2&&<><br/><span>{line2}</span></>}</h2>{desc&&<p>{desc}</p>}</div>
}

function ChatPanel({model,prompt,setPrompt,history,send}:{model:Model;prompt:string;setPrompt:(s:string)=>void;history:{role:"user"|"ai";text:string}[];send:()=>void}){
 return <aside className="chat-panel"><header><div><i className={model.tone}>{model.mark}</i><span><b>{model.name}</b><small>{model.vendor} · {model.type}</small></span></div><button><MoreHorizontal size={18}/></button></header><div className="chat-tools"><button className="active"><WandSparkles size={15}/>综合最优</button><button><Bot size={15}/>长期记忆</button><button><Settings2 size={15}/>高级设置</button></div><div className="conversation">{history.length===0?<div className="chat-empty"><i><MessageSquareText size={30}/></i><h3>与 {model.name} 开始对话</h3><p>输入你的想法，或选择一个常用任务</p>{["撰写营销方案","分析一份文档","帮我优化提示词"].map(x=><button onClick={()=>setPrompt(x)} key={x}>{x}<ArrowUp size={13}/></button>)}</div>:history.map((m,i)=><div className={`bubble ${m.role}`} key={i}><i>{m.role==="ai"?model.mark:"陈"}</i><p>{m.text}</p></div>)}</div><div className="inputbox"><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder={model.type==="聊天"?"输入消息，Enter 发送...":`描述你想生成的${model.type}...`}/><footer><div><button title="上传文件"><Paperclip size={18}/></button><button title="从资产库选择"><Upload size={18}/></button><span>支持文件与素材库</span></div><div><small>预计 {model.price}</small><button className="send" onClick={send}>{model.type==="聊天"?<Send size={17}/>:<Sparkles size={17}/>}</button></div></footer></div><div className="chat-foot">内容由 AI 生成，请注意甄别信息准确性</div></aside>
}

function ContentPage({title,desc,children}:{title:string;desc:string;children:React.ReactNode}){return <div className="page"><div className="page-title"><div><h2>{title}</h2><p>{desc}</p></div><span><i/>服务运行正常</span></div>{children}</div>}
function PageFilters({tabs,placeholder}:{tabs:string[];placeholder:string}){const [active,setActive]=useState(tabs[0]);return <div className="pagefilters"><div>{tabs.map(t=><button className={active===t?"active":""} onClick={()=>setActive(t)} key={t}>{t}</button>)}</div><label><Search size={16}/><input placeholder={placeholder}/></label></div>}

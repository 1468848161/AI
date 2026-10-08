import Link from "next/link";
import { ArrowRight, Bot, Braces, Headphones, Image as ImageIcon, MessageSquareText, Play, Sparkles, Video } from "lucide-react";
import { BrandLogo } from "@/components/platform/brand";
import { inspirationItems, platformAgents, platformModels } from "@/components/platform/data";

const marquee = [...platformModels.slice(0, 11), ...platformModels.slice(0, 8)];

export default function LandingPage() {
  return <main className="landing-page">
    <header className="landing-nav">
      <Link href="/" aria-label="灵智 AI 首页"><BrandLogo/></Link>
      <nav>
        <a href="#agents">AI 智能体</a>
        <a href="#capabilities">平台能力</a>
        <Link href="/api/pricing">模型与价格</Link>
      </nav>
      <div>
        <button className="nav-ghost"><Headphones size={16}/>客服</button>
        <Link className="nav-ghost" href="/api"><Braces size={16}/>API 开放平台</Link>
        <Link className="nav-primary" href="/home">开始使用 <ArrowRight size={16}/></Link>
      </div>
    </header>

    <section className="landing-hero">
      <div className="hero-orbit orbit-a"/>
      <div className="hero-orbit orbit-b"/>
      <div className="model-marquee" aria-hidden="true">{marquee.map((model, index) => <span key={`${model.id}-${index}`}><i className={`model-symbol ${model.tone}`}>{model.symbol}</i>{model.name}</span>)}</div>
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={14}/>新一代 AI 创作与开放平台</span>
        <h1>让 AI 为你<br/><em>释放无限创造力</em></h1>
        <p>聚合全球领先大模型，智能对话、图像创作、视频生成、声音合成和 AI 智能体，一个平台全搞定。</p>
        <div className="hero-actions">
          <Link href="/home">开始免费创作 <ArrowRight size={17}/></Link>
          <a href="#agents"><Play size={15}/>探索智能体</a>
        </div>
        <button className="gift-strip"><span>🎁</span>注册即可领取新人创作额度，AI 绘画 / 视频 / 对话免费开用 <ArrowRight size={15}/></button>
        <div className="hero-stats"><span><b>500+</b>AI 模型</span><span><b>30+</b>模型厂商</span><span><b>99.9%</b>服务可用性</span></div>
      </div>
      <div className="hero-console">
        <header><i/><i/><i/><span>AI 创作工作台</span><em>运行中</em></header>
        <div className="console-model"><i className="model-symbol mint">G</i><span><b>GPT-5</b><small>旗舰级推理模型</small></span><strong>在线</strong></div>
        <div className="console-chat"><p>为新品发布会写一个有电影感的宣传片脚本。</p><div><Sparkles size={15}/><span>正在分析品牌定位、受众与叙事节奏…</span></div></div>
        <div className="console-grid"><span><ImageIcon/>图像创作</span><span><Video/>视频生成</span><span><Bot/>智能体</span></div>
        <footer><span>输入你的创作想法…</span><button><ArrowRight size={16}/></button></footer>
      </div>
    </section>

    <section id="agents" className="landing-section agents-section">
      <div className="section-heading"><span>AI 智能体</span><h2>不只是工具<br/><em>更是你的创作搭档</em></h2><p>从灵感到成品，专业智能体把复杂工作拆成清晰流程。</p></div>
      <div className="landing-agent-grid">{platformAgents.slice(0,4).map((agent,index)=><Link href="/home?menu=agents" key={agent[0]}>
        <em>0{index+1}</em><i>{agent[3]}</i><span>{agent[2]}</span><h3>{agent[0]}</h3><p>{agent[1]}</p><strong>立即体验 <ArrowRight size={14}/></strong>
      </Link>)}</div>
    </section>

    <section id="capabilities" className="landing-section capability-section">
      <div className="section-heading center"><span>平台能力</span><h2>四大核心能力，一个平台</h2></div>
      <div className="capability-grid">
        <article><i><MessageSquareText/></i><h3>智能对话</h3><p>主流模型自由切换，多轮推理、代码、写作与文档分析。</p></article>
        <article><i><ImageIcon/></i><h3>图像创作</h3><p>文生图、图像编辑、多图参考和商业级视觉生产。</p></article>
        <article><i><Video/></i><h3>视频生成</h3><p>文字、首帧、多参考一键生成有声电影级视频。</p></article>
        <article><i><Headphones/></i><h3>声音创作</h3><p>多语言配音、音色复刻、歌曲与背景音乐生成。</p></article>
      </div>
    </section>

    <section className="landing-section inspiration-section">
      <div className="section-heading row"><div><span>灵感广场</span><h2>看看大家都在创造什么</h2></div><Link href="/home?menu=inspiration">进入灵感广场 <ArrowRight size={15}/></Link></div>
      <div className="landing-inspiration">{inspirationItems.slice(0,6).map((item,index)=><article key={item[0]} style={{background:item[2]}}><div className="art-shape">{["✦","人物","AI","未来","FILM","山水"][index]}</div><footer><span><b>{item[0]}</b><small>{item[1]}</small></span><em>♡ {item[3]}</em></footer></article>)}</div>
    </section>

    <section className="landing-cta"><div><Sparkles/><h2>现在就开始你的 AI 创作之旅</h2><p>顶尖模型、专业智能体、灵感广场与开放 API，一站直达。</p><Link href="/home">立即免费使用 <ArrowRight size={17}/></Link></div></section>
    <footer className="landing-footer"><BrandLogo/><span>企业级 AI 模型聚合与创作平台</span><nav><a href="#">关于我们</a><a href="#">隐私政策</a><a href="#">用户协议</a><a href="#">联系客服</a></nav><small>© 2026 灵智 AI</small></footer>
  </main>;
}

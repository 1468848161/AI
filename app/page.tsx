import Link from "next/link";
import {
  ArrowRight, Braces, CheckCircle2, Gift, Globe2, Headphones,
  Image as ImageIcon, MessageSquareText, Play, Sparkles, Video,
} from "lucide-react";
import { BrandLogo } from "@/components/platform/brand";
import { inspirationItems, platformAgents, platformModels } from "@/components/platform/data";

const outerModels = platformModels.slice(0, 12);
const innerModels = platformModels.slice(14, 22);

export default function LandingPage() {
  return <main className="landing-page">
    <header className="landing-nav">
      <Link href="/" aria-label="灵智 AI 首页"><BrandLogo/></Link>
      <nav>
        <a href="#agents">智能体</a>
        <a href="#capabilities">平台能力</a>
        <a href="#inspiration">灵感广场</a>
      </nav>
      <div>
        <button className="nav-ghost"><Headphones size={16}/>客服</button>
        <Link className="nav-ghost" href="/api"><Braces size={16}/>API 开放平台</Link>
        <Link className="nav-primary" href="/home">开始使用 <ArrowRight size={16}/></Link>
        <button className="locale-button"><Globe2 size={15}/>中文</button>
      </div>
    </header>

    <section className="landing-hero">
      <div className="space-grid" aria-hidden="true"/>
      <div className="hero-halo halo-one" aria-hidden="true"/>
      <div className="hero-halo halo-two" aria-hidden="true"/>
      <div className="hero-model-orbit orbit-outer" aria-hidden="true">
        {outerModels.map((model, index) => <span key={model.id} style={{ transform: `rotate(${index * 30}deg) translateX(355px) rotate(${-index * 30}deg)` }}><i className={`model-symbol ${model.tone}`}>{model.symbol}</i><small>{model.name}</small></span>)}
      </div>
      <div className="hero-model-orbit orbit-inner" aria-hidden="true">
        {innerModels.map((model, index) => <span key={model.id} style={{ transform: `rotate(${index * 45}deg) translateX(245px) rotate(${-index * 45}deg)` }}><i className={`model-symbol ${model.tone}`}>{model.symbol}</i></span>)}
      </div>
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={14}/>聚合全球领先 AI 模型</span>
        <h1>让 AI 为你<br/><em>释放无限创造力</em></h1>
        <p>智能对话、图像创作、视频生成、声音合成与专业智能体，<br className="desktop-break"/>从一个想法到完整作品，一个平台全部完成。</p>
        <div className="hero-actions">
          <Link href="/home">开始使用 <ArrowRight size={17}/></Link>
          <a href="#contact"><Play size={15}/>商务合作</a>
        </div>
        <Link className="gift-strip" href="/home"><Gift size={17}/><span><b>新人礼遇</b> 注册即领创作额度，图片 / 视频 / 对话免费体验</span><ArrowRight size={15}/></Link>
        <div className="hero-stats"><span><b>500+</b>AI 模型</span><span><b>40+</b>专业智能体</span><span><b>10K+</b>创作者</span><span><b>∞</b>创造力</span></div>
      </div>
      <div className="scroll-cue"><span/>向下探索</div>
    </section>

    <section id="agents" className="landing-section agents-section">
      <div className="section-heading center"><span>AI 智能体</span><h2>复杂工作，交给一支 AI 团队</h2><p>从需求理解、任务拆解到成品交付，每一步都可查看、可调整。</p></div>
      <div className="landing-agent-grid">{platformAgents.slice(0,4).map((agent,index)=><Link href="/home?menu=agents" key={agent[0]}>
        <em>0{index+1}</em><i>{agent[3]}</i><span>{agent[2]}</span><h3>{agent[0]}</h3><p>{agent[1]}</p><strong>立即体验 <ArrowRight size={14}/></strong>
      </Link>)}</div>
      <Link className="section-more" href="/home?menu=agents">查看全部 {platformAgents.length} 个智能体 <ArrowRight size={15}/></Link>
    </section>

    <section id="capabilities" className="landing-section capability-section">
      <div className="section-heading split"><div><span>平台能力</span><h2>四大核心能力<br/><em>覆盖每一种创作</em></h2></div><p>统一账户、统一资产与统一账单。自由切换模型，不必在多个平台之间搬运工作。</p></div>
      <div className="capability-grid">
        <article><em>01</em><i><MessageSquareText/></i><h3>智能对话</h3><p>主流模型自由切换，多轮推理、代码、写作与文档分析。</p><footer><span>长上下文</span><span>联网</span><span>工具调用</span></footer></article>
        <article><em>02</em><i><ImageIcon/></i><h3>图像创作</h3><p>文生图、图像编辑、多图参考和商业级视觉生产。</p><footer><span>最高 4K</span><span>图像编辑</span></footer></article>
        <article><em>03</em><i><Video/></i><h3>视频生成</h3><p>文字、首尾帧、多参考一键生成有声电影级视频。</p><footer><span>角色一致</span><span>原生音效</span></footer></article>
        <article><em>04</em><i><Headphones/></i><h3>声音创作</h3><p>多语言配音、音色复刻、歌曲与背景音乐生成。</p><footer><span>语音克隆</span><span>AI 作曲</span></footer></article>
      </div>
    </section>

    <section id="inspiration" className="landing-section inspiration-section">
      <div className="section-heading row"><div><span>灵感广场</span><h2>看看大家都在创造什么</h2><p>精选公开作品与提示词模板，一键复用同款创意。</p></div><Link href="/home?menu=inspiration">进入灵感广场 <ArrowRight size={15}/></Link></div>
      <div className="landing-inspiration">{inspirationItems.slice(0,12).map((item,index)=><article key={item[0]} style={{background:item[2],height:item[5]}}><button aria-label="收藏作品">♡</button><div className="art-shape">{index > 2 && ["✦","FILM","山水","GLASS","森","NEON","CITY","VI","CG"][index-3]}</div><footer><span><b>{item[0]}</b><small>{item[1]}</small><i>{item[4].slice(0,2).map(tag=><u key={tag}>{tag}</u>)}</i></span><em>♡ {item[3]}</em></footer></article>)}</div>
      <Link className="section-more" href="/home?menu=inspiration">加载更多灵感 <ArrowRight size={15}/></Link>
    </section>

    <section id="contact" className="landing-cta"><div><Sparkles/><h2>现在就开始你的 AI 创作之旅</h2><p>顶尖模型、专业智能体、灵感广场与开放 API，一站直达。</p><div><span><CheckCircle2/>无需安装</span><span><CheckCircle2/>新人额度</span><span><CheckCircle2/>按量计费</span></div><Link href="/home">立即免费使用 <ArrowRight size={17}/></Link></div></section>
    <footer className="landing-footer"><BrandLogo/><span>企业级 AI 模型聚合与创作平台</span><nav><Link href="/api">开放 API</Link><Link href="/about">关于我们</Link><Link href="/privacy">隐私政策</Link><Link href="/terms">用户协议</Link></nav><small>© 2026 灵智 AI</small></footer>
  </main>;
}

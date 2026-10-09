"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, Bot, Boxes, Braces, Check, ChevronDown, CircleHelp,
  Compass, Copy, Eye, File, FileText, Headphones, Heart, History, Image as ImageIcon,
  KeyRound, Library, ListFilter, LogIn, Maximize2, Menu, MessageCircle,
  MessageSquareText, MoreHorizontal, Pin, PinOff, Play, Plus,
  Search, Send, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Star,
  Trash2, Upload, UserRound, Video, WalletCards, WandSparkles, X, Zap,
} from "lucide-react";
import { BrandLogo, siteThemes, useSiteTheme, type SiteTheme } from "./brand";
import { inspirationItems, platformAgents, platformModels, type AgentGroup, type InspirationItem, type ModelKind, type PlatformAgent, type PlatformModel } from "./data";

type MenuKey = "models" | "agents" | "inspiration";
type ModalKey = "login" | "advanced" | "memory" | "skills" | "assets" | "recharge" | "profile" | "help" | null;
type ChatMessage = { role: "user" | "assistant"; content: string; time: string };

const categories: ("全部" | ModelKind | "我的")[] = ["全部", "聊天", "图片", "视频", "音频", "我的"];
const agentCategories: ("全部" | AgentGroup)[] = ["全部", "图片", "视频", "文档", "工具"];
const inspirationTags = ["仪式感", "明星同人", "园艺", "校园生活", "短视频", "漫剧制作", "旅行指南", "商业美陈", "甜美写真", "原生质感", "科幻艺术", "苏州", "创意合成", "智能仓储", "东方美学", "毕业季", "创意设计", "少女写真", "AI 视频", "未来城市", "黏土风格", "产品特写", "促销海报", "提示词研究", "景观设计", "奇幻艺术", "品牌设计", "蓝色系", "暗黑美学", "线稿风格", "刺绣风格", "生活记录", "写实", "商业广告"];

export default function WorkspaceApp() {
  const [catalogModels, setCatalogModels] = useState<PlatformModel[]>(platformModels);
  const [menu, setMenu] = useState<MenuKey>("models");
  const [category, setCategory] = useState<(typeof categories)[number]>("全部");
  const [agentCategory, setAgentCategory] = useState<(typeof agentCategories)[number]>("全部");
  const [inspirationCategory, setInspirationCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [vendor, setVendor] = useState("全部厂商");
  const [selected, setSelected] = useState<PlatformModel>(platformModels[0]);
  const [selectedAgent, setSelectedAgent] = useState(platformAgents[0]);
  const [pinned, setPinned] = useState<string[]>(["gpt-5", "gemini-2.5-pro"]);
  const [pinnedAgents, setPinnedAgents] = useState<string[]>(["AI 视频策划", "AI 小说工坊"]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<ModalKey>(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [favoriteIdeas, setFavoriteIdeas] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const { theme, changeTheme } = useSiteTheme();

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("menu");
    if (requested === "agents" || requested === "inspiration") setMenu(requested);
    const savedPins = localStorage.getItem("lingzhi-pins");
    if (savedPins) {
      try { setPinned(JSON.parse(savedPins)); } catch { /* keep defaults */ }
    }
    const savedAgentPins = localStorage.getItem("lingzhi-agent-pins");
    if (savedAgentPins) {
      try { setPinnedAgents(JSON.parse(savedAgentPins)); } catch { /* keep defaults */ }
    }
    void fetch("/api/models").then(async response => await response.json() as { data?: { id: string; owned_by?: string }[]; demo?: boolean }).then(payload => {
      if (payload.demo || !payload.data?.length) return;
      const tones = ["mint","amber","blue","indigo","violet","cyan","pink","orange","purple","rose","sky","teal"];
      const liveModels = payload.data.map((item,index) => {
        const known = platformModels.find(model => model.id === item.id);
        if (known) return known;
        const id = item.id.toLowerCase();
        const kind: ModelKind = /image|flux|midjourney|imagen|recraft/.test(id) ? "图片" : /video|kling|veo|sora|seedance|vidu/.test(id) ? "视频" : /audio|speech|tts|suno|udio/.test(id) ? "音频" : "聊天";
        return { id:item.id, name:item.id, vendor:item.owned_by || "New API", kind, description:"由 New API 当前渠道提供的可用模型。", billing:"以渠道配置为准", symbol:item.id.slice(0,1).toUpperCase(), tone:tones[index%tones.length], tags:["New API","在线"] } satisfies PlatformModel;
      });
      setCatalogModels(liveModels);
      setSelected(current => liveModels.find(model => model.id === current.id) || liveModels[0]);
    }).catch(() => { /* keep built-in catalog when the gateway is unavailable */ });
  }, []);

  function notify(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2200);
  }

  function togglePin(id: string) {
    setPinned(current => {
      const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      localStorage.setItem("lingzhi-pins", JSON.stringify(next));
      return next;
    });
  }

  function toggleAgentPin(name: string) {
    setPinnedAgents(current => {
      const next = current.includes(name) ? current.filter(item => item !== name) : [...current, name];
      localStorage.setItem("lingzhi-agent-pins", JSON.stringify(next));
      return next;
    });
  }

  const filteredModels = useMemo(() => catalogModels
    .filter(model => category === "全部" || category === "我的" ? category !== "我的" || pinned.includes(model.id) : model.kind === category)
    .filter(model => vendor === "全部厂商" || model.vendor === vendor)
    .filter(model => `${model.name}${model.vendor}${model.description}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id))), [catalogModels, category, vendor, query, pinned]);

  const filteredAgents = useMemo(() => platformAgents
    .filter(agent => agentCategory === "全部" || agent[4] === agentCategory)
    .filter(agent => `${agent[0]}${agent[1]}${agent[2]}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b) => Number(pinnedAgents.includes(b[0])) - Number(pinnedAgents.includes(a[0]))), [agentCategory, pinnedAgents, query]);

  const filteredIdeas = useMemo(() => inspirationItems
    .filter(item => inspirationCategory === "全部" || item[4].includes(inspirationCategory))
    .filter(item => `${item[0]}${item[1]}${item[4].join("")}`.toLowerCase().includes(query.toLowerCase())), [inspirationCategory, query]);

  async function sendPrompt() {
    const content = prompt.trim();
    if (!content || sending) return;
    const now = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content, time: now }];
    setMessages(nextMessages);
    setPrompt("");
    if (selected.kind !== "聊天") {
      setSending(true);
      window.setTimeout(() => {
        setMessages(current => [...current, { role: "assistant", content: `${selected.name} 任务已进入队列。已保存提示词、${attachments.length} 个附件和当前生成参数；部署时配置对应媒体渠道后即可返回真实结果。`, time: now }]);
        setSending(false);
      }, 650);
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selected.id,
          messages: nextMessages.map(message => ({ role: message.role, content: message.content })),
          stream: false,
        }),
      });
      const data = await response.json() as { choices?: { message?: { content?: string } }[]; error?: string };
      if (!response.ok) throw new Error(data.error || `请求失败（${response.status}）`);
      setMessages(current => [...current, { role: "assistant", content: data.choices?.[0]?.message?.content || "模型没有返回文本。", time: now }]);
    } catch (error) {
      setMessages(current => [...current, { role: "assistant", content: `调用失败：${error instanceof Error ? error.message : "未知错误"}`, time: now }]);
    } finally {
      setSending(false);
    }
  }

  function openMenu(next: MenuKey) {
    setMenu(next);
    setQuery("");
    setSidebarOpen(false);
  }

  return <main className="workspace-shell">
    {toast && <div className="platform-toast"><Check size={15}/>{toast}</div>}
    <aside className={`model-sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
      <header className="workspace-brand">
        <Link href="/"><BrandLogo/></Link>
        <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="关闭侧边栏"><X size={18}/></button>
      </header>
      <nav className="workspace-main-nav">
        <button className={menu === "models" ? "active" : ""} onClick={() => openMenu("models")}><Boxes/>大模型</button>
        <button className={menu === "agents" ? "active" : ""} onClick={() => openMenu("agents")}><Bot/>智能体<i>NEW</i></button>
        <button className={menu === "inspiration" ? "active" : ""} onClick={() => openMenu("inspiration")}><Compass/>灵感广场</button>
        <Link href="/api"><Braces/>开放 API</Link>
      </nav>

      {menu === "models" && <>
        <div className="model-category-tabs">{categories.map(item => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}{item === "我的" && <small>{pinned.length}</small>}</button>)}</div>
        <div className="catalog-tools">
          <select value={vendor} onChange={event => setVendor(event.target.value)}><option>全部厂商</option>{[...new Set(catalogModels.map(model => model.vendor))].map(item => <option key={item}>{item}</option>)}</select>
          <label><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索模型或功能…"/></label>
        </div>
        <div className="model-list">{filteredModels.map(model => <article key={model.id} className={selected.id === model.id ? "active" : ""} onClick={() => setSelected(model)}>
          <button className="pin-model" onClick={event => { event.stopPropagation(); togglePin(model.id); }} aria-label="置顶此模型">{pinned.includes(model.id) ? <PinOff/> : <Pin/>}</button>
          <i className={`model-symbol ${model.tone}`}>{model.symbol}</i>
          <div><h3>{model.name}{model.badge && <em>{model.badge}</em>}</h3><span>{model.kind} · {model.vendor}</span><p>{model.description}</p><footer>{model.tags.map(tag => <small key={tag}>{tag}</small>)}</footer></div>
        </article>)}</div>
      </>}

      {menu === "agents" && <>
        <div className="subnav-tabs">{agentCategories.map(item => <button className={agentCategory === item ? "active" : ""} onClick={() => setAgentCategory(item)} key={item}>{item}</button>)}</div>
        <div className="catalog-tools single"><label><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索智能体或功能…"/></label></div>
        <div className="agent-list">{filteredAgents.map((agent, index) => <article key={agent[0]} className={selectedAgent[0] === agent[0] ? "active" : ""} onClick={() => setSelectedAgent(agent)}><button className={pinnedAgents.includes(agent[0]) ? "active" : ""} onClick={event => { event.stopPropagation(); toggleAgentPin(agent[0]); }} aria-label="置顶该智能体">{pinnedAgents.includes(agent[0]) ? <PinOff/> : <Pin/>}</button><i>{agent[3]}</i><div><h3>{agent[0]}{index < 2 && <em>置顶</em>}</h3><span>{agent[2]}</span><p>{agent[1]}</p></div></article>)}</div>
      </>}

      {menu === "inspiration" && <>
        <div className="inspiration-filter"><span><ListFilter size={15}/>分类筛选</span><label><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索作品、标签…"/></label><div>{inspirationTags.map(item => <button className={inspirationCategory === item ? "active" : ""} onClick={() => setInspirationCategory(inspirationCategory === item ? "全部" : item)} key={item}>{item}</button>)}</div></div>
      </>}

      <footer className="sidebar-account">
        {loggedIn ? <button onClick={() => setModal("profile")}><i>灵</i><span><b>演示用户</b><small>余额 ¥128.60</small></span><MoreHorizontal/></button> : <button onClick={() => setModal("login")}><LogIn/><span><b>登录 / 注册</b><small>登录后同步创作记录</small></span><ArrowRight/></button>}
      </footer>
    </aside>

    <section className={`creator-stage menu-${menu}`}>
      <header className="creator-topbar">
        <div><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu/></button><button className="new-creation" onClick={() => { setMessages([]); setPrompt(""); }}><Plus/>{menu === "agents" ? "新建项目" : "新建对话"}</button><button onClick={() => setHistoryOpen(!historyOpen)}><History/>对话历史</button></div>
        {menu === "models" && <button className="current-model-pill"><i className={`model-symbol ${selected.tone}`}>{selected.symbol}</i>{selected.name}<ChevronDown/></button>}
        <div><button onClick={() => setModal("help")}><CircleHelp/><span>玩法说明</span></button><button onClick={() => setModal("recharge")} className="gold-action"><Zap/><span>充值</span></button><button onClick={() => setModal("login")} className="login-action"><LogIn/><span>登录</span></button><button onClick={() => setModal("profile")} className="app-grid-action"><Boxes/></button></div>
      </header>

      {menu === "models" && <CreatorWorkspace model={selected} messages={messages} sending={sending} onSelectSuggestion={setPrompt}/>}
      {menu === "agents" && <AgentWorkspace
        agent={selectedAgent}
        onStart={(text) => { setPrompt(text); setMenu("models"); setSelected(catalogModels.find(model => model.kind === "聊天") || catalogModels[0]); }}
      />}
      {menu === "inspiration" && <InspirationWorkspace
        items={filteredIdeas}
        favorites={favoriteIdeas}
        onFavorite={(title) => setFavoriteIdeas(items => items.includes(title) ? items.filter(item => item !== title) : [...items, title])}
        onReuse={(text) => { setPrompt(text); setMenu("models"); setSelected(catalogModels.find(model => model.kind === "图片") || catalogModels[0]); }}
      />}

      {menu === "models" && <section className="composer-dock">
        <header><button onClick={() => notify("模型文档已打开")}><i className={`model-symbol ${selected.tone}`}>{selected.symbol}</i><span><b>{selected.name}</b><small>{selected.description}</small></span><ChevronDown/></button><span>{selected.billing}</span><button onClick={() => notify("已收藏当前模型")}><Star/></button></header>
        {attachments.length > 0 && <div className="attachment-row">{attachments.map(name => <span key={name}><File size={13}/>{name}<button onClick={() => setAttachments(items => items.filter(item => item !== name))}><X size={12}/></button></span>)}</div>}
        <div className="composer-input">
          <input ref={fileInput} type="file" multiple hidden onChange={event => setAttachments(Array.from(event.target.files || []).map(file => file.name))}/>
          <button onClick={() => fileInput.current?.click()} className="add-file"><Plus/><span>附件</span><small>{attachments.length}/10</small></button>
          <textarea value={prompt} onChange={event => setPrompt(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendPrompt(); } }} placeholder={selected.kind === "聊天" ? "描述你的问题，或上传图片、视频和文档…" : `描述你想生成的${selected.kind}，可以添加参考素材…`}/>
          <button className="send-prompt" disabled={!prompt.trim() || sending} onClick={() => void sendPrompt()}>{sending ? <span className="loading-dot"/> : <Send/>}</button>
        </div>
        {selected.kind !== "聊天" && <div className="media-options"><button>16:9 <ChevronDown/></button><button>1080P <ChevronDown/></button>{selected.kind === "视频" && <button>10 秒 <ChevronDown/></button>}<button>标准质量 <ChevronDown/></button></div>}
        <div className="composer-tools">
          <button onClick={() => setModal("assets")}><Library/>从资产库选择</button>
          <button><SlidersHorizontal/>综合最优 <ChevronDown/></button>
          <button onClick={() => setModal("advanced")}><Settings2/>高级设置</button>
          <button onClick={() => setModal("memory")}><Sparkles/>长期记忆</button>
          <button onClick={() => setModal("skills")}><WandSparkles/>技能广场</button>
          <span/>
          <button title="全屏编辑"><Maximize2/></button><button title="清空" onClick={() => setPrompt("")}><Trash2/></button>
        </div>
      </section>}

      <footer className="workspace-floating-actions"><button onClick={() => setModal("help")}><MessageCircle/>商务合作</button>{loggedIn ? <Link href="/account"><UserRound/>账户中心</Link> : <button onClick={() => setModal("login")}><LogIn/>登录</button>}<Link href="/admin"><ShieldCheck/>管理端</Link></footer>
      {historyOpen && <HistoryDrawer messages={messages} onClose={() => setHistoryOpen(false)}/>}
    </section>

    {modal && <WorkspaceModal modal={modal} close={() => setModal(null)} login={() => { setLoggedIn(true); setModal(null); notify("登录成功，欢迎回来"); }} notify={notify} theme={theme} changeTheme={changeTheme}/>}
  </main>;
}

function CreatorWorkspace({ model, messages, sending, onSelectSuggestion }: { model: PlatformModel; messages: ChatMessage[]; sending: boolean; onSelectSuggestion: (value: string) => void }) {
  if (messages.length) return <div className="conversation-stream">{messages.map((message, index) => <article className={message.role} key={`${message.time}-${index}`}><i>{message.role === "user" ? "你" : model.symbol}</i><div><header><b>{message.role === "user" ? "你" : model.name}</b><span>{message.time}</span><button><Copy/></button></header><p>{message.content}</p></div></article>)}{sending && <article className="assistant"><i>{model.symbol}</i><div><header><b>{model.name}</b></header><p className="thinking"><span/><span/><span/></p></div></article>}</div>;
  const suggestions = model.kind === "聊天" ? ["帮我策划一个新产品发布方案", "总结并改写这份文档", "编写一个数据分析脚本"] : model.kind === "图片" ? ["制作高端产品主视觉", "生成电影感人物写真", "设计一张活动海报"] : model.kind === "视频" ? ["生成电影感品牌短片", "让参考图中的人物动起来", "制作产品展示视频"] : ["生成舒缓的背景音乐", "把文案转换成自然配音", "创作一首品牌主题曲"];
  return <div className="empty-workspace">
    <div className="workspace-spark"><Sparkles/></div>
    <span className="selected-kind">{model.kind} · {model.vendor}</span>
    <h1>今天想创造什么？</h1>
    <section className="selected-model-card"><i className={`model-symbol ${model.tone}`}>{model.symbol}</i><span><b>{model.name}</b><small>{model.description}</small></span><em>{model.billing}</em></section>
    <div className="prompt-suggestions">{suggestions.map((text, index) => <button key={text} onClick={() => onSelectSuggestion(text)}><em>0{index + 1}</em><span>{text}</span><ArrowRight/></button>)}</div>
  </div>;
}

function AgentWorkspace({ agent, onStart }: { agent: PlatformAgent; onStart: (prompt: string) => void }) {
  return <div className="agent-studio">
    <aside className="agent-projects"><button><Plus/>新建项目</button><div><FileText/><span><b>创建你的第一个项目</b><small>项目会自动保存全部素材与进度</small></span></div><footer><LayersIcon/>智能引擎</footer></aside>
    <div className="agent-workspace">
      <div className="agent-space-points"/>
      <button className="agent-guide"><Play/>查看详细教程</button>
      <div className="agent-hero-icon">{agent[3]}</div><span>AI 驱动 · {agent[2]}</span><h1>{agent[0]}创作引擎</h1><p>{agent[1]}，从需求到成品的全流程智能化体验。</p>
      <button className="agent-start" onClick={() => onStart(`请使用「${agent[0]}」工作流帮助我完成：`)}><Plus/>开始创建项目</button>
      <div className="agent-engine-flow"><article><i>01</i><b>智能需求分析</b><small>识别目标、素材与交付规格</small></article><article className="active"><i>02</i><b>场景生成器</b><small>自动匹配视觉、内容与模型</small></article><article><i>03</i><b>风格引擎</b><small>统一角色、色彩与叙事风格</small></article><article><i>04</i><b>成品交付</b><small>生成、审校并导出最终作品</small></article></div>
    </div>
  </div>;
}

function LayersIcon(){return <Boxes/>}

function InspirationWorkspace({ items, favorites, onFavorite, onReuse }: { items: InspirationItem[]; favorites: string[]; onFavorite: (title: string) => void; onReuse: (prompt: string) => void }) {
  const [view,setView]=useState<"广场"|"作品"|"收藏"|"记录">("广场");
  const [media,setMedia]=useState<"全部"|"图片"|"视频"|"画布">("全部");
  const displayed=items
    .filter(item=>view!=="收藏"||favorites.includes(item[0]))
    .filter((item,index)=>view!=="作品"||index<6)
    .filter((item,index)=>view!=="记录"||index>Math.max(0,items.length-7))
    .filter(item=>media==="全部"||media==="图片"||media==="视频"&&(item[1].includes("动画")||item[1].includes("视频"))||media==="画布"&&item[4].includes("创意"));
  return <div className="inspiration-workspace"><header><nav>{[["广场","灵感广场"],["作品","我的作品集"],["收藏","我的收藏"],["记录","使用记录"]].map(item=><button className={view===item[0]?"active":""} onClick={()=>setView(item[0] as typeof view)} key={item[0]}>{item[1]}</button>)}</nav><div>{[["全部","全部"],["图片","图片"],["视频","视频"],["画布","无限画布"]].map(item=><button className={media===item[0]?"active":""} onClick={()=>setMedia(item[0] as typeof media)} key={item[0]}>{item[1]}</button>)}</div></header><section className="idea-masonry">{displayed.map((item, index) => <article key={item[0]} style={{ background: item[2], height: item[5] }}><button className={`idea-favorite ${favorites.includes(item[0]) ? "active" : ""}`} aria-label="收藏" onClick={() => onFavorite(item[0])}><Heart/></button><span className="idea-mark">{index > 2 ? ["✦", "人像", "AI", "CITY", "FILM", "山水", "GLASS", "森"][index % 8] : ""}</span><footer><b>{item[0]}</b><div>{item[4].map(tag => <small key={tag}>{tag}</small>)}</div><span><em><Eye/>{item[3]}</em><em><MessageCircle/>0</em></span></footer><button className="idea-reuse" onClick={() => onReuse(`参考「${item[0]}」的构图、色彩与质感，生成：`)}>复用同款</button></article>)}</section>{displayed.length === 0 && <div className="idea-empty"><Compass/>{view==="收藏"?"还没有收藏作品":"没有找到匹配的灵感作品"}</div>}</div>;
}

function HistoryDrawer({ messages, onClose }: { messages: ChatMessage[]; onClose: () => void }) {
  return <aside className="history-drawer"><header><span><History/>对话历史</span><button onClick={onClose}><X/></button></header><button className="new-history"><Plus/>新建对话</button><label><Search/><input placeholder="搜索历史对话"/></label><div>{messages.length ? ["当前创作", "品牌方案与内容规划", "产品视觉提示词优化"].map((item, index) => <button className={index === 0 ? "active" : ""} key={item}><MessageSquareText/><span><b>{item}</b><small>{index === 0 ? "刚刚" : `${index} 天前`}</small></span><MoreHorizontal/></button>) : <p><History/>还没有历史对话</p>}</div></aside>;
}

function WorkspaceModal({ modal, close, login, notify, theme, changeTheme }: { modal: Exclude<ModalKey, null>; close: () => void; login: () => void; notify: (text: string) => void; theme: SiteTheme; changeTheme: (theme: SiteTheme) => void }) {
  return <div className="workspace-overlay" onMouseDown={close}><section className={`workspace-modal modal-${modal}`} onMouseDown={event => event.stopPropagation()}><header><div><i>{modal === "login" ? <LogIn/> : modal === "recharge" ? <WalletCards/> : modal === "assets" ? <Library/> : modal === "skills" ? <WandSparkles/> : modal === "memory" ? <Sparkles/> : modal === "profile" ? <UserRound/> : modal === "help" ? <CircleHelp/> : <Settings2/>}</i><span><b>{{login:"欢迎回来",advanced:"高级设置",memory:"长期记忆",skills:"技能广场",assets:"我的资产库",recharge:"在线充值",profile:"账户与界面",help:"使用帮助"}[modal]}</b><small>{{login:"登录后同步作品、余额和历史记录",advanced:"调整模型参数与输出偏好",memory:"让 AI 记住长期有效的信息",skills:"为模型安装专业能力",assets:"复用已上传和生成的素材",recharge:"充值余额实时到账",profile:"账户信息与多套 UI 切换",help:"快速了解工作台操作"}[modal]}</small></span></div><button onClick={close}><X/></button></header>
    {modal === "login" && <div className="login-modal-body"><BrandLogo/><div className="login-tabs"><button className="active">密码登录</button><button>手机登录</button><button>邮箱登录</button></div><label>账号<input placeholder="请输入手机号或邮箱"/></label><label>密码<input type="password" placeholder="请输入密码"/></label><label className="agreement"><input type="checkbox"/>我已阅读并同意《用户协议》和《隐私政策》</label><button className="modal-primary" onClick={login}>立即登录</button><p>没有账号？使用验证码登录即可自动注册</p></div>}
    {modal === "advanced" && <div className="settings-modal-body"><div><h3>模型参数</h3>{[["温度","0.7"],["最大输出","4,096 tokens"],["上下文","自动"],["随机种子","关闭"]].map(item => <label key={item[0]}><span><b>{item[0]}</b><small>控制模型生成表现</small></span><button>{item[1]}<ChevronDown/></button></label>)}</div><div><h3>输出偏好</h3>{["流式输出","自动联网","保留上下文","失败自动重试"].map((item,index) => <label key={item}><span><b>{item}</b><small>当前会话生效</small></span><button className={index < 2 ? "toggle on" : "toggle"}><i/></button></label>)}</div><button className="modal-primary" onClick={() => { notify("高级设置已保存"); close(); }}>保存设置</button></div>}
    {modal === "memory" && <div className="memory-modal-body"><div><input placeholder="添加一条希望 AI 长期记住的信息…"/><button onClick={() => notify("记忆已添加")}><Plus/>添加</button></div>{["我偏好简洁直接的中文回答", "涉及方案时优先输出可执行步骤", "品牌主色为青蓝色"].map(item => <article key={item}><Sparkles/><span>{item}</span><button><Trash2/></button></article>)}</div>}
    {modal === "skills" && <div className="skills-modal-body"><label><Search/><input placeholder="搜索技能"/></label><div>{[["联网搜索","获取实时网页信息","🌐"],["文档分析","读取 PDF、Word 与表格","📄"],["代码执行","运行代码并分析结果","⌘"],["图像理解","识别并分析上传图片","◉"],["数据图表","生成可视化图表","▥"],["网页总结","提取网页关键信息","✦"]].map((item,index)=><article key={item[0]}><i>{item[2]}</i><span><b>{item[0]}</b><small>{item[1]}</small></span><button className={index<3?"installed":""} onClick={()=>notify(index<3?"技能已停用":"技能已安装")}>{index<3?"已安装":"安装"}</button></article>)}</div></div>}
    {modal === "assets" && <div className="assets-modal-body"><div className="asset-toolbar"><label><Search/><input placeholder="搜索资产名称"/></label><button><Upload/>上传素材</button></div><div className="asset-tabs"><button className="active">全部</button><button>图片</button><button>视频</button><button>文档</button></div><div className="asset-cards">{["品牌产品图.png","宣传片参考.mp4","活动方案.docx","人物参考照.jpg","品牌规范.pdf","片头音乐.mp3"].map((item,index)=><article key={item}><i>{index===1?<Video/>:index===2||index===4?<FileText/>:index===5?<Headphones/>:<ImageIcon/>}</i><span><b>{item}</b><small>{index%2?"昨天":"今天"}上传</small></span><button onClick={()=>{notify(`${item} 已添加`);close();}}>选择</button></article>)}</div></div>}
    {modal === "recharge" && <div className="recharge-modal-body"><div className="balance-line"><span>当前余额<small>账户可用额度</small></span><b>¥128.60</b></div><label>选择充值金额</label><div className="amount-grid">{[20,50,100,200,500,1000].map((item,index)=><button className={index===2?"active":""} key={item}><b>¥{item}</b>{index===4&&<small>赠 ¥20</small>}</button>)}</div><div className="payment-row"><button className="active">微信支付</button><button>支付宝</button><button>卡密充值</button></div><button className="modal-primary" onClick={()=>notify("请选择正式支付商户后启用收款")}>立即支付</button></div>}
    {modal === "profile" && <div className="profile-modal-body"><div className="profile-card"><i>灵</i><span><b>演示用户 <em>专业版</em></b><small>user@example.com · 余额 ¥128.60</small></span><Link href="/account">进入账户中心 <ArrowRight/></Link></div><h3>界面主题</h3><div className="theme-choices">{siteThemes.map(item=><button key={item.id} className={theme===item.id?"active":""} onClick={()=>changeTheme(item.id)}><span>{item.colors.map(color=><i style={{background:color}} key={color}/>)}</span><b>{item.name}</b><small>{item.description}</small>{theme===item.id&&<Check/>}</button>)}</div><div className="profile-links"><Link href="/account"><WalletCards/>余额与账单</Link><Link href="/account?tab=keys"><KeyRound/>API 密钥</Link><Link href="/admin"><ShieldCheck/>运营后台</Link></div></div>}
    {modal === "help" && <div className="help-modal-body">{[["1","选择模型","从左侧按聊天、图片、视频或音频筛选模型"],["2","添加资料","在输入区上传图片、视频、文档或从资产库选择"],["3","调整参数","使用高级设置、长期记忆和技能控制结果"],["4","开始生成","输入需求后发送，任务会自动保存到生成记录"]].map(item=><article key={item[0]}><i>{item[0]}</i><span><b>{item[1]}</b><small>{item[2]}</small></span></article>)}<Link className="modal-primary" href="/account">查看完整用户中心</Link></div>}
  </section></div>;
}

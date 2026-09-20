"use client";

import { useState } from "react";
import {
  ArrowUp, Bot, Check, ChevronDown, CircleDollarSign, Clock3, Code2,
  Crown, FileText, Gift, Grid3X3, Headphones, Image as ImageIcon, Menu,
  MessageSquareText, Mic2, MoreHorizontal, Plus, Search, Settings2,
  ShieldCheck, Sparkles, SquarePen, UsersRound, Video, WandSparkles, X, Zap,
} from "lucide-react";

type ToolKey = "chat" | "image" | "video" | "audio";
const tools = [
  { key:"chat" as ToolKey,label:"AI 对话",desc:"多模型智能问答",icon:MessageSquareText,color:"violet" },
  { key:"image" as ToolKey,label:"AI 绘画",desc:"文字生成精美图片",icon:ImageIcon,color:"cyan" },
  { key:"video" as ToolKey,label:"AI 视频",desc:"灵感转为动态影像",icon:Video,color:"pink" },
  { key:"audio" as ToolKey,label:"AI 音频",desc:"语音合成与音乐",icon:Headphones,color:"orange" },
];
const models = [
  {name:"GPT-5",vendor:"OpenAI",tag:"旗舰",mark:"G",tone:"green"},
  {name:"Claude Sonnet 4.5",vendor:"Anthropic",tag:"长文",mark:"C",tone:"gold"},
  {name:"Gemini 2.5 Pro",vendor:"Google",tag:"多模态",mark:"◇",tone:"blue"},
  {name:"DeepSeek V3",vendor:"DeepSeek",tag:"高性价比",mark:"D",tone:"purple"},
];

function Logo(){return <div className="logo"><i><Sparkles size={17}/></i><b>灵智云</b><em>AI</em></div>}

export default function Home(){
  const [active,setActive]=useState<ToolKey>("chat");
  const [model,setModel]=useState(models[0]);
  const [modelOpen,setModelOpen]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState<{role:string,text:string}[]>([]);
  const current=tools.find(t=>t.key===active)!;
  function send(){const text=input.trim();if(!text)return;setMessages(v=>[...v,{role:"user",text},{role:"ai",text:`这是 ${model.name} 的产品演示回复。配置 New API 服务地址后，这里会返回真实模型结果。`}]);setInput("")}
  return <main className="shell">
    <aside className={`sidebar ${mobile?"open":""}`}>
      <div className="brand"><Logo/><button onClick={()=>setMobile(false)}><X size={18}/></button></div>
      <button className="new"><SquarePen size={17}/>开启新对话<kbd>⌘ K</kbd></button>
      <nav>
        <small>AI 创作</small>
        {tools.map(t=><button key={t.key} className={active===t.key?"active":""} onClick={()=>{setActive(t.key);setMobile(false)}}><t.icon size={18}/>{t.label}{t.key==="chat"&&<em>HOT</em>}</button>)}
        <small>工作空间</small>
        <button><FileText size={18}/>我的创作</button><button><Clock3 size={18}/>生成记录</button>
        <button><Grid3X3 size={18}/>应用广场</button><button><Code2 size={18}/>API 开放平台</button>
      </nav>
      <div className="sidefoot">
        <div className="upgrade"><b><Crown size={15}/>专业版</b><p>解锁更多模型与更高额度</p><button>立即升级 <ArrowUp size={13}/></button></div>
        <div className="user"><i>陈</i><span><b>陈先生</b><small>团队管理员</small></span><MoreHorizontal size={17}/></div>
      </div>
    </aside>
    <section className="workspace">
      <header>
        <div><button className="hamb" onClick={()=>setMobile(true)}><Menu size={19}/></button><span>工作台</span><i>/</i><b>{current.label}</b></div>
        <div className="actions"><button className="search"><Search size={15}/>搜索功能<kbd>⌘ /</kbd></button><button className="square"><Gift size={17}/></button><div className="balance"><CircleDollarSign size={16}/><span>余额</span><b>¥ 128.60</b><button>充值</button></div></div>
      </header>
      <div className="content">
        <section className="welcome"><div><label><Sparkles size={13}/>全新 AI 创作空间</label><h1>你好，陈先生 👋</h1><p>今天想创造些什么？选择一个工具，让灵感即刻发生。</p></div><span><i/>全部服务运行正常</span></section>
        <section className="tools">{tools.map(t=><button key={t.key} onClick={()=>setActive(t.key)} className={`${t.color} ${active===t.key?"selected":""}`}><i><t.icon size={21}/></i><span><b>{t.label}</b><small>{t.desc}</small></span><ArrowUp size={15}/></button>)}</section>
        <section className="studio">
          <div className="studiohead"><div><i className={current.color}><current.icon size={18}/></i><span><b>{current.label}工作台</b><small>{active==="chat"?"与全球领先大模型实时对话":"一站式专业内容生成"}</small></span></div><button><Clock3 size={15}/>历史记录</button></div>
          {active==="chat"?<>
            <div className="modelrow"><label>当前模型</label><div className="modelwrap"><button className="model" onClick={()=>setModelOpen(!modelOpen)}><i className={model.tone}>{model.mark}</i><span><b>{model.name}</b><small>{model.vendor}</small></span><em>{model.tag}</em><ChevronDown size={15}/></button>{modelOpen&&<div className="modelmenu">{models.map(m=><button key={m.name} onClick={()=>{setModel(m);setModelOpen(false)}}><i className={m.tone}>{m.mark}</i><span><b>{m.name}</b><small>{m.vendor}</small></span>{m.name===model.name&&<Check size={15}/>}</button>)}</div>}</div><button className="settings"><Settings2 size={16}/>参数设置</button></div>
            <div className="chatbody">{messages.length===0?<div className="empty"><i><Bot size={29}/></i><h3>开始你的第一次对话</h3><p>描述你的需求，AI 会为你提供专业、准确的回答</p><div>{["帮我写一份新品发布方案","分析这份数据并给出结论","将内容改成商务语气"].map(x=><button key={x} onClick={()=>setInput(x)}>{x}<ArrowUp size={12}/></button>)}</div></div>:<div className="messages">{messages.map((m,i)=><div key={i} className={m.role}><i>{m.role==="ai"?<Bot size={16}/>:"陈"}</i><p>{m.text}</p></div>)}</div>}</div>
            <div className="composer"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="输入你的问题，Shift + Enter 换行..."/><div><span><button><Plus size={17}/></button><button><Mic2 size={17}/></button><small>支持图片、文档与音频</small></span><span><small>预计消耗 0.02 元</small><button className="send" onClick={send}><ArrowUp size={17}/></button></span></div></div>
          </>:<Generator active={active}/>}
        </section>
        <section className="cards">
          <div><h3><span><Zap size={16}/>本月用量</span><button>查看明细</button></h3><div className="usage"><b>¥ 71.40</b><span>/ ¥ 200.00</span><em>35.7%</em></div><div className="progress"><i/></div><div className="stats"><span><b>1,286</b><small>调用次数</small></span><span><b>4.8M</b><small>消耗 Tokens</small></span><span><b>18</b><small>生成作品</small></span></div></div>
          <div><h3><span><UsersRound size={16}/>团队空间</span><button>管理成员</button></h3><div className="team"><span><i>陈</i><i>林</i><i>王</i><i>+5</i></span><b>灵智创意团队<small>8 位成员 · 企业版</small></b><ShieldCheck size={20}/></div><div className="seat"><span>席位使用</span><b>8 / 15</b></div><div className="progress teamprogress"><i/></div></div>
        </section>
      </div>
      <footer><span>© 2026 灵智云 AI</span><span>服务协议 · 隐私政策 · <a href="https://github.com/QuantumNous/new-api" target="_blank">Powered by New API</a></span></footer>
    </section>
  </main>
}

function Generator({active}:{active:ToolKey}){
 const data=active==="image"?["描述你想生成的画面","例如：雨后的未来城市，电影感光影，超广角镜头...","立即生成图片"]:active==="video"?["描述你想生成的视频","例如：镜头穿过云层，展示未来城市的清晨...","立即生成视频"]:["输入要合成的文字","输入旁白、广告语或需要转为语音的内容...","立即生成音频"];
 const Icon=active==="image"?ImageIcon:active==="video"?Video:Headphones;
 return <div className="generator"><div className="genform"><label>{data[0]}</label><textarea placeholder={data[1]}/><div className="enhance"><button><WandSparkles size={14}/>智能增强提示词</button><span>0 / 1000</span></div><div className="options"><label><span>生成模型</span><button>旗舰创作模型<ChevronDown size={14}/></button></label><label><span>{active==="audio"?"声音风格":"画面比例"}</span><button>{active==="audio"?"自然女声":"16 : 9"}<ChevronDown size={14}/></button></label></div><button className="generate"><Sparkles size={16}/>{data[2]}<small>预计 ¥0.20</small></button></div><div className="preview"><i><Icon/></i><b>作品将在这里呈现</b><small>填写左侧内容并开始生成</small></div></div>
}

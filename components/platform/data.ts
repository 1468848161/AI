export type ModelKind = "聊天" | "图片" | "视频" | "音频";

export type PlatformModel = {
  id: string;
  name: string;
  vendor: string;
  kind: ModelKind;
  description: string;
  billing: string;
  badge?: string;
  symbol: string;
  tone: string;
  tags: string[];
};

export type AgentGroup = "图片" | "视频" | "文档" | "工具";
export type PlatformAgent = readonly [name: string, description: string, badge: string, icon: string, group: AgentGroup];
export type InspirationItem = readonly [title: string, subtitle: string, background: string, likes: string, tags: readonly string[], height: number];

export const platformModels: PlatformModel[] = [
  { id: "gpt-5", name: "GPT-5", vendor: "OpenAI", kind: "聊天", description: "旗舰级推理、代码与专业内容创作模型。", billing: "按 Token 计费", badge: "热门", symbol: "G", tone: "mint", tags: ["深度推理", "工具调用"] },
  { id: "gpt-5-mini", name: "GPT-5 mini", vendor: "OpenAI", kind: "聊天", description: "低延迟通用模型，适合高并发与智能体执行。", billing: "按 Token 计费", symbol: "G", tone: "cyan", tags: ["极速", "高性价比"] },
  { id: "claude-opus-4", name: "Claude Opus 4", vendor: "Anthropic", kind: "聊天", description: "复杂推理、长任务与专业研究场景。", billing: "按 Token 计费", badge: "旗舰", symbol: "C", tone: "orange", tags: ["长任务", "推理"] },
  { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", vendor: "Anthropic", kind: "聊天", description: "长文档理解、写作与复杂工作流处理。", billing: "按 Token 计费", symbol: "C", tone: "amber", tags: ["长上下文", "文档"] },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", vendor: "Google", kind: "聊天", description: "原生多模态与超长上下文，适合综合任务。", billing: "按 Token 计费", badge: "推荐", symbol: "◇", tone: "blue", tags: ["多模态", "联网"] },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", vendor: "Google", kind: "聊天", description: "兼顾速度与质量的多模态轻量模型。", billing: "按 Token 计费", symbol: "◇", tone: "sky", tags: ["极速", "多模态"] },
  { id: "deepseek-chat", name: "DeepSeek V3", vendor: "DeepSeek", kind: "聊天", description: "中文理解、逻辑分析与高性价比对话。", billing: "按 Token 计费", symbol: "D", tone: "indigo", tags: ["中文", "高性价比"] },
  { id: "deepseek-reasoner", name: "DeepSeek R1", vendor: "DeepSeek", kind: "聊天", description: "数学、代码与复杂问题的深度思考模型。", billing: "按 Token 计费", symbol: "R", tone: "blue", tags: ["深度思考", "代码"] },
  { id: "qwen-max", name: "Qwen Max", vendor: "阿里云", kind: "聊天", description: "企业知识问答、中文写作与智能体执行。", billing: "按 Token 计费", symbol: "Q", tone: "violet", tags: ["企业", "智能体"] },
  { id: "qwen-plus", name: "Qwen Plus", vendor: "阿里云", kind: "聊天", description: "中文通用任务与长上下文的均衡选择。", billing: "按 Token 计费", symbol: "Q", tone: "purple", tags: ["长上下文", "中文"] },
  { id: "glm-4.5", name: "GLM 4.5", vendor: "智谱 AI", kind: "聊天", description: "快速稳定的中文通用与代码模型。", billing: "按 Token 计费", symbol: "Z", tone: "cyan", tags: ["快速", "代码"] },
  { id: "kimi-k2", name: "Kimi K2", vendor: "月之暗面", kind: "聊天", description: "长上下文阅读、联网研究与智能体任务。", billing: "按 Token 计费", symbol: "K", tone: "sky", tags: ["长上下文", "联网"] },
  { id: "doubao-seed-1-6", name: "豆包 Seed 1.6", vendor: "字节跳动", kind: "聊天", description: "多模态理解、中文创作与视觉问答。", billing: "按 Token 计费", symbol: "豆", tone: "rose", tags: ["多模态", "中文"] },
  { id: "llama-4-maverick", name: "Llama 4 Maverick", vendor: "Meta", kind: "聊天", description: "开放权重生态中的多模态通用模型。", billing: "按 Token 计费", symbol: "L", tone: "indigo", tags: ["开源生态", "多模态"] },
  { id: "gpt-image-1", name: "GPT Image 1", vendor: "OpenAI", kind: "图片", description: "文字渲染、商业海报与多轮图像编辑。", billing: "按张计费", badge: "热门", symbol: "I", tone: "pink", tags: ["文生图", "图像编辑"] },
  { id: "flux-1.1-pro", name: "FLUX 1.1 Pro", vendor: "Black Forest", kind: "图片", description: "高质感写实摄影与产品视觉生成。", billing: "按张计费", symbol: "F", tone: "orange", tags: ["写实", "商用"] },
  { id: "midjourney-v7", name: "Midjourney V7", vendor: "Midjourney", kind: "图片", description: "艺术创意、插画与品牌视觉设计。", billing: "按张计费", symbol: "M", tone: "purple", tags: ["艺术", "海报"] },
  { id: "imagen-4", name: "Imagen 4", vendor: "Google", kind: "图片", description: "高保真摄影、文字排版与多比例输出。", billing: "按张计费", symbol: "◇", tone: "blue", tags: ["高清", "文字渲染"] },
  { id: "qwen-image", name: "Qwen Image", vendor: "阿里云", kind: "图片", description: "中文提示词、海报文字与局部编辑。", billing: "按张计费", symbol: "Q", tone: "violet", tags: ["中文文字", "图生图"] },
  { id: "jimeng-image", name: "即梦图片 3.0", vendor: "字节跳动", kind: "图片", description: "国风、电商和人像场景的稳定图片生成。", billing: "按张计费", symbol: "J", tone: "rose", tags: ["人像", "电商"] },
  { id: "recraft-v3", name: "Recraft V3", vendor: "Recraft", kind: "图片", description: "品牌图形、矢量插画和视觉设计模型。", billing: "按张计费", symbol: "R", tone: "teal", tags: ["矢量", "品牌设计"] },
  { id: "seedance-2", name: "Seedance 2", vendor: "字节跳动", kind: "视频", description: "文生、首尾帧和多参考统一视频生成。", billing: "按秒计费", badge: "热门", symbol: "S", tone: "rose", tags: ["有声视频", "多参考"] },
  { id: "kling-v2.1", name: "可灵 2.1", vendor: "快手", kind: "视频", description: "人物运动、镜头语言和图生视频控制。", billing: "按次计费", symbol: "K", tone: "sky", tags: ["图生视频", "运镜"] },
  { id: "veo-3", name: "Veo 3", vendor: "Google", kind: "视频", description: "电影级画面、物理真实感和原生音效。", billing: "按次计费", symbol: "V", tone: "blue", tags: ["电影感", "音效"] },
  { id: "minimax-video-01", name: "海螺 Hailuo", vendor: "MiniMax", kind: "视频", description: "高性价比的文生视频与首帧生成。", billing: "按秒计费", symbol: "H", tone: "teal", tags: ["首帧", "快速"] },
  { id: "vidu-q1", name: "Vidu Q1", vendor: "Vidu", kind: "视频", description: "多主体参考、一致性角色与镜头控制。", billing: "按次计费", symbol: "V", tone: "violet", tags: ["参考生", "角色一致"] },
  { id: "pixverse-v4", name: "PixVerse V4", vendor: "PixVerse", kind: "视频", description: "特效模板、短视频与社交内容生成。", billing: "按次计费", symbol: "P", tone: "pink", tags: ["模板", "短视频"] },
  { id: "wan2.2-video", name: "通义万相 2.2", vendor: "阿里云", kind: "视频", description: "多镜头叙事与商业视频生成。", billing: "按秒计费", symbol: "W", tone: "purple", tags: ["多镜头", "商业"] },
  { id: "suno-v4.5", name: "Suno V4.5", vendor: "Suno", kind: "音频", description: "歌词、编曲、人声与完整歌曲一键生成。", billing: "按首计费", badge: "音乐", symbol: "♪", tone: "amber", tags: ["音乐", "人声"] },
  { id: "minimax-speech", name: "海螺语音 2.8", vendor: "MiniMax", kind: "音频", description: "多情感、多音色和专业级语音克隆。", billing: "按字符计费", symbol: "声", tone: "pink", tags: ["语音克隆", "多情感"] },
  { id: "tts-1-hd", name: "自然语音 HD", vendor: "OpenAI", kind: "音频", description: "多语言自然配音与旁白合成。", billing: "按字符计费", symbol: "A", tone: "mint", tags: ["配音", "多语言"] },
  { id: "eleven-multilingual", name: "Eleven Multilingual", vendor: "ElevenLabs", kind: "音频", description: "多语言角色声音与影视级旁白。", billing: "按字符计费", symbol: "E", tone: "indigo", tags: ["多语言", "角色音色"] },
  { id: "udio-v1.5", name: "Udio 1.5", vendor: "Udio", kind: "音频", description: "完整歌曲、纯音乐与风格化编曲。", billing: "按首计费", symbol: "U", tone: "orange", tags: ["作曲", "纯音乐"] },
];

export const platformAgents: PlatformAgent[] = [
  ["AI 视频策划", "宣传片、TVC、纪录片和短剧，从创意到执行清单一次完成", "策划", "🎬", "视频"],
  ["AI 股市研报", "财报解读、行业分析与持仓复盘，只输出有依据的研究框架", "研报", "📈", "文档"],
  ["AI 小说工坊", "一句话创意生成大纲、正文、人物设定与审校稿", "小说", "📚", "文档"],
  ["AI 剧本工坊", "小说改编、短剧、电影与广播剧分集脚本", "剧本", "🎭", "文档"],
  ["AI 公文写作", "讲话稿、总结、述职、调研报告与汇报材料", "公文", "🗂️", "文档"],
  ["AI 商务文书", "投标书、商业计划书、申报书与可研报告", "文书", "💼", "文档"],
  ["AI 教师备课", "教案、说课稿、单元设计、课件大纲与试卷命题", "备课", "🧑‍🏫", "文档"],
  ["AI 志愿参谋", "志愿规则梳理、院校定位与风险分层建议", "志愿", "🎓", "文档"],
  ["故事转视频", "长文本自动拆分镜头、角色、台词、配音与视频", "视频", "🎞️", "视频"],
  ["音乐 MV", "读取歌曲主题与歌词，自动完成画面规划和剪辑脚本", "视频", "🎵", "视频"],
  ["数字人口播", "创建专属形象和声音，批量生成口播与带货视频", "视频", "🧑‍💻", "视频"],
  ["电商生视频 S2", "商品分析、分镜策划、参考图与批量短视频协作生成", "视频", "🛒", "视频"],
  ["电商生图 S2", "上传商品图，自动完成卖点分析、场景策划与套图", "图片", "🛍️", "图片"],
  ["小红书爆款笔记", "从素材到封面、图组、标题和正文的一站式内容团队", "图片", "📕", "图片"],
  ["公众号图文工坊", "选题、封面、配图、长文与发布排版完整交付", "图片", "📰", "图片"],
  ["通用生图 S2", "上传参考或描述需求，生成完整视觉方案和批量图片", "图片", "✨", "图片"],
  ["AI 写真馆", "人物写真、职业照、证件照与多人合影创作", "图片", "📷", "图片"],
  ["品牌 VI 工厂", "从品牌名到 Logo、包装、门头和完整视觉体系", "图片", "🎨", "图片"],
  ["AI 海报工厂", "活动信息自动变成全渠道营销海报套图", "图片", "🖼️", "图片"],
  ["AI 绘本工坊", "故事创意、角色设定、分镜与整本绘本连续生成", "图片", "📖", "图片"],
  ["AI 包装设计", "产品洞察、包装提案、版式与落地效果图", "图片", "📦", "图片"],
  ["婚礼视觉全家桶", "婚纱写真、请柬、迎宾牌与婚礼海报成套生成", "图片", "💍", "图片"],
  ["AI 教培视觉", "课程封面、知识卡片、招生海报与课件插图", "图片", "🏫", "图片"],
  ["AI 家装设计", "根据户型和现场照片生成多风格装修效果图", "图片", "🏠", "图片"],
  ["AI 萌宠工作室", "宠物写真、拟人海报与创意场景套图", "图片", "🐾", "图片"],
  ["AI 试衣间", "服装平铺图、模特照和指定人物一键试穿", "图片", "👗", "图片"],
  ["AI 餐饮视觉", "菜品精修、菜单海报与门店营销视觉", "图片", "🍜", "图片"],
  ["无限画布 S2", "自由排布图文视频节点，串联模型完成复杂创作", "工具", "◫", "工具"],
  ["多模型协作", "多个模型并行作答，再由主模型汇总最佳结果", "工具", "🧠", "工具"],
  ["AI Chat", "多窗口长会话、模型切换、技能与工具调用", "工具", "💬", "工具"],
  ["代码助手", "代码仓库理解、方案规划、生成、测试与审查", "工具", "⌘", "工具"],
  ["办公助手", "表格、文档、会议纪要与日常办公自动化", "工具", "🧰", "工具"],
  ["一键生 PPT", "输入主题与资料，生成大纲、页面文案和视觉方向", "PPT", "📊", "文档"],
  ["电商一键生视频", "商品图自动转分镜脚本与多版本短视频", "视频", "🛍️", "视频"],
  ["电商一键生图", "商品信息补全、方案推荐与批量主图生成", "图片", "🧴", "图片"],
  ["OpenClaw 工作台", "可扩展的本地模型与工具协作控制台", "工具", "🦾", "工具"],
  ["AI 漫剧 S2", "参考图、角色一致、剧情分镜和有声视频一键生成", "视频", "🌌", "视频"],
  ["AI 漫剧剧情版", "剧情文本直出角色、台词、动作与连贯分镜", "视频", "🎥", "视频"],
  ["AI 漫剧解说版", "自动生成解说文案、画面、配音与成片节奏", "视频", "🎙️", "视频"],
  ["智能多帧", "多参考图加提示词生成指定时长的连续视频", "视频", "🎞", "视频"],
];

export const inspirationItems: InspirationItem[] = [
  ["极光银翼时尚大片", "虚拟人像 · 未来时尚", "url('/showcase/aurora-portrait.webp') center/cover", "12.8k", ["人像摄影", "未来感", "银色美学"], 330],
  ["极光科技产品海报", "产品摄影 · 商业广告", "url('/showcase/crystal-product.webp') center/cover", "8.9k", ["产品海报", "玻璃材质", "科技感"], 235],
  ["云海之上的未来城", "概念设计 · 科幻建筑", "url('/showcase/cloud-city.webp') center/cover", "8.2k", ["未来城市", "建筑", "电影感"], 295],
  ["旷野电影感人像", "时尚人像 · 自然光影", "linear-gradient(155deg,#122126,#456f60 54%,#d4af7e)", "9.6k", ["人像摄影", "原生质感", "自然光"], 270],
  ["复古杂志封面", "人物肖像 · 胶片质感", "linear-gradient(145deg,#382017,#9b6245 55%,#efd09f)", "7.5k", ["杂志", "复古", "排版"], 355],
  ["水墨山河动画", "国风动漫 · 运镜", "linear-gradient(155deg,#101b18,#4e6e5b 52%,#dbe3d6)", "10.1k", ["东方美学", "水墨", "国风"], 240],
  ["透明玻璃护肤品", "电商主图 · 材质光影", "url('/showcase/crystal-product.webp') 30% center/cover", "6.8k", ["电商", "护肤品", "质感"], 320],
  ["森林里的微缩世界", "治愈插画 · 故事感", "linear-gradient(145deg,#102318,#4d7948 50%,#d1bd72)", "9.2k", ["微缩世界", "治愈", "场景"], 260],
  ["紫夜城市肖像", "霓虹人像 · 潮流", "url('/showcase/aurora-portrait.webp') 70% center/cover", "5.7k", ["霓虹", "都市", "写真"], 250],
  ["山巅空间站", "建筑概念 · 云海", "url('/showcase/cloud-city.webp') 62% center/cover", "6.4k", ["建筑", "科幻", "云海"], 350],
  ["新中式茶饮包装", "品牌设计 · 包装", "linear-gradient(135deg,#29180f,#9c6439 48%,#e7c58c)", "4.9k", ["新中式", "包装设计", "品牌"], 225],
  ["机械昆虫设定集", "角色设定 · 结构透视", "linear-gradient(145deg,#111418,#49505b 54%,#af8d5f)", "7.1k", ["三视图", "机械", "CG"], 310],
  ["夏日海边写真", "生活感 · 日落余晖", "linear-gradient(165deg,#4382a2,#efb06e 58%,#f4d6b6)", "11.2k", ["写真", "海边", "日落"], 365],
  ["黏土风咖啡店", "定格动画 · 可爱", "linear-gradient(145deg,#6f4c34,#d59d6f 55%,#f2d8b8)", "3.8k", ["黏土", "定格动画", "治愈"], 245],
  ["赛博机甲角色", "游戏概念 · 设定", "linear-gradient(145deg,#171522,#493773 52%,#27a7bd)", "8.4k", ["机甲", "角色设定", "赛博朋克"], 330],
  ["东方庭院空间", "室内设计 · 禅意", "linear-gradient(145deg,#d8d2c6,#8c9680 55%,#34443b)", "5.2k", ["室内设计", "东方美学", "写实"], 270],
  ["奢华珠宝特写", "商业广告 · 微距", "linear-gradient(145deg,#0b0c10,#293249 55%,#d6a85d)", "6.9k", ["珠宝", "商业广告", "微距"], 300],
  ["奇幻森林守护者", "角色插画 · 电影感", "linear-gradient(145deg,#0c251b,#2f6c4d 50%,#9bc085)", "9.9k", ["奇幻", "角色", "电影感"], 350],
];

export const adminMenu = [
  ["dashboard", "运营概览"], ["tenants", "租户管理"], ["users", "用户管理"],
  ["channels", "模型渠道"], ["models", "模型管理"], ["plans", "套餐与计费"],
  ["orders", "订单管理"], ["billing", "资金流水"], ["tasks", "生成任务"],
  ["content", "内容审核"], ["tickets", "工单客服"], ["risk", "风控中心"],
  ["roles", "角色权限"], ["themes", "UI 主题"], ["settings", "系统设置"],
] as const;

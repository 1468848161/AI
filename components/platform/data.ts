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

export const platformModels: PlatformModel[] = [
  { id: "gpt-5", name: "GPT-5", vendor: "OpenAI", kind: "聊天", description: "旗舰级推理、代码与专业内容创作模型。", billing: "按 Token 计费", badge: "热门", symbol: "G", tone: "mint", tags: ["深度推理", "工具调用"] },
  { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", vendor: "Anthropic", kind: "聊天", description: "长文档理解、写作与复杂工作流处理。", billing: "按 Token 计费", symbol: "C", tone: "amber", tags: ["长上下文", "文档"] },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", vendor: "Google", kind: "聊天", description: "原生多模态与超长上下文，适合综合任务。", billing: "按 Token 计费", badge: "推荐", symbol: "◇", tone: "blue", tags: ["多模态", "联网"] },
  { id: "deepseek-chat", name: "DeepSeek V3", vendor: "DeepSeek", kind: "聊天", description: "中文理解、逻辑分析与高性价比对话。", billing: "按 Token 计费", symbol: "D", tone: "indigo", tags: ["中文", "高性价比"] },
  { id: "qwen-max", name: "Qwen Max", vendor: "阿里云", kind: "聊天", description: "企业知识问答、中文写作与智能体执行。", billing: "按 Token 计费", symbol: "Q", tone: "violet", tags: ["企业", "智能体"] },
  { id: "glm-4.5", name: "GLM 4.5", vendor: "智谱 AI", kind: "聊天", description: "快速稳定的中文通用与代码模型。", billing: "按 Token 计费", symbol: "Z", tone: "cyan", tags: ["快速", "代码"] },
  { id: "gpt-image-1", name: "GPT Image 1", vendor: "OpenAI", kind: "图片", description: "文字渲染、商业海报与多轮图像编辑。", billing: "按张计费", badge: "NEW", symbol: "I", tone: "pink", tags: ["文生图", "图像编辑"] },
  { id: "flux-1.1-pro", name: "FLUX 1.1 Pro", vendor: "Black Forest", kind: "图片", description: "高质感写实摄影与产品视觉生成。", billing: "按张计费", symbol: "F", tone: "orange", tags: ["写实", "商用"] },
  { id: "midjourney-v7", name: "Midjourney V7", vendor: "Midjourney", kind: "图片", description: "艺术创意、插画与品牌视觉设计。", billing: "按张计费", symbol: "M", tone: "purple", tags: ["艺术", "海报"] },
  { id: "seedance-2", name: "Seedance 2", vendor: "字节跳动", kind: "视频", description: "文生、首尾帧和多参考统一视频生成。", billing: "按秒计费", badge: "热门", symbol: "S", tone: "rose", tags: ["有声视频", "多参考"] },
  { id: "kling-v2.1", name: "可灵 2.1", vendor: "快手", kind: "视频", description: "人物运动、镜头语言和图生视频控制。", billing: "按次计费", symbol: "K", tone: "sky", tags: ["图生视频", "运镜"] },
  { id: "veo-3", name: "Veo 3", vendor: "Google", kind: "视频", description: "电影级画面、物理真实感和原生音效。", billing: "按次计费", symbol: "V", tone: "blue", tags: ["电影感", "音效"] },
  { id: "minimax-video-01", name: "海螺 Hailuo", vendor: "MiniMax", kind: "视频", description: "高性价比的文生视频与首帧生成。", billing: "按秒计费", symbol: "H", tone: "teal", tags: ["首帧", "快速"] },
  { id: "suno-v4.5", name: "Suno V4.5", vendor: "Suno", kind: "音频", description: "歌词、编曲、人声与完整歌曲一键生成。", billing: "按首计费", badge: "音乐", symbol: "♪", tone: "amber", tags: ["音乐", "人声"] },
  { id: "tts-1-hd", name: "自然语音 HD", vendor: "OpenAI", kind: "音频", description: "多语言自然配音与旁白合成。", billing: "按字符计费", symbol: "A", tone: "mint", tags: ["配音", "多语言"] },
];

export const platformAgents = [
  ["AI 视频策划", "宣传片、短剧与账号内容，从创意到分镜全流程策划", "策划", "🎬"],
  ["AI 小说工坊", "一句话创意生成大纲、正文、人物设定与审校稿", "文档", "📚"],
  ["AI 剧本工坊", "小说改编、短剧、电影与广播剧分集脚本", "文档", "🎭"],
  ["AI 公文写作", "讲话稿、总结、述职、调研报告与汇报材料", "文档", "✍️"],
  ["电商视觉工厂", "上传商品图，自动完成策划、场景图与营销套图", "图片", "🛍️"],
  ["AI 写真馆", "人物写真、职业照、证件照与多人合影创作", "图片", "📷"],
  ["品牌 VI 工厂", "从品牌名到 Logo、包装、门头和完整视觉体系", "图片", "🎨"],
  ["故事转视频", "长文本自动拆分镜头、角色、台词、配音与视频", "视频", "🎞️"],
  ["数字人口播", "创建专属形象和声音，批量生成口播与带货视频", "视频", "🧑‍💻"],
  ["AI 漫剧", "参考图、角色一致性、剧情分镜与有声视频一键生成", "视频", "✨"],
  ["多模型协作", "多个模型并行作答，再由主模型汇总最佳结果", "工具", "🧠"],
  ["无限创意画布", "自由排布图文视频，组合多模型完成复杂创作", "工具", "◫"],
];

export const inspirationItems = [
  ["极光银翼时尚大片", "虚拟人像 · 未来时尚", "url('/showcase/aurora-portrait.webp') center/cover", "12.8k"],
  ["旷野电影感人像", "时尚人像 · 自然光影", "linear-gradient(145deg,#1a3038,#527a66 52%,#d3b083)", "9.6k"],
  ["极光科技产品海报", "产品摄影 · 商业广告", "url('/showcase/crystal-product.webp') center/cover", "8.9k"],
  ["云海之上的未来城", "概念设计 · 科幻建筑", "url('/showcase/cloud-city.webp') center/cover", "8.2k"],
  ["复古杂志封面", "人物肖像 · 胶片质感", "linear-gradient(145deg,#392319,#9a6244 55%,#eed0a2)", "7.5k"],
  ["水墨山河动画", "国风动漫 · 运镜", "linear-gradient(145deg,#172420,#526d5c 50%,#dce2d6)", "10.1k"],
  ["透明玻璃护肤品", "电商主图 · 材质光影", "linear-gradient(145deg,#172839,#6aa8bf 52%,#e5f4ef)", "6.8k"],
  ["森林里的微缩世界", "治愈插画 · 故事感", "linear-gradient(145deg,#13291c,#4d7c4b 50%,#d1bd72)", "9.2k"],
];

export const adminMenu = [
  ["dashboard", "运营概览"], ["tenants", "租户管理"], ["users", "用户管理"],
  ["channels", "模型渠道"], ["models", "模型管理"], ["plans", "套餐与计费"],
  ["orders", "订单管理"], ["billing", "资金流水"], ["tasks", "生成任务"],
  ["content", "内容审核"], ["tickets", "工单客服"], ["risk", "风控中心"],
  ["roles", "角色权限"], ["themes", "UI 主题"], ["settings", "系统设置"],
] as const;

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "./brand";

const copy = {
  about: {
    title: "关于我们",
    lead: "我们致力于把复杂的 AI 模型、创作工作流与企业级管理能力，整合为一个简单可靠的平台。",
    sections: [
      ["我们的产品", "平台聚合对话、图片、视频、音频等多类模型，并提供智能体、开放 API、统一资产、账单和团队协作能力。"],
      ["我们的原则", "尊重用户数据与知识产权，坚持清晰计费、模型可选择、调用可追踪和服务可迁移。"],
      ["企业服务", "面向企业客户提供私有化部署、专属渠道、成员权限、额度分配、审计日志和技术支持。"],
    ],
  },
  privacy: {
    title: "隐私政策",
    lead: "本政策说明平台在提供账户、创作与 API 服务时如何处理必要信息。正式运营前请结合主体、地区和业务由法律顾问复核。",
    sections: [
      ["信息收集", "我们可能处理账户资料、登录与安全日志、服务调用记录、用户主动上传的素材，以及完成支付和开票所需的信息。"],
      ["信息使用", "信息用于提供服务、同步记录、计费结算、防止滥用、故障排查和在获得授权时改进产品体验。"],
      ["第三方处理", "当用户选择某个模型或支付方式时，完成服务所需的数据可能发送给相应的模型、存储或支付服务商。"],
      ["安全与保留", "我们通过访问控制、传输加密、日志审计和最小权限保护数据，并按业务和法律要求设置保留期限。"],
      ["用户权利", "用户可申请访问、更正、导出或删除依法可处理的个人信息，也可撤回非必要授权。"],
    ],
  },
  terms: {
    title: "用户协议",
    lead: "使用平台即表示你同意遵守本协议。正式运营时应补充经营主体、联系信息、退款规则和争议解决条款。",
    sections: [
      ["账户与安全", "用户应提供真实有效的信息，妥善保管账号与 API 密钥，并对账户下发生的操作承担相应责任。"],
      ["服务与计费", "不同模型按 Token、次数、时长或任务计费。实际价格、额度和退款规则以购买或调用时页面展示为准。"],
      ["内容规范", "不得利用平台生成、传播违法、有害、侵权或用于欺诈的内容，也不得绕过限流、权限和安全机制。"],
      ["知识产权", "用户保留其合法上传内容的权利；平台软件、界面和文档受相关法律保护。第三方模型适用其各自许可。"],
      ["服务变更", "我们可能因模型供应、合规、安全或维护需要调整服务，并在合理范围内提前或及时通知。"],
    ],
  },
} as const;

export function LegalPage({type}:{type:keyof typeof copy}){
  const page=copy[type];
  return <main className="legal-site"><header><Link href="/"><BrandLogo/></Link><nav><Link href="/about">关于</Link><Link href="/privacy">隐私</Link><Link href="/terms">协议</Link><Link href="/api">开放 API</Link></nav><Link href="/"><ArrowLeft/>返回首页</Link></header><article><span>LEGAL & COMPANY</span><h1>{page.title}</h1><p>{page.lead}</p><small>更新日期：2026 年 10 月 8 日</small><section>{page.sections.map(section=><div key={section[0]}><h2>{section[0]}</h2><p>{section[1]}</p></div>)}</section></article><footer><BrandLogo/><span>© 2026 灵智 AI</span></footer></main>
}

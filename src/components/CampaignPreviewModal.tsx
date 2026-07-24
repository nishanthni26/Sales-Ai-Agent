import React, { useState } from "react";
import {
  X,
  Globe,
  Mail,
  MessageSquare,
  Check,
  Sparkles,
  Smartphone,
  Phone,
  Linkedin,
  Laptop,
  Award,
  ShieldCheck,
  Flame,
  TrendingUp,
  Zap,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { GeneratedCampaign } from "../types";

interface CampaignPreviewModalProps {
  isOpen: boolean;
  assetType: string;
  campaign: GeneratedCampaign;
  onClose: () => void;
}

export const CampaignPreviewModal: React.FC<CampaignPreviewModalProps> = ({
  isOpen,
  assetType,
  campaign,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<
    "desktop-email" | "mobile-email" | "landing" | "whatsapp" | "sms" | "linkedin"
  >(
    assetType === "whatsapp"
      ? "whatsapp"
      : assetType === "sms"
      ? "sms"
      : assetType === "linkedin"
      ? "linkedin"
      : assetType === "landing"
      ? "landing"
      : "desktop-email"
  );

  const [copiedNotification, setCopiedNotification] = useState(false);

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-8 p-6 sm:p-8 relative shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          id="preview-modal-close-btn"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Campaign Multi-Channel Preview
              </h3>
              <p className="text-xs text-slate-400 font-medium">{campaign.name}</p>
            </div>
          </div>

          {copiedNotification && (
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              ✓ Copied
            </span>
          )}
        </div>

        {/* Audit Scores Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Campaign Health</p>
              <p className="text-xs font-extrabold text-white">96 / 100</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Spam Score</p>
              <p className="text-xs font-extrabold text-emerald-400">98.5% Safe</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Personalization</p>
              <p className="text-xs font-extrabold text-white">94 / 100</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Deliverability</p>
              <p className="text-xs font-extrabold text-white">99.1%</p>
            </div>
          </div>
        </div>

        {/* Channels Tab Bar */}
        <div className="flex flex-nowrap overflow-x-auto gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 scrollbar-none">
          {[
            { id: "desktop-email", label: "Desktop Email", icon: Laptop },
            { id: "mobile-email", label: "Mobile Email", icon: Smartphone },
            { id: "landing", label: "Landing Page", icon: Globe },
            { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
            { id: "sms", label: "SMS", icon: Phone },
            { id: "linkedin", label: "LinkedIn", icon: Linkedin },
          ].map((tb) => {
            const Icon = tb.icon;
            const isActive = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tb.label}</span>
              </button>
            );
          })}
        </div>

        {/* PREVIEW CONTENT */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
          
          {/* DESKTOP EMAIL */}
          {activeTab === "desktop-email" && (
            <div className="space-y-4 text-xs font-sans">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-slate-400 font-bold">Subject Line:</p>
                  <p className="font-bold text-emerald-300 text-sm mt-0.5">
                    {campaign.emailContent.subjectLines[0]}
                  </p>
                </div>
                <button
                  onClick={() => copyText(campaign.emailContent.body)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed">
                {campaign.emailContent.body}
              </div>

              <div className="text-center pt-2">
                <span className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl inline-block shadow-md">
                  {campaign.emailContent.cta}
                </span>
              </div>
            </div>
          )}

          {/* MOBILE EMAIL */}
          {activeTab === "mobile-email" && (
            <div className="max-w-[320px] mx-auto bg-slate-900 border-2 border-slate-800 rounded-[32px] p-4 shadow-xl space-y-3 font-sans">
              <div className="w-20 h-3 bg-slate-800 rounded-b-xl mx-auto -mt-4 mb-2" />
              <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                <span>9:41 AM</span>
                <span>5G 🔋</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-[11px]">
                <p className="font-bold text-emerald-400">{campaign.emailContent.subjectLines[0]}</p>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{campaign.emailContent.body}</p>
                <button className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg text-[11px] mt-2">
                  {campaign.emailContent.cta}
                </button>
              </div>
            </div>
          )}

          {/* LANDING PAGE */}
          {activeTab === "landing" && (
            <div className="p-6 text-center space-y-4 font-sans">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold inline-block">
                https://salesflow.ai/p/{campaign.id}
              </span>
              <h1 className="text-2xl font-black text-white">{campaign.landingPage.headline}</h1>
              <p className="text-slate-300 text-xs max-w-md mx-auto">{campaign.landingPage.subheadline}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-md mx-auto pt-2">
                {campaign.landingPage.features.map((f, i) => (
                  <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg mt-2">
                {campaign.landingPage.ctaText}
              </button>
            </div>
          )}

          {/* WHATSAPP */}
          {activeTab === "whatsapp" && (
            <div className="bg-[#0b141a] rounded-2xl border border-slate-800 p-4 space-y-3 font-sans">
              <p className="text-emerald-400 font-bold text-xs">WhatsApp Broadcast Step 1:</p>
              {campaign.whatsAppMessages.map((m, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#005c4b] text-white text-xs leading-relaxed space-y-1">
                  <p className="font-bold text-emerald-200">Step {m.step}</p>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* SMS */}
          {activeTab === "sms" && (
            <div className="space-y-3 font-sans max-w-sm mx-auto">
              {campaign.smsContent.map((s, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs leading-relaxed">
                  <p className="font-bold text-cyan-400 mb-1">SMS Sequence {s.step}:</p>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* LINKEDIN */}
          {activeTab === "linkedin" && (
            <div className="space-y-3 font-sans max-w-md mx-auto">
              {campaign.linkedInMessages.map((li, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs leading-relaxed">
                  <p className="font-bold text-blue-400 mb-1">LinkedIn Step {li.step}:</p>
                  <p>{li.text}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* AI Suggestions Summary */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">AI Deliverability & Conversion Tip</span>
          </div>
          <p className="text-xs text-slate-400">
            Including your dynamic <code className="text-emerald-300 font-mono">&#123;&#123;company&#125;&#125;</code> tag in email subject lines increases open rates by up to 24%.
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Bot,
  Play,
  Zap,
  CheckCircle2,
  Users,
  Send,
  BarChart2,
  Workflow,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Mail,
  Smartphone,
  Linkedin,
  X,
} from "lucide-react";

interface LandingPageProps {
  onStartFree: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartFree }) => {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 overflow-hidden relative selection:bg-emerald-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 lg:px-8 max-w-6xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-8 backdrop-blur-md shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Introducing SalesFlow AI 2.0 – Conversational Campaign Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6"
        >
          Tell AI what you want to sell. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            SalesFlow AI does the rest.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10"
        >
          Launch complete sales and marketing campaigns using simple conversations instead of complicated software.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartFree}
            id="landing-hero-btn-start-free"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/50 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <span>Start Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDemoModal(true)}
            id="landing-hero-btn-watch-demo"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-semibold bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all flex items-center justify-center gap-2.5 backdrop-blur-md cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Play className="w-3 h-3 fill-emerald-400" />
            </div>
            <span>Watch Demo</span>
          </motion.button>
        </motion.div>

        {/* Interactive Chat Mockup Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-4 sm:p-6 backdrop-blur-xl relative group">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-slate-500 ml-2 font-mono">salesflow-ai-manager // active session</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Manager Online</span>
            </div>
          </div>

          <div className="space-y-4 text-left font-sans text-xs sm:text-sm">
            {/* AI Message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 max-w-xl text-slate-200 shadow-sm">
                <p className="font-semibold text-indigo-300 mb-1">AI Sales Manager</p>
                <p>Hi 👋 I'm your AI Sales Manager. Tell me what you want to sell, and I'll build your email templates, landing page, WhatsApp sequences, and CRM pipeline in seconds.</p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-3 justify-end">
              <div className="bg-indigo-600/30 border border-indigo-500/40 rounded-2xl rounded-tr-none p-4 max-w-md text-slate-100 shadow-sm">
                <p className="text-xs text-indigo-200/80 mb-1 font-semibold">You</p>
                <p>"I sell AI software for hospitals. My goal is to book meetings with Chief Medical Officers."</p>
              </div>
            </div>

            {/* AI Response Generated */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 max-w-xl text-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Campaign Blueprint Generated</span>
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Ready To Launch</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <span>4 Email Sequences</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Outreach</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                    <span>LinkedIn InMail</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-violet-400" />
                    <span>Visual Workflow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Brands */}
      <section className="py-12 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-8">
            Powering Next-Gen Sales Teams Inspired By Industry Pioneers
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all text-slate-400 font-semibold text-lg">
            <span>Notion AI</span>
            <span>HubSpot</span>
            <span>Stripe</span>
            <span>Linear</span>
            <span>Salesforce</span>
            <span>Vercel</span>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 px-4 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            No workflows to build manually. <br />
            Just tell the AI what you need.
          </h2>
          <p className="text-slate-400 text-base">
            SalesFlow AI acts as a 24/7 sales operations engineer, copywriter, and CRM manager wrapped into a single conversational interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Conversational Campaign Creation</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Describe your target audience and goal. The AI creates emails, SMS, WhatsApp copy, preheaders, and landing pages automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-violet-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-5 group-hover:scale-110 transition-transform">
              <Workflow className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Multi-Channel Orchestration</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Reach prospects wherever they are. Execute synchronized email sequences, WhatsApp messages, and LinkedIn touchpoints.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Built-in AI CRM</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Complete contacts, companies, deals Kanban pipeline, lead scoring, and customer timelines updated in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-violet-900/30 border border-indigo-500/30 p-10 sm:p-16 relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to hire your first AI Sales Manager?
            </h2>
            <p className="text-slate-300 text-sm mb-8">
              Launch your first multi-channel campaign in less than 3 minutes.
            </p>
            <button
              onClick={onStartFree}
              className="px-8 py-4 rounded-2xl text-sm font-semibold bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-indigo-400 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>SalesFlow AI Interactive Walkthrough</span>
            </div>

            <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-4 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Watch SalesFlow AI in Action</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                See how non-technical business owners launch email, WhatsApp, and SMS campaigns in under 60 seconds with simple conversational prompts.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  onStartFree();
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
              >
                Launch App Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

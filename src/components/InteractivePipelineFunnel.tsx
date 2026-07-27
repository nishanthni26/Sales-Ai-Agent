import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  DollarSign,
  Building2,
  ChevronRight,
  Flame,
  Award,
  RefreshCw,
  Plus,
  Filter,
  Activity,
  Layers,
} from "lucide-react";

export interface PipelineDeal {
  id: string;
  company: string;
  contactName: string;
  value: number;
  stageId: string;
  leadScore: number;
  lastActivity: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  color: string;
  gradient: string;
  borderColor: string;
  textColor: string;
  bgLight: string;
}

const STAGES: FunnelStage[] = [
  {
    id: "lead",
    name: "Leads Contacted",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-500/40",
    textColor: "text-emerald-400",
    bgLight: "bg-emerald-500/10",
  },
  {
    id: "engaged",
    name: "Engaged & Qualified",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-600",
    borderColor: "border-cyan-500/40",
    textColor: "text-cyan-400",
    bgLight: "bg-cyan-500/10",
  },
  {
    id: "demo",
    name: "Demo / Discovery",
    color: "#6366f1",
    gradient: "from-indigo-500 to-violet-600",
    borderColor: "border-indigo-500/40",
    textColor: "text-indigo-400",
    bgLight: "bg-indigo-500/10",
  },
  {
    id: "proposal",
    name: "Proposal & Negotiation",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/40",
    textColor: "text-violet-400",
    bgLight: "bg-violet-500/10",
  },
  {
    id: "won",
    name: "Closed Won",
    color: "#f43f5e",
    gradient: "from-rose-500 to-pink-600",
    borderColor: "border-rose-500/40",
    textColor: "text-rose-400",
    bgLight: "bg-rose-500/10",
  },
];

const INITIAL_DEALS: PipelineDeal[] = [
  {
    id: "deal-1",
    company: "MetroHealth Systems",
    contactName: "Dr. Sarah Jenkins",
    value: 45000,
    stageId: "proposal",
    leadScore: 98,
    lastActivity: "Reviewed custom B2B proposal 10m ago",
  },
  {
    id: "deal-2",
    company: "Sutter Health Network",
    contactName: "Marcus Vance",
    value: 62000,
    stageId: "proposal",
    leadScore: 94,
    lastActivity: "Requested contract review on LinkedIn",
  },
  {
    id: "deal-3",
    company: "Kaiser Permanente Regional",
    contactName: "Elena Rostova",
    value: 85000,
    stageId: "demo",
    leadScore: 89,
    lastActivity: "Scheduled executive demo for Tuesday",
  },
  {
    id: "deal-4",
    company: "Apex Global Logistics",
    contactName: "David Chen",
    value: 32000,
    stageId: "demo",
    leadScore: 86,
    lastActivity: "Completed initial discovery call",
  },
  {
    id: "deal-5",
    company: "Vanguard Tech Partners",
    contactName: "Samantha Reed",
    value: 28000,
    stageId: "engaged",
    leadScore: 78,
    lastActivity: "Opened email sequence & clicked link",
  },
  {
    id: "deal-6",
    company: "Acuity BioLabs",
    contactName: "Dr. Aris Thorne",
    value: 54000,
    stageId: "engaged",
    leadScore: 81,
    lastActivity: "Replied via WhatsApp regarding pricing",
  },
  {
    id: "deal-7",
    company: "NovaCare Medical",
    contactName: "Rachel Sterling",
    value: 40000,
    stageId: "lead",
    leadScore: 65,
    lastActivity: "Initial email outreach delivered",
  },
  {
    id: "deal-8",
    company: "Horizon Health Group",
    contactName: "James Miller",
    value: 50000,
    stageId: "won",
    leadScore: 99,
    lastActivity: "Contract signed ($50,000 ARR)",
  },
];

export const InteractivePipelineFunnel: React.FC = () => {
  const [deals, setDeals] = useState<PipelineDeal[]>(INITIAL_DEALS);
  const [activeStageFilter, setActiveStageFilter] = useState<string>("all");
  const [animatingDealId, setAnimatingDealId] = useState<string | null>(null);
  const [animatingStageId, setAnimatingStageId] = useState<string | null>(null);
  const [recentProgression, setRecentProgression] = useState<{
    dealName: string;
    fromStage: string;
    toStage: string;
    value: number;
  } | null>(null);

  // Additional base macro metrics per stage to combine with active deals
  const baseStageCounts: Record<string, { count: number; value: number }> = {
    lead: { count: 4480, value: 890000 },
    engaged: { count: 2580, value: 520000 },
    demo: { count: 1100, value: 310000 },
    proposal: { count: 186, value: 185000 },
    won: { count: 42, value: 124000 },
  };

  // Calculate current total counts & values per stage
  const stageStats = STAGES.map((stage) => {
    const stageDeals = deals.filter((d) => d.stageId === stage.id);
    const dealsValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
    const base = baseStageCounts[stage.id] || { count: 0, value: 0 };
    return {
      stage,
      deals: stageDeals,
      count: base.count + stageDeals.length,
      value: base.value + dealsValue,
    };
  });

  const firstStageCount = stageStats[0].count || 1;

  // Calculate stage-to-stage conversion rates
  const stagesWithConversion = stageStats.map((st, index) => {
    const overallConversion = ((st.count / firstStageCount) * 100).toFixed(1);
    const prevCount = index > 0 ? stageStats[index - 1].count : st.count;
    const stepConversion = index > 0 ? ((st.count / prevCount) * 100).toFixed(1) : "100.0";
    return {
      ...st,
      overallConversion,
      stepConversion,
    };
  });

  const totalPipelineValue = stageStats.reduce((sum, st) => sum + st.value, 0);
  const totalDealsCount = stageStats.reduce((sum, st) => sum + st.count, 0);

  // Handler to advance a deal to the next stage
  const handleProgressDeal = (dealId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    const currentIndex = STAGES.findIndex((s) => s.id === deal.stageId);
    if (currentIndex < 0 || currentIndex >= STAGES.length - 1) return; // Already in final stage

    const nextStage = STAGES[currentIndex + 1];
    const prevStage = STAGES[currentIndex];

    // Trigger visual animation state
    setAnimatingDealId(dealId);
    setAnimatingStageId(nextStage.id);
    setRecentProgression({
      dealName: deal.company,
      fromStage: prevStage.name,
      toStage: nextStage.name,
      value: deal.value,
    });

    // Update deal stage
    setDeals((prevDeals) =>
      prevDeals.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stageId: nextStage.id,
              lastActivity: `Advanced to ${nextStage.name} stage just now!`,
            }
          : d
      )
    );

    // Clear highlight animation after 2.5 seconds
    setTimeout(() => {
      setAnimatingDealId(null);
      setAnimatingStageId(null);
    }, 2500);
  };

  const handleResetPipeline = () => {
    setDeals(INITIAL_DEALS);
    setRecentProgression(null);
  };

  const filteredDeals =
    activeStageFilter === "all"
      ? deals
      : deals.filter((d) => d.stageId === activeStageFilter);

  return (
    <div className="p-6 rounded-3xl bg-[#131924] border border-slate-800 shadow-2xl space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Interactive Sales Pipeline Funnel</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Conversion Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time conversion metrics between stages • Advance deals to trigger pipeline progression
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetPipeline}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset to default pipeline state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
          <div className="text-right pl-3 border-l border-slate-800">
            <p className="text-[10px] text-slate-400 font-medium uppercase">Active Pipeline Value</p>
            <p className="text-lg font-black text-emerald-400">${totalPipelineValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Animation Toast for Deal Progression */}
      <AnimatePresence>
        {recentProgression && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/50 shadow-xl flex items-center justify-between text-xs text-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md animate-bounce">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-sm flex items-center gap-2">
                  <span>Deal Advanced Successfully!</span>
                  <span className="text-emerald-400 font-extrabold">+${recentProgression.value.toLocaleString()}</span>
                </p>
                <p className="text-slate-300 text-xs mt-0.5">
                  <span className="font-semibold text-emerald-300">{recentProgression.dealName}</span> moved from{" "}
                  <span className="text-slate-400">{recentProgression.fromStage}</span> to{" "}
                  <span className="text-indigo-400 font-bold">{recentProgression.toStage}</span> stage.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold">
              Updated Stage Conversion Rates
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VISUAL FUNNEL TAPERED BARS WITH CONVERSION BADGES */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Visual Funnel Geometry & Step-by-Step Conversion</span>
          <span className="text-slate-500 font-normal">Width indicates stage volume relative to initial leads</span>
        </h3>

        <div className="space-y-3">
          {stagesWithConversion.map((st, idx) => {
            // Percent width relative to first stage
            const rawWidthPercent = Math.max(12, Math.min(100, (st.count / firstStageCount) * 100));
            const isAnimating = animatingStageId === st.stage.id;

            return (
              <div key={st.stage.id} className="relative group">
                {/* Main Funnel Bar Container */}
                <div className="flex items-center gap-3">
                  {/* Stage Label & Counter */}
                  <div className="w-36 sm:w-48 shrink-0 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-200">
                      <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${st.stage.gradient}`} />
                      <span className="truncate">{st.stage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-white">{st.count.toLocaleString()} deals</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono">${(st.value / 1000).toFixed(0)}k</span>
                    </div>
                  </div>

                  {/* Funnel Bar Graphic */}
                  <div className="flex-1 bg-slate-900/80 rounded-2xl h-12 p-1 relative overflow-hidden border border-slate-800/80 flex items-center">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${rawWidthPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-xl bg-gradient-to-r ${st.stage.gradient} relative flex items-center px-3 shadow-md ${
                        isAnimating ? "ring-2 ring-emerald-400 animate-pulse" : ""
                      }`}
                    >
                      {/* Inner text on bar */}
                      <span className="text-white font-extrabold text-xs drop-shadow-md whitespace-nowrap">
                        {st.overallConversion}% <span className="font-normal opacity-90 text-[10px]">of total</span>
                      </span>

                      {/* Shimmer overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </motion.div>
                  </div>

                  {/* Step Conversion Badge (Between consecutive stages) */}
                  <div className="w-28 sm:w-36 shrink-0 text-right">
                    {idx === 0 ? (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 text-[11px] font-mono font-medium border border-slate-700">
                        Baseline (100%)
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-extrabold text-emerald-400">{st.stepConversion}%</span>
                        <span className="text-[10px] text-slate-500">pass</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE STAGE CARDS GRID */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Interactive Deal Pipeline by Stage</span>
          </h3>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveStageFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeStageFilter === "all"
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Deals ({deals.length})
            </button>
            {STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStageFilter(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeStageFilter === s.id
                    ? `${s.bgLight} ${s.textColor} font-bold border ${s.borderColor}`
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {s.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* List of Deals inside Active Stage or All Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDeals.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No deals currently in this stage. Click "Reset Demo" to restore deals.
            </div>
          ) : (
            filteredDeals.map((deal) => {
              const currentStageObj = STAGES.find((s) => s.id === deal.stageId) || STAGES[0];
              const currentIndex = STAGES.findIndex((s) => s.id === deal.stageId);
              const isFinalStage = currentIndex === STAGES.length - 1;
              const nextStageObj = !isFinalStage ? STAGES[currentIndex + 1] : null;
              const isAnimating = animatingDealId === deal.id;

              return (
                <motion.div
                  key={deal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-2xl bg-slate-900/90 border ${
                    isAnimating ? "border-emerald-400 ring-2 ring-emerald-500/30" : "border-slate-800 hover:border-slate-700"
                  } space-y-3 shadow-md flex flex-col justify-between transition-all`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-xs">{deal.company}</h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{deal.contactName}</span>
                        </p>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 shrink-0">
                        ${deal.value.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold border ${currentStageObj.bgLight} ${currentStageObj.textColor} ${currentStageObj.borderColor}`}
                      >
                        {currentStageObj.name}
                      </span>
                      <span className="text-rose-400 font-bold flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />
                        <span>Score {deal.leadScore}</span>
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800/80 truncate">
                      {deal.lastActivity}
                    </p>
                  </div>

                  {/* Stage Progress Action */}
                  <div className="pt-2 border-t border-slate-800/80">
                    {isFinalStage ? (
                      <div className="w-full py-2 bg-rose-500/10 text-rose-300 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-rose-500/30">
                        <Award className="w-3.5 h-3.5" />
                        <span>Closed Deal Won!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleProgressDeal(deal.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                          isAnimating
                            ? "bg-emerald-400 text-slate-950 font-black animate-pulse"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                        id={`btn-progress-${deal.id}`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Advance to {nextStageObj?.name.split(" ")[0]}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

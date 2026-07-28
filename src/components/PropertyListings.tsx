import React, { useState } from "react";
import {
  Building2, Plus, Search, MapPin, Eye, Send, Bed, Bath,
  Maximize2, Tag, Phone, RotateCw, TrendingUp, DollarSign,
  CheckCircle2, AlertCircle, FileText, Calendar, Award,
  BarChart2, Layers, ArrowRight, ExternalLink, Download, Filter,
  ChevronDown,
} from "lucide-react";
import { initialPropertyListings } from "../data/mockData";
import { PropertyListing } from "../types";

export const PropertyListings: React.FC = () => {
  const [properties] = useState<PropertyListing[]>(initialPropertyListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const triggerRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.address.toLowerCase().includes(searchQuery.toLowerCase()) || p.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Listings", value: properties.length, icon: Building2 },
    { label: "Active", value: properties.filter((p) => p.status === "Active").length, icon: CheckCircle2 },
    { label: "Pending", value: properties.filter((p) => p.status === "Pending").length, icon: AlertCircle },
    { label: "Sold", value: properties.filter((p) => p.status === "Sold").length, icon: TrendingUp },
  ];

  const featureCards = [
    { id: "mls", title: "MLS Integration", icon: Layers, description: "Sync listings with MLS feeds and auto-import property data.", tags: ["MLS Sync", "Auto-Import", "Feed Management", "Listing Updates", "Photo Sync", "Status Sync", "IDX Feed", "RETS Protocol"], metrics: ["Feeds: 3", "Sync: Hourly", "Listings: " + properties.length], actionLabel: "Configure MLS" },
    { id: "pricing", title: "Price Management", icon: DollarSign, description: "Track price changes, valuation estimates, and ROI projections.", tags: ["Price History", "Valuation Estimate", "ROI Yield", "Price Drops", "Market Analysis", "Comparable Sales", "Auto-Pricing", "Price Alerts"], metrics: ["Avg Price: $3.2M", "ROI: 8.4%", "Price Drops: 2"], actionLabel: "Manage Pricing" },
    { id: "tours", title: "3D Virtual Tours", icon: Eye, description: "Generate and share 3D walkthroughs and virtual staging.", tags: ["3D Walkthrough", "Virtual Staging", "Tour Links", "Buyer Sharing", "Tour Analytics", "Matterport Sync", "Video Tours", "Live Tour Scheduling"], metrics: ["Tours: 18", "Views: 4.2K", "Shares: 84"], actionLabel: "Manage Tours" },
    { id: "buyer_match", title: "Buyer Matching", icon: TrendingUp, description: "Auto-match listings to qualified buyers based on criteria.", tags: ["Auto-Match", "Buyer Profiles", "Criteria Matching", "Inquiry Routing", "Match Score", "Notification Alerts", "Buyer Queue", "Match Reports"], metrics: ["Matches: 142", "Avg Score: 78%", "Inquiries: 320"], actionLabel: "View Matches" },
    { id: "documents", title: "Listing Documents", icon: FileText, description: "Manage disclosure forms, brochures, and property documents.", tags: ["Disclosure Forms", "Property Brochures", "Title Reports", "Inspection Reports", "HOA Docs", "Document Templates", "E-Signature", "Version Control"], metrics: ["Documents: 84", "Templates: 12", "Pending: 4"], actionLabel: "Manage Documents" },
    { id: "analytics", title: "Listing Analytics", icon: BarChart2, description: "Performance dashboards for views, inquiries, and conversion.", tags: ["View Tracking", "Inquiry Reports", "Conversion Funnel", "Days on Market", "Price-Per-SqFt", "Neighborhood Stats", "Listing Score", "Performance Reports"], metrics: ["Views: 12.4K", "Inquiries: 320", "Conv: 14%"], actionLabel: "View Analytics" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight">Property Listings</h1>
          <div className="flex items-center gap-3">
            <button onClick={triggerRefresh} className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"><RotateCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} /></button>
            <button onClick={() => alert("Opening Add New Property Listing Form...")} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Listing</span><span className="sm:hidden">Add</span></button>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">Manage real estate listings, MLS feeds, 3D tours, and buyer matching.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => { const Icon = stat.icon; return (
            <div key={i} className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200/80 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-cyan-600 flex items-center justify-center shrink-0 border border-slate-200"><Icon className="w-5 h-5" /></div>
              <div className="min-w-0"><p className="text-xl font-black text-slate-900 truncate">{stat.value}</p><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{stat.label}</p></div>
            </div>
          ); })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5">
        <div className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200/80 shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search title, address, or city..." className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div className="flex items-center gap-2">
              {["all", "Active", "Pending", "Sold"].map((st) => (
                <button key={st} onClick={() => setSelectedStatus(st)} className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${selectedStatus === st ? "bg-cyan-500 text-slate-950 border border-cyan-400" : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"}`}>{st === "all" ? "All" : st}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {filteredProperties.map((p) => (
          <div key={p.id} className="bg-white text-slate-900 rounded-2xl border border-slate-200/80 shadow-md hover:border-cyan-200 transition-all overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-48 sm:h-32 sm:w-48 shrink-0 overflow-hidden bg-slate-100">
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-cyan-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg">{p.type}</div>
                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">{p.status.toUpperCase()}</div>
              </div>
              <div className="p-4 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><h3 className="font-black text-slate-900 text-sm truncate">{p.title}</h3><p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="truncate">{p.address}, {p.city} {p.state}</span></p></div>
                  <p className="text-lg font-black text-slate-900 shrink-0">${p.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4 py-2 border-y border-slate-100 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-slate-400" /><span>{p.beds} Beds</span></div>
                  <div className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-slate-400" /><span>{p.baths} Baths</span></div>
                  <div className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-slate-400" /><span>{p.sqft.toLocaleString()} SqFt</span></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">ROI: <strong className="text-emerald-600">{p.roiYield}%</strong></span>
                  <span className="text-cyan-600 font-bold">{p.matchingBuyersCount} Matching Buyers</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => setSelectedProperty(p)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer">View Details</button>
                  <button onClick={() => alert(`Broadcasting 3D Tour for ${p.title}...`)} className="py-2 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"><Send className="w-3.5 h-3.5" /><span>Tour</span></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredProperties.length === 0 && (
          <div className="bg-white text-slate-900 rounded-2xl p-8 text-center border border-slate-200/80 shadow-md"><Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p className="text-xs font-bold text-slate-500">No properties found.</p></div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6"><div className="border-b border-slate-800 pb-3"><h2 className="text-lg font-black text-white tracking-tight">Listing Tools</h2><p className="text-[11px] text-slate-500">{featureCards.length} modules for property management</p></div></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {featureCards.map((card) => { const Icon = card.icon; return (
          <div key={card.id} className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200/80 shadow-md hover:border-cyan-200 transition-all">
            <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 text-cyan-600 flex items-center justify-center shrink-0 border border-slate-200"><Icon className="w-5 h-5" /></div><div className="min-w-0 flex-1"><h3 className="font-black text-slate-900 text-sm">{card.title}</h3><p className="text-[11px] text-slate-500 mt-0.5">{card.description}</p></div></div>
            <div className="flex flex-wrap gap-1.5">{card.tags.map((tag, idx) => <span key={idx} className="text-[10px] font-semibold bg-slate-50 text-slate-700 px-2 py-1 rounded-lg border border-slate-100">{tag}</span>)}</div>
            <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-100"><div className="flex items-center gap-3 flex-wrap">{card.metrics.map((m, idx) => <span key={idx} className="text-[10px] text-slate-500 font-semibold">{m}</span>)}</div><button onClick={() => alert(`Opening ${card.title}...`)} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"><span>{card.actionLabel}</span><ArrowRight className="w-3.5 h-3.5" /></button></div>
          </div>
        ); })}
      </div>

      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedProperty(null)}>
          <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10 flex items-start justify-between">
              <div><span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">{selectedProperty.type}</span><h2 className="text-xl font-black text-slate-900 mt-1">{selectedProperty.title}</h2><p className="text-xs text-slate-500">{selectedProperty.address}, {selectedProperty.city}</p></div>
              <button onClick={() => setSelectedProperty(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"><span className="text-xs font-bold">Close</span></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded-xl overflow-hidden h-56 bg-slate-100"><img src={selectedProperty.images[0]} alt={selectedProperty.title} className="w-full h-full object-cover" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center"><Bed className="w-4 h-4 text-cyan-600 mx-auto mb-1" /><p className="text-lg font-black text-slate-900">{selectedProperty.beds}</p><p className="text-[10px] text-slate-500 font-bold uppercase">Beds</p></div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center"><Bath className="w-4 h-4 text-cyan-600 mx-auto mb-1" /><p className="text-lg font-black text-slate-900">{selectedProperty.baths}</p><p className="text-[10px] text-slate-500 font-bold uppercase">Baths</p></div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center"><Maximize2 className="w-4 h-4 text-cyan-600 mx-auto mb-1" /><p className="text-lg font-black text-slate-900">{selectedProperty.sqft.toLocaleString()}</p><p className="text-[10px] text-slate-500 font-bold uppercase">SqFt</p></div>
              </div>
              <div><p className="font-bold text-slate-900 text-xs mb-1">Property Overview:</p><p className="text-xs text-slate-600 leading-relaxed">{selectedProperty.description}</p></div>
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-xl border border-cyan-100"><span className="text-xs font-bold text-slate-700">List Price</span><span className="text-xl font-black text-cyan-600">${selectedProperty.price.toLocaleString()}</span></div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => setSelectedProperty(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer">Close</button>
                <button onClick={() => { alert("Dispatched property brochure to top 15 matching leads!"); setSelectedProperty(null); }} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer">Dispatch to Leads</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center pt-6 pb-6"><p className="text-xs text-slate-400 font-semibold">Account time zone</p><p className="text-xs font-bold text-slate-300">GMT-04:00</p></div>
    </div>
  );
};

import React, { useState } from "react";
import {
  Building2,
  Building,
  Plus,
  Search,
  Filter,
  MapPin,
  Eye,
  Send,
  MoreVertical,
  CheckCircle2,
  Sparkles,
  Bed,
  Bath,
  Maximize2,
  DollarSign,
  Tag,
  Share2,
  Phone,
} from "lucide-react";
import { initialPropertyListings } from "../data/mockData";
import { PropertyListing } from "../types";

export const PropertyListings: React.FC = () => {
  const [properties, setProperties] = useState<PropertyListing[]>(initialPropertyListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 lg:p-8 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              PropValue MLS Inventory & Listing Manager
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Property Listings Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage real estate listings, 3D tour links, MLS feeds, price changes, and buyer inquiry matching.
          </p>
        </div>

        <button
          onClick={() => alert("Opening Add New Property Listing Form...")}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property Listing</span>
        </button>
      </div>

      {/* SEARCH AND STATUS FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, address, or MLS ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {["all", "active", "pending", "sold"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedStatus === st
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PROPERTY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                  {p.type}
                </div>
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {p.status.toUpperCase()}
                </div>
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-sm px-3 py-1 rounded-xl shadow-md">
                  ${p.price.toLocaleString()}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{p.address}, {p.city} {p.state}</span>
                  </p>
                </div>

                {/* Specs Row */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-slate-400" />
                    <span>{p.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-slate-400" />
                    <span>{p.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                    <span>{p.sqft.toLocaleString()} SqFt</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>MLS ID: <strong className="text-slate-800">{p.mlsId}</strong></span>
                  <span className="text-emerald-600 font-bold">{p.viewsCount} Inquiries</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedProperty(p)}
                className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                View Details
              </button>
              <button
                onClick={() => alert(`Broadcasting 3D Tour for ${p.title} to interested buyers...`)}
                className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                title="Send Tour"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tour</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PROPERTY DETAILS MODAL */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  MLS #{selectedProperty.mlsId}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">{selectedProperty.title}</h2>
                <p className="text-xs text-slate-500">{selectedProperty.address}, {selectedProperty.city}</p>
              </div>
              <p className="text-xl font-black text-slate-900">${selectedProperty.price.toLocaleString()}</p>
            </div>

            <div className="rounded-xl overflow-hidden h-56 bg-slate-100">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-900">Property Overview:</p>
              <p className="leading-relaxed">{selectedProperty.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedProperty(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Dispatched property brochure to top 15 matching leads!`);
                  setSelectedProperty(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer text-xs shadow-xs"
              >
                Dispatch to Matched Leads
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

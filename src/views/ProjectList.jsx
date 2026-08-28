import React, { useState } from "react";
import { Search, Filter, Eye, Plus, ChevronDown } from "lucide-react";

const STATUS_COLORS = {
  "Completed":  { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200" },
  "On Track":   { bg: "bg-sky-100",     text: "text-sky-800",     border: "border-sky-200"     },
  "Delayed":    { bg: "bg-amber-100",   text: "text-amber-800",   border: "border-amber-200"   },
  "High Risk":  { bg: "bg-red-100",     text: "text-red-800",     border: "border-red-200"     },
};

const TYPE_COLORS = {
  "Highway":         "bg-indigo-100 text-indigo-800",
  "Railway":         "bg-purple-100 text-purple-800",
  "Urban Transit":   "bg-blue-100 text-blue-800",
  "Industrial":      "bg-orange-100 text-orange-800",
  "Irrigation":      "bg-teal-100 text-teal-800",
  "Renewable Energy":"bg-green-100 text-green-800",
};

export default function ProjectList({ projects, onViewDetails, onAddProject }) {
  const [search, setSearch]           = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter]   = useState("All");

  const states   = ["All", ...new Set(projects.map(p => p.state))];
  const statuses = ["All", "Completed", "On Track", "Delayed", "High Risk"];
  const types    = ["All", ...new Set(projects.map(p => p.type))];

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchState  = stateFilter  === "All" || p.state === stateFilter;
    const matchStatus = statusFilter === "All" || p.overallStatus === statusFilter;
    const matchType   = typeFilter   === "All" || p.type === typeFilter;
    return matchSearch && matchState && matchStatus && matchType;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PROJECT MANAGEMENT</span>
          <h2 className="text-lg font-black text-slate-900 mt-0.5">All Projects</h2>
          <p className="text-xs text-slate-500 mt-0.5">Showing {filtered.length} of {projects.length} projects across all states</p>
        </div>
        <button
          onClick={onAddProject}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer text-sm shadow-lg shadow-blue-600/20"
        >
          <Plus size={16} /> Add New Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by project name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {[
            { label: "State",  value: stateFilter,  setter: setStateFilter,  options: states   },
            { label: "Status", value: statusFilter,  setter: setStatusFilter, options: statuses },
            { label: "Type",   value: typeFilter,    setter: setTypeFilter,   options: types    },
          ].map(f => (
            <div key={f.label} className="relative">
              <select
                value={f.value}
                onChange={e => f.setter(e.target.value)}
                className="appearance-none text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-2 bg-slate-50 focus:outline-none cursor-pointer font-semibold text-slate-600"
              >
                {f.options.map(o => <option key={o} value={o}>{f.label}: {o}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Project ID", "Project Name", "State / District", "Type", "Progress", "Compensation", "Possession", "R&R", "Status", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400 font-semibold">
                    No projects match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const sc  = STATUS_COLORS[p.overallStatus] || STATUS_COLORS["On Track"];
                  const tc  = TYPE_COLORS[p.type] || "bg-slate-100 text-slate-700";
                  const pct = p.progressPercentage;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-[10px] font-bold text-slate-600 whitespace-nowrap">{p.shortName}</td>
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="font-bold text-slate-800 leading-snug truncate" title={p.name}>{p.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{p.requiringBody}</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-semibold text-slate-700">{p.state}</p>
                        <p className="text-[10px] text-slate-400">{p.district}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tc}`}>{p.type}</span>
                      </td>
                      <td className="px-4 py-3.5 min-w-[110px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-sky-500" : "bg-amber-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700 shrink-0">{pct}%</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.landAcquiredAcres} / {p.landProposedAcres || "—"} ac</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-bold text-slate-800">₹{p.compensationPaidCr} Cr</p>
                        <p className="text-[10px] text-slate-400">of ₹{p.compensationAssessedCr} Cr</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.lifecycleBreakdown.possession === 100 ? "bg-emerald-100 text-emerald-800" :
                          p.lifecycleBreakdown.possession > 0   ? "bg-amber-100 text-amber-800" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {p.lifecycleBreakdown.possession}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.lifecycleBreakdown.rr === 100 ? "bg-emerald-100 text-emerald-800" :
                          p.lifecycleBreakdown.rr > 0    ? "bg-amber-100 text-amber-800" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {p.rrCompletedCount}/{p.affectedFamiliesCount} fam.
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                          {p.overallStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => onViewDetails(p.id)}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all text-[10px] whitespace-nowrap"
                        >
                          <Eye size={12} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold bg-slate-50">
          <span>{filtered.length} record(s) displayed</span>
          <span>Total National Projects: {projects.length}</span>
        </div>
      </div>
    </div>
  );
}

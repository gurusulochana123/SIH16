import React, { useState } from "react";
import { Search, Filter, Eye, Plus, ChevronDown } from "lucide-react";

const STATUS_CFG = {
  "Completed": { bg:"rgba(16,185,129,0.15)", text:"#34d399", border:"rgba(16,185,129,0.3)" },
  "On Track":  { bg:"rgba(56,189,248,0.15)", text:"#38bdf8", border:"rgba(56,189,248,0.3)" },
  "Delayed":   { bg:"rgba(245,158,11,0.15)", text:"#fbbf24", border:"rgba(245,158,11,0.3)" },
  "High Risk": { bg:"rgba(239,68,68,0.15)",  text:"#f87171", border:"rgba(239,68,68,0.3)"  },
};
const TYPE_CFG = {
  "Highway":          { bg:"rgba(99,102,241,0.15)",  text:"#a78bfa" },
  "Railway":          { bg:"rgba(167,139,250,0.15)", text:"#c4b5fd" },
  "Urban Transit":    { bg:"rgba(56,189,248,0.15)",  text:"#7dd3fc" },
  "Industrial":       { bg:"rgba(251,146,60,0.15)",  text:"#fb923c" },
  "Irrigation":       { bg:"rgba(20,184,166,0.15)",  text:"#2dd4bf" },
  "Renewable Energy": { bg:"rgba(74,222,128,0.15)",  text:"#4ade80" },
};

const card = { background:"#0f0f24", borderRadius:"16px", border:"1px solid rgba(167,139,250,0.12)", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" };
const inputS = { border:"1px solid rgba(167,139,250,0.2)", borderRadius:"10px", padding:"7px 12px", fontSize:"12px", background:"rgba(167,139,250,0.05)", color:"rgba(255,255,255,0.85)", outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" };
const selectS = { ...inputS, width:"auto", cursor:"pointer" };

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
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      {/* Header */}
      <div style={{ ...card, padding:"20px", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.15em" }}>Project Management</div>
          <h2 style={{ fontSize:"18px", fontWeight:900, color:"rgba(255,255,255,0.92)", margin:"2px 0 0" }}>All Projects</h2>
          <p style={{ fontSize:"11px", color:"rgba(167,139,250,0.5)", marginTop:"2px" }}>Showing {filtered.length} of {projects.length} projects</p>
        </div>
        <button onClick={onAddProject}
          style={{ display:"flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", color:"white", fontWeight:700, padding:"9px 18px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"13px", boxShadow:"0 4px 16px rgba(124,58,237,0.4)", transition:"all 0.2s" }}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 24px rgba(167,139,250,0.5)";e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(124,58,237,0.4)";e.currentTarget.style.transform="none";}}>
          <Plus size={16}/> Add New Project
        </button>
      </div>

      {/* Filters */}
      <div style={{ ...card, padding:"14px 18px", display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", flex:1, minWidth:"200px" }}>
          <Search size={15} style={{ color:"rgba(167,139,250,0.45)", flexShrink:0 }}/>
          <input type="text" placeholder="Search by name or ID..." value={search} onChange={e=>setSearch(e.target.value)}
            style={inputS}
            onFocus={e=>{e.target.style.borderColor="rgba(167,139,250,0.5)";e.target.style.background="rgba(167,139,250,0.08)";}}
            onBlur={e=>{e.target.style.borderColor="rgba(167,139,250,0.2)";e.target.style.background="rgba(167,139,250,0.05)";}}
          />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
          <Filter size={13} style={{ color:"rgba(167,139,250,0.4)" }}/>
          {[
            { label:"State",  value:stateFilter,  setter:setStateFilter,  options:states   },
            { label:"Status", value:statusFilter,  setter:setStatusFilter, options:statuses },
            { label:"Type",   value:typeFilter,    setter:setTypeFilter,   options:types    },
          ].map(f => (
            <select key={f.label} value={f.value} onChange={e=>f.setter(e.target.value)} style={selectS}>
              {f.options.map(o => <option key={o} value={o} style={{background:"#0f0f24"}}>{f.label}: {o}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead style={{ background:"rgba(167,139,250,0.06)" }}>
              <tr>
                {["Project ID","Project Name","State / District","Type","Progress","Compensation","Possession","R&R","Status","Action"].map(h=>(
                  <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.55)", textTransform:"uppercase", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={10} style={{ padding:"48px", textAlign:"center", color:"rgba(167,139,250,0.4)", fontWeight:600 }}>No projects match the selected filters.</td></tr>
              ) : (
                filtered.map(p=>{
                  const sc = STATUS_CFG[p.overallStatus] || STATUS_CFG["On Track"];
                  const tc = TYPE_CFG[p.type] || { bg:"rgba(167,139,250,0.1)", text:"#a78bfa" };
                  const pct = p.progressPercentage;
                  return (
                    <tr key={p.id} style={{ borderTop:"1px solid rgba(167,139,250,0.07)", transition:"background 0.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(167,139,250,0.05)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"12px 14px", fontFamily:"monospace", fontSize:"10px", fontWeight:700, color:"rgba(167,139,250,0.7)", whiteSpace:"nowrap" }}>{p.shortName}</td>
                      <td style={{ padding:"12px 14px", maxWidth:"200px" }}>
                        <p style={{ fontWeight:700, color:"rgba(255,255,255,0.88)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={p.name}>{p.name}</p>
                        <p style={{ fontSize:"10px", color:"rgba(167,139,250,0.45)", marginTop:"2px" }}>{p.requiringBody}</p>
                      </td>
                      <td style={{ padding:"12px 14px", whiteSpace:"nowrap" }}>
                        <p style={{ fontWeight:600, color:"rgba(255,255,255,0.8)" }}>{p.state}</p>
                        <p style={{ fontSize:"10px", color:"rgba(167,139,250,0.45)" }}>{p.district}</p>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ background:tc.bg, color:tc.text, padding:"2px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, border:`1px solid ${tc.text}30` }}>{p.type}</span>
                      </td>
                      <td style={{ padding:"12px 14px", minWidth:"110px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                          <div style={{ flex:1, background:"rgba(167,139,250,0.1)", height:"5px", borderRadius:"99px", overflow:"hidden" }}>
                            <div style={{ height:"100%", borderRadius:"99px", width:`${pct}%`, background: pct>=80?"#10b981":pct>=50?"#38bdf8":"#fbbf24" }}/>
                          </div>
                          <span style={{ fontWeight:700, color:"rgba(255,255,255,0.85)", flexShrink:0, fontSize:"11px" }}>{pct}%</span>
                        </div>
                        <p style={{ fontSize:"10px", color:"rgba(167,139,250,0.45)", marginTop:"2px" }}>{p.landAcquiredAcres}/{p.landProposedAcres||"—"} ac</p>
                      </td>
                      <td style={{ padding:"12px 14px", whiteSpace:"nowrap" }}>
                        <p style={{ fontWeight:700, color:"rgba(255,255,255,0.85)" }}>₹{p.compensationPaidCr} Cr</p>
                        <p style={{ fontSize:"10px", color:"rgba(167,139,250,0.45)" }}>of ₹{p.compensationAssessedCr} Cr</p>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ padding:"2px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:p.lifecycleBreakdown.possession===100?"rgba(16,185,129,0.15)":p.lifecycleBreakdown.possession>0?"rgba(245,158,11,0.15)":"rgba(167,139,250,0.1)", color:p.lifecycleBreakdown.possession===100?"#34d399":p.lifecycleBreakdown.possession>0?"#fbbf24":"rgba(167,139,250,0.5)" }}>
                          {p.lifecycleBreakdown.possession}%
                        </span>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ padding:"2px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:p.lifecycleBreakdown.rr===100?"rgba(16,185,129,0.15)":p.lifecycleBreakdown.rr>0?"rgba(245,158,11,0.15)":"rgba(167,139,250,0.1)", color:p.lifecycleBreakdown.rr===100?"#34d399":p.lifecycleBreakdown.rr>0?"#fbbf24":"rgba(167,139,250,0.5)" }}>
                          {p.rrCompletedCount}/{p.affectedFamiliesCount} fam.
                        </span>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ padding:"3px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:sc.bg, color:sc.text, border:`1px solid ${sc.border}` }}>
                          {p.overallStatus}
                        </span>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <button onClick={()=>onViewDetails(p.id)}
                          style={{ display:"flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", color:"white", fontWeight:700, padding:"6px 12px", borderRadius:"9px", border:"none", cursor:"pointer", fontSize:"10px", whiteSpace:"nowrap", boxShadow:"0 2px 10px rgba(124,58,237,0.35)", transition:"all 0.15s" }}
                          onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(167,139,250,0.5)";e.currentTarget.style.transform="translateY(-1px)";}}
                          onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 10px rgba(124,58,237,0.35)";e.currentTarget.style.transform="none";}}>
                          <Eye size={11}/> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"12px 18px", borderTop:"1px solid rgba(167,139,250,0.08)", display:"flex", justifyContent:"space-between", fontSize:"10px", color:"rgba(167,139,250,0.4)", fontWeight:600, background:"rgba(167,139,250,0.03)" }}>
          <span>{filtered.length} record(s) displayed</span>
          <span>Total National Projects: {projects.length}</span>
        </div>
      </div>
    </div>
  );
}

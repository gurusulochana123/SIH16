import React, { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle, ChevronLeft, Users } from "lucide-react";

const STAGE_CONFIG = {
  completed:  { icon: CheckCircle2,  label: "Completed"   },
  inprogress: { icon: Clock,         label: "In Progress"  },
  pending:    { icon: Clock,         label: "Pending"      },
  delayed:    { icon: AlertTriangle, label: "Delayed"      },
};
const ACTION_MAP = {
  "District Verification": { label: "✔ Verify",              nextStatus: "completed", nextStage: 2 },
  "State Approval":        { label: "✔ Approve",             nextStatus: "completed", nextStage: 3 },
  "Notification (Sec 11)": { label: "📢 Issue Notification", nextStatus: "completed", nextStage: 4 },
  "Land Survey":           { label: "📐 Mark Survey Done",   nextStatus: "completed", nextStage: 5 },
  "Award Declaration":     { label: "🏆 Declare Award",      nextStatus: "completed", nextStage: 6 },
  "Compensation Payment":  { label: "💰 Mark Comp. Paid",    nextStatus: "completed", nextStage: 7 },
  "Land Possession":       { label: "🏠 Mark Possession",    nextStatus: "completed", nextStage: 8 },
  "R&R Completion":        { label: "✅ Complete R&R",       nextStatus: "completed", nextStage: 9 },
  "Project Completed":     { label: "🎉 Close Project",      nextStatus: "completed", nextStage: 9 },
};
const card = { background:"#0f0f24", borderRadius:"16px", border:"1px solid rgba(167,139,250,0.12)", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" };
const stageCfgDark = {
  completed:  { dotColor:"#10b981", lineColor:"rgba(16,185,129,0.4)",   badgeBg:"rgba(16,185,129,0.15)",  badgeText:"#34d399",  badgeBorder:"rgba(16,185,129,0.3)"  },
  inprogress: { dotColor:"#a78bfa", lineColor:"rgba(167,139,250,0.3)",  badgeBg:"rgba(124,58,237,0.15)",  badgeText:"#c4b5fd",  badgeBorder:"rgba(167,139,250,0.3)" },
  pending:    { dotColor:"rgba(167,139,250,0.25)", lineColor:"rgba(167,139,250,0.1)", badgeBg:"rgba(167,139,250,0.07)", badgeText:"rgba(167,139,250,0.5)", badgeBorder:"rgba(167,139,250,0.15)" },
  delayed:    { dotColor:"#f87171", lineColor:"rgba(239,68,68,0.3)",    badgeBg:"rgba(239,68,68,0.15)",   badgeText:"#f87171",  badgeBorder:"rgba(239,68,68,0.3)"   },
};

export default function ProjectDetails({ project, onBack, onUpdateProject }) {
  const [stages, setStages] = useState(project.workflowStages);
  const [toast, setToast] = useState(null);
  const [activeParcel, setActiveParcel] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const handleAction = (stageName, stageIdx) => {
    const action = ACTION_MAP[stageName];
    if (!action) return;
    const updated = stages.map((s,i) => {
      if (i===stageIdx) return {...s,status:action.nextStatus,date:new Date().toISOString().slice(0,10)};
      if (i===stageIdx+1 && s.status==="pending") return {...s,status:"inprogress"};
      return s;
    });
    setStages(updated);
    const updatedProject = {...project,workflowStages:updated};
    const done = updated.filter(s=>s.status==="completed").length;
    updatedProject.progressPercentage = Math.round((done/updated.length)*100);
    if (done===updated.length) updatedProject.overallStatus="Completed";
    onUpdateProject(updatedProject);
    showToast(`✅ Stage "${stageName}" updated successfully!`);
  };

  const pct = Math.round((stages.filter(s=>s.status==="completed").length/stages.length)*100);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px", position:"relative" }}>
      {toast && (
        <div style={{ position:"fixed", top:"24px", right:"24px", zIndex:50, background:"linear-gradient(135deg,#13132b,#1e1040)", color:"rgba(255,255,255,0.95)", fontSize:"12px", fontWeight:700, padding:"12px 20px", borderRadius:"16px", boxShadow:"0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(124,58,237,0.3)", border:"1px solid rgba(167,139,250,0.3)" }}>
          {toast}
        </div>
      )}

      {/* Back + Header */}
      <div style={{ ...card, padding:"20px", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={onBack} style={{ padding:"8px", borderRadius:"12px", border:"1px solid rgba(167,139,250,0.2)", background:"rgba(167,139,250,0.06)", cursor:"pointer", display:"flex", alignItems:"center", transition:"all 0.18s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.4)";e.currentTarget.style.background="rgba(167,139,250,0.12)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.2)";e.currentTarget.style.background="rgba(167,139,250,0.06)";}}>
            <ChevronLeft size={16} style={{ color:"rgba(196,181,253,0.7)" }}/>
          </button>
          <div>
            <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.15em" }}>Project Details</div>
            <h2 style={{ fontSize:"15px", fontWeight:900, color:"rgba(255,255,255,0.92)", marginTop:"2px", lineHeight:1.3 }}>{project.name}</h2>
            <p style={{ fontSize:"11px", color:"rgba(167,139,250,0.5)", marginTop:"2px" }}>{project.state} · {project.district} · {project.type}</p>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:"11px", fontWeight:700, color:"rgba(167,139,250,0.55)" }}>Overall Progress</p>
            <p style={{ fontSize:"24px", fontWeight:900, color:"#a78bfa" }}>{pct}%</p>
          </div>
          <div style={{ width:"60px", height:"60px" }}>
            <svg viewBox="0 0 40 40" style={{ width:"100%", height:"100%", transform:"rotate(-90deg)" }}>
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="4"/>
              <circle cx="20" cy="20" r="16" fill="none" stroke="#7c3aed" strokeWidth="4"
                strokeDasharray={`${(pct/100)*100.53} 100.53`} strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"10px" }}>
        {[
          { label:"Land Proposed",      value:`${project.landProposedAcres} ac`,        color:"rgba(255,255,255,0.88)" },
          { label:"Land Acquired",      value:`${project.landAcquiredAcres} ac`,        color:"#34d399" },
          { label:"Comp. Assessed",     value:`₹${project.compensationAssessedCr} Cr`,  color:"#7dd3fc" },
          { label:"Comp. Paid",         value:`₹${project.compensationPaidCr} Cr`,      color:"#a78bfa" },
          { label:"Affected Families",  value:project.affectedFamiliesCount,             color:"#c4b5fd" },
          { label:"R&R Completed",      value:`${project.rrCompletedCount}/${project.affectedFamiliesCount}`, color:"#34d399" },
        ].map((k,i)=>(
          <div key={i} style={{ ...card, padding:"14px" }}>
            <p style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.1em" }}>{k.label}</p>
            <p style={{ fontSize:"17px", fontWeight:900, marginTop:"4px", color:k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Workflow Timeline */}
      <div style={{ ...card, padding:"22px" }}>
        <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"22px", display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ width:"4px", height:"18px", background:"linear-gradient(#a78bfa,#7c3aed)", borderRadius:"2px", display:"inline-block" }}/>
          Acquisition Workflow Timeline
        </h3>
        <div style={{ display:"flex", flexDirection:"column" }}>
          {stages.map((stage,idx)=>{
            const cfg = stageCfgDark[stage.status] || stageCfgDark.pending;
            const StageIcon = STAGE_CONFIG[stage.status]?.icon || Clock;
            const isLast = idx===stages.length-1;
            const canAct = (stage.status==="inprogress"||stage.status==="pending") && ACTION_MAP[stage.name];
            return (
              <div key={idx} style={{ display:"flex", gap:"14px" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:`2px solid ${cfg.dotColor}`, background:"#0f0f24", zIndex:1, boxShadow:`0 0 10px ${cfg.dotColor}40` }}>
                    <StageIcon size={13} style={{ color:cfg.dotColor }}/>
                  </div>
                  {!isLast && <div style={{ width:"2px", flex:1, background:cfg.lineColor, margin:"4px 0" }}/>}
                </div>
                <div style={{ flex:1, paddingBottom:"20px" }}>
                  <div style={{ display:"flex", flexDirection:"row", alignItems:"flex-start", gap:"12px", flexWrap:"wrap" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                        <h4 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.88)" }}>{stage.name}</h4>
                        <span style={{ padding:"2px 10px", fontSize:"9px", fontWeight:700, borderRadius:"99px", background:cfg.badgeBg, color:cfg.badgeText, border:`1px solid ${cfg.badgeBorder}` }}>{STAGE_CONFIG[stage.status]?.label||"Pending"}</span>
                        {stage.status==="delayed" && <span style={{ fontSize:"10px", color:"#f87171", fontWeight:700 }}>⚠️ OVERDUE</span>}
                      </div>
                      <div style={{ marginTop:"4px", display:"flex", flexWrap:"wrap", gap:"12px", fontSize:"10px", color:"rgba(167,139,250,0.5)" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:"4px" }}><Users size={9}/> {stage.authority}</span>
                        {stage.date && <span style={{ display:"flex", alignItems:"center", gap:"4px" }}><Clock size={9}/> {stage.date}</span>}
                      </div>
                      {stage.remarks && (
                        <p style={{ marginTop:"6px", fontSize:"11px", color:"rgba(167,139,250,0.65)", background:"rgba(167,139,250,0.06)", borderRadius:"10px", padding:"8px 12px", border:"1px solid rgba(167,139,250,0.1)" }}>{stage.remarks}</p>
                      )}
                    </div>
                    {canAct && (
                      <button onClick={()=>handleAction(stage.name,idx)}
                        style={{ flexShrink:0, padding:"7px 14px", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", color:"white", fontWeight:700, fontSize:"11px", borderRadius:"10px", border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(124,58,237,0.4)", transition:"all 0.2s" }}
                        onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 20px rgba(167,139,250,0.5)";e.currentTarget.style.transform="translateY(-1px)";}}
                        onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 4px 14px rgba(124,58,237,0.4)";e.currentTarget.style.transform="none";}}>
                        {ACTION_MAP[stage.name].label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parcels Table */}
      {project.parcels && project.parcels.length>0 && (
        <div style={{ ...card, padding:"20px" }}>
          <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ width:"4px", height:"18px", background:"linear-gradient(#fbbf24,#f97316)", borderRadius:"2px", display:"inline-block" }}/>
            Land Parcels ({project.parcels.length})
          </h3>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
              <thead style={{ background:"rgba(167,139,250,0.06)" }}>
                <tr>
                  {["Parcel ID","Survey No.","Village","Owner","Area (ac)","Compensation","Possession","R&R","Risk"].map(h=>(
                    <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.55)", textTransform:"uppercase", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {project.parcels.map(parcel=>(
                  <tr key={parcel.id}
                    style={{ borderTop:"1px solid rgba(167,139,250,0.07)", cursor:"pointer", transition:"background 0.15s" }}
                    onClick={()=>setActiveParcel(activeParcel?.id===parcel.id?null:parcel)}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(167,139,250,0.05)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"10px 12px", fontFamily:"monospace", fontWeight:700, color:"rgba(167,139,250,0.7)" }}>{parcel.id}</td>
                    <td style={{ padding:"10px 12px", color:"rgba(167,139,250,0.6)" }}>{parcel.surveyNo}</td>
                    <td style={{ padding:"10px 12px", color:"rgba(167,139,250,0.6)" }}>{parcel.village}</td>
                    <td style={{ padding:"10px 12px", fontWeight:600, color:"rgba(255,255,255,0.75)", maxWidth:"140px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={parcel.owner}>{parcel.owner}</td>
                    <td style={{ padding:"10px 12px", fontWeight:700, color:"rgba(255,255,255,0.85)" }}>{parcel.areaAcres}</td>
                    <td style={{ padding:"10px 12px" }}>
                      <span style={{ padding:"2px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:parcel.compensationStatus==="Paid"?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.12)", color:parcel.compensationStatus==="Paid"?"#34d399":"#fbbf24" }}>{parcel.compensationStatus}</span>
                    </td>
                    <td style={{ padding:"10px 12px" }}>
                      <span style={{ padding:"2px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:parcel.possessionStatus==="Completed"?"rgba(16,185,129,0.15)":"rgba(167,139,250,0.08)", color:parcel.possessionStatus==="Completed"?"#34d399":"rgba(167,139,250,0.5)" }}>{parcel.possessionStatus}</span>
                    </td>
                    <td style={{ padding:"10px 12px" }}>
                      <span style={{ padding:"2px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:parcel.rrStatus==="Completed"?"rgba(16,185,129,0.15)":parcel.rrStatus==="In Progress"?"rgba(56,189,248,0.12)":"rgba(167,139,250,0.08)", color:parcel.rrStatus==="Completed"?"#34d399":parcel.rrStatus==="In Progress"?"#38bdf8":"rgba(167,139,250,0.5)" }}>{parcel.rrStatus}</span>
                    </td>
                    <td style={{ padding:"10px 12px" }}>
                      <span style={{ padding:"2px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:parcel.risk==="HIGH"?"rgba(239,68,68,0.15)":"rgba(167,139,250,0.08)", color:parcel.risk==="HIGH"?"#f87171":"rgba(167,139,250,0.5)" }}>{parcel.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeParcel && (
            <div style={{ marginTop:"14px", padding:"14px", background:"rgba(167,139,250,0.06)", border:"1px solid rgba(167,139,250,0.15)", borderRadius:"12px", fontSize:"12px", display:"flex", flexDirection:"column", gap:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <p style={{ fontWeight:700, color:"rgba(255,255,255,0.88)" }}>Parcel {activeParcel.id} – Detail View</p>
                <button onClick={()=>setActiveParcel(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(167,139,250,0.5)", display:"flex" }}><XCircle size={14}/></button>
              </div>
              {activeParcel.dispute && (
                <div style={{ display:"flex", alignItems:"flex-start", gap:"8px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:"10px", padding:"10px 12px", fontSize:"12px", color:"#f87171" }}>
                  <AlertTriangle size={13} style={{ flexShrink:0, marginTop:"1px" }}/>
                  <span><strong>Dispute:</strong> {activeParcel.dispute}</span>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", color:"rgba(196,181,253,0.7)" }}>
                <span>Families: <strong style={{color:"rgba(255,255,255,0.88)"}}>{activeParcel.familiesCount}</strong></span>
                <span>Award: <strong style={{color:"rgba(255,255,255,0.88)"}}>{activeParcel.awardStatus}</strong></span>
                <span>Notification: <strong style={{color:"rgba(255,255,255,0.88)"}}>{activeParcel.notificationStatus}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit Trail */}
      {project.auditTrail && project.auditTrail.length>0 && (
        <div style={{ ...card, padding:"20px" }}>
          <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ width:"4px", height:"18px", background:"linear-gradient(rgba(167,139,250,0.6),rgba(124,58,237,0.4))", borderRadius:"2px", display:"inline-block" }}/>
            Audit Trail
          </h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {project.auditTrail.map((log,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", padding:"12px", background:"rgba(167,139,250,0.05)", borderRadius:"12px", border:"1px solid rgba(167,139,250,0.09)", fontSize:"12px" }}>
                <div style={{ width:"28px", height:"28px", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", borderRadius:"9px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:"11px", flexShrink:0 }}>{log.user.slice(0,1)}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", marginBottom:"2px" }}>
                    <span style={{ fontWeight:700, color:"rgba(196,181,253,0.8)" }}>{log.user}</span>
                    <span style={{ color:"rgba(167,139,250,0.45)" }}>{log.timestamp}</span>
                  </div>
                  <p style={{ color:"rgba(220,210,255,0.75)", fontWeight:600 }}>{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

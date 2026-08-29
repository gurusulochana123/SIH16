import React, { useState } from "react";
import { ChevronRight, CheckCircle2, Upload, FileText } from "lucide-react";

const STATES = ["Andhra Pradesh","Telangana","Maharashtra","Karnataka","Tamil Nadu","Gujarat","Rajasthan","Uttar Pradesh","Bihar","Madhya Pradesh"];
const TYPES   = ["Highway","Railway","Urban Transit","Industrial","Irrigation","Renewable Energy","Defense","Urban Development"];
const STEPS   = [{ num:1,label:"Project Details" },{ num:2,label:"Land & Families" },{ num:3,label:"Documents & Submit" }];

const card = { background:"#0f0f24", borderRadius:"16px", border:"1px solid rgba(167,139,250,0.12)", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" };
const inputStyle = { width:"100%", border:"1px solid rgba(167,139,250,0.2)", borderRadius:"12px", padding:"10px 14px", fontSize:"13px", background:"rgba(167,139,250,0.05)", outline:"none", transition:"all 0.2s", boxSizing:"border-box", color:"rgba(255,255,255,0.88)", fontFamily:"inherit" };
const labelStyle = { display:"block", fontSize:"10px", fontWeight:700, color:"rgba(167,139,250,0.55)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"6px" };

export default function AddProject({ onSubmit, onCancel }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name:"", type:"Highway", state:"Andhra Pradesh", district:"", requiringBody:"", ministry:"", agency:"",
    landRequired:"", parcels:"", affectedFamilies:"", estimatedComp:"", priority:"High",
    dprUploaded:false, siaUploaded:false, mapUploaded:false, agreedTerms:false,
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f=>({...f,[key]:val}));

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())            e.name          = "Project name is required";
    if (!form.district.trim())        e.district      = "District is required";
    if (!form.requiringBody.trim())   e.requiringBody = "Requiring body is required";
    if (!form.ministry.trim())        e.ministry      = "Ministry is required";
    if (!form.agency.trim())          e.agency        = "Implementing agency is required";
    setErrors(e); return Object.keys(e).length===0;
  };
  const validateStep2 = () => {
    const e = {};
    if (!form.landRequired||isNaN(+form.landRequired))         e.landRequired     = "Enter a valid acreage";
    if (!form.parcels||isNaN(+form.parcels))                   e.parcels          = "Enter a valid number";
    if (!form.affectedFamilies||isNaN(+form.affectedFamilies)) e.affectedFamilies = "Enter a valid number";
    if (!form.estimatedComp||isNaN(+form.estimatedComp))       e.estimatedComp    = "Enter a valid amount";
    setErrors(e); return Object.keys(e).length===0;
  };

  const nextStep = () => {
    if (step===1 && !validateStep1()) return;
    if (step===2 && !validateStep2()) return;
    setStep(s=>s+1);
  };

  const handleSubmit = () => {
    if (!form.agreedTerms) { alert("Please agree to the declaration to submit."); return; }
    setSubmitted(true);
    setTimeout(()=>{
      onSubmit({
        id:`PRJ-NEW-${Date.now()}`, name:form.name,
        shortName:form.name.slice(0,8).toUpperCase().replace(/\s/g,"-"),
        type:form.type, state:form.state, district:form.district,
        requiringBody:form.requiringBody, ministry:form.ministry, implementingAgency:form.agency, priority:form.priority,
        landProposedAcres:+form.landRequired, landAcquiredAcres:0, progressPercentage:0,
        compensationAssessedCr:+form.estimatedComp, compensationPaidCr:0,
        affectedFamiliesCount:+form.affectedFamilies, displacedFamiliesCount:0, rrCompletedCount:0,
        overallStatus:"On Track",
        workflowStages:[
          { name:"Proposal Submitted",    status:"completed", date:new Date().toISOString().slice(0,10), authority:form.agency, remarks:"Proposal submitted via NLAMS portal" },
          { name:"District Verification", status:"pending", date:null, authority:`Collector, ${form.district}`, remarks:"" },
          { name:"State Approval",        status:"pending", date:null, authority:`Govt. of ${form.state}`, remarks:"" },
          { name:"Notification (Sec 11)", status:"pending", date:null, authority:"District Collector", remarks:"" },
          { name:"Land Survey",           status:"pending", date:null, authority:"Survey Department", remarks:"" },
          { name:"Award Declaration",     status:"pending", date:null, authority:"LAC", remarks:"" },
          { name:"Compensation Payment",  status:"pending", date:null, authority:"Treasury", remarks:"" },
          { name:"Land Possession",       status:"pending", date:null, authority:"District Collector", remarks:"" },
          { name:"R&R Completion",        status:"pending", date:null, authority:"SLAO", remarks:"" },
          { name:"Project Completed",     status:"pending", date:null, authority:"Ministry", remarks:"" },
        ],
        lifecycleBreakdown:{notifications:0,awards:0,compensation:0,rr:0,possession:0},
        attentionRequired:{compensationDelay:0,documentMismatch:0,rrPending:0,milestoneApproaching:+form.parcels},
        parcels:[], documents:[],
        auditTrail:[{id:`AUD-NEW-01`,timestamp:new Date().toLocaleString(),user:"System",action:"Proposal submitted via NLAMS online portal"}],
      });
    },600);
  };

  if (submitted) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:"24px" }}>
        <div style={{ width:"88px", height:"88px", background:"rgba(16,185,129,0.15)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 40px rgba(16,185,129,0.3)", border:"2px solid rgba(16,185,129,0.4)" }}>
          <CheckCircle2 style={{ color:"#34d399", width:"44px", height:"44px" }}/>
        </div>
        <div style={{ textAlign:"center" }}>
          <h2 style={{ fontSize:"22px", fontWeight:900, color:"rgba(255,255,255,0.92)", marginBottom:"8px" }}>Proposal Submitted Successfully!</h2>
          <p style={{ fontSize:"13px", color:"rgba(167,139,250,0.6)", maxWidth:"420px" }}>
            Your project proposal for <strong style={{color:"rgba(255,255,255,0.85)"}}>"{form.name}"</strong> has been submitted.
            Status: <span style={{color:"#fbbf24",fontWeight:700}}>Pending District Verification</span>.
          </p>
        </div>
        <div style={{ ...card, padding:"20px", width:"100%", maxWidth:"420px", fontSize:"12px" }}>
          <p style={{ fontWeight:700, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", fontSize:"9px", letterSpacing:"0.12em", marginBottom:"12px" }}>Submission Summary</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {[
              ["Project Name",form.name],["Type",form.type],[`State / District`,`${form.state} / ${form.district}`],
              ["Land Required",`${form.landRequired} acres`],["Affected Families",form.affectedFamilies],
              ["Est. Compensation",`₹${form.estimatedComp} Cr`],["Status","Pending Verification"],
            ].map(([k,v],i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", color:"rgba(167,139,250,0.6)" }}>
                <span>{k}</span>
                <strong style={{color:k==="Status"?"#fbbf24":"rgba(255,255,255,0.88)"}}>{v}</strong>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onCancel}
          style={{ background:"linear-gradient(135deg,#5b21b6,#7c3aed)", color:"white", fontWeight:700, padding:"10px 24px", borderRadius:"14px", border:"none", cursor:"pointer", fontSize:"13px", boxShadow:"0 4px 16px rgba(124,58,237,0.4)" }}>
          Back to Projects
        </button>
      </div>
    );
  }

  const ErrMsg = ({field}) => errors[field]
    ? <p style={{ color:"#f87171", fontSize:"10px", fontWeight:700, marginTop:"4px" }}>{errors[field]}</p>
    : null;

  const inputFocus = (e) => { e.target.style.borderColor="rgba(167,139,250,0.5)"; e.target.style.background="rgba(167,139,250,0.1)"; e.target.style.boxShadow="0 0 0 3px rgba(124,58,237,0.15)"; };
  const inputBlur  = (e) => { e.target.style.borderColor="rgba(167,139,250,0.2)"; e.target.style.background="rgba(167,139,250,0.05)"; e.target.style.boxShadow="none"; };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px", maxWidth:"760px", margin:"0 auto" }}>
      <style>{`
        .add-select option { background: #0f0f24; color: rgba(255,255,255,0.88); }
      `}</style>

      {/* Header */}
      <div style={{ ...card, padding:"20px" }}>
        <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.15em" }}>Project Management</div>
        <h2 style={{ fontSize:"18px", fontWeight:900, color:"rgba(255,255,255,0.92)", margin:"2px 0 0" }}>Submit New Project Proposal</h2>
        <p style={{ fontSize:"11px", color:"rgba(167,139,250,0.5)", marginTop:"2px" }}>Complete all steps to submit a land acquisition proposal to NLAMS.</p>
      </div>

      {/* Stepper */}
      <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
        {STEPS.map((s,i)=>(
          <React.Fragment key={s.num}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"9px 16px", borderRadius:"12px", fontSize:"12px", fontWeight:700, transition:"all 0.2s",
              background:step===s.num?"linear-gradient(135deg,#5b21b6,#7c3aed)":step>s.num?"rgba(16,185,129,0.15)":"rgba(167,139,250,0.06)",
              border:step===s.num?"none":step>s.num?"1px solid rgba(16,185,129,0.3)":"1px solid rgba(167,139,250,0.12)",
              color:step===s.num?"white":step>s.num?"#34d399":"rgba(167,139,250,0.45)",
              boxShadow:step===s.num?"0 4px 14px rgba(124,58,237,0.4)":"none" }}>
              <div style={{ width:"20px", height:"20px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:900,
                background:step>s.num?"#10b981":step===s.num?"rgba(255,255,255,0.2)":"rgba(167,139,250,0.1)",
                color:step>s.num?"white":step===s.num?"white":"rgba(167,139,250,0.5)" }}>
                {step>s.num?"✓":s.num}
              </div>
              {s.label}
            </div>
            {i<STEPS.length-1 && <ChevronRight size={15} style={{ color:"rgba(167,139,250,0.25)", flexShrink:0 }}/>}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div style={{ ...card, padding:"24px" }}>

        {/* STEP 1 */}
        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
            <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.88)", borderBottom:"1px solid rgba(167,139,250,0.1)", paddingBottom:"10px", display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ width:"4px", height:"16px", background:"linear-gradient(#a78bfa,#7c3aed)", borderRadius:"2px", display:"inline-block" }}/>
              Step 1: Project Details
            </h3>
            <div>
              <label style={labelStyle}>Project Name *</label>
              <input type="text" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. National Highway AP-01 Extension" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} className="add-select"/>
              <ErrMsg field="name"/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
              <div>
                <label style={labelStyle}>Project Type *</label>
                <select value={form.type} onChange={e=>set("type",e.target.value)} style={inputStyle} className="add-select" onFocus={inputFocus} onBlur={inputBlur}>
                  {TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select value={form.priority} onChange={e=>set("priority",e.target.value)} style={inputStyle} className="add-select" onFocus={inputFocus} onBlur={inputBlur}>
                  {["High","Medium","Low"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
              <div>
                <label style={labelStyle}>State *</label>
                <select value={form.state} onChange={e=>set("state",e.target.value)} style={inputStyle} className="add-select" onFocus={inputFocus} onBlur={inputBlur}>
                  {STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>District *</label>
                <input type="text" value={form.district} onChange={e=>set("district",e.target.value)} placeholder="e.g. Kurnool" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
                <ErrMsg field="district"/>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Land Requiring Body *</label>
              <input type="text" value={form.requiringBody} onChange={e=>set("requiringBody",e.target.value)} placeholder="e.g. NHAI, DFCCIL, HMDA..." style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
              <ErrMsg field="requiringBody"/>
            </div>
            <div>
              <label style={labelStyle}>Sponsoring Ministry *</label>
              <input type="text" value={form.ministry} onChange={e=>set("ministry",e.target.value)} placeholder="e.g. Ministry of Road Transport & Highways" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
              <ErrMsg field="ministry"/>
            </div>
            <div>
              <label style={labelStyle}>Implementing Agency *</label>
              <input type="text" value={form.agency} onChange={e=>set("agency",e.target.value)} placeholder="e.g. NHAI Regional Office, Hyderabad" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
              <ErrMsg field="agency"/>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
            <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.88)", borderBottom:"1px solid rgba(167,139,250,0.1)", paddingBottom:"10px", display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ width:"4px", height:"16px", background:"linear-gradient(#fbbf24,#f97316)", borderRadius:"2px", display:"inline-block" }}/>
              Step 2: Land & Family Details
            </h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
              <div>
                <label style={labelStyle}>Total Land Required (Acres) *</label>
                <input type="number" value={form.landRequired} onChange={e=>set("landRequired",e.target.value)} placeholder="e.g. 1250" style={inputStyle} min="1" onFocus={inputFocus} onBlur={inputBlur}/>
                <ErrMsg field="landRequired"/>
              </div>
              <div>
                <label style={labelStyle}>Number of Land Parcels *</label>
                <input type="number" value={form.parcels} onChange={e=>set("parcels",e.target.value)} placeholder="e.g. 45" style={inputStyle} min="1" onFocus={inputFocus} onBlur={inputBlur}/>
                <ErrMsg field="parcels"/>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
              <div>
                <label style={labelStyle}>Total Affected Families *</label>
                <input type="number" value={form.affectedFamilies} onChange={e=>set("affectedFamilies",e.target.value)} placeholder="e.g. 24" style={inputStyle} min="0" onFocus={inputFocus} onBlur={inputBlur}/>
                <ErrMsg field="affectedFamilies"/>
              </div>
              <div>
                <label style={labelStyle}>Estimated Compensation (₹ Crore) *</label>
                <input type="number" value={form.estimatedComp} onChange={e=>set("estimatedComp",e.target.value)} placeholder="e.g. 850" style={inputStyle} min="0" onFocus={inputFocus} onBlur={inputBlur}/>
                <ErrMsg field="estimatedComp"/>
              </div>
            </div>
            {form.landRequired && form.affectedFamilies && (
              <div style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(167,139,250,0.25)", borderRadius:"12px", padding:"14px 16px", fontSize:"12px", color:"rgba(196,181,253,0.8)" }}>
                <p style={{ fontWeight:700, marginBottom:"6px", color:"#c4b5fd" }}>📊 Quick Summary</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                  <span>Land Density: <strong style={{color:"rgba(255,255,255,0.88)"}}>{(+form.landRequired/Math.max(+form.affectedFamilies,1)).toFixed(1)} acres/family</strong></span>
                  <span>Comp per Acre: <strong style={{color:"rgba(255,255,255,0.88)"}}>₹{form.estimatedComp?((+form.estimatedComp*100)/+form.landRequired).toFixed(1):"—"} L</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step===3 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
            <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.88)", borderBottom:"1px solid rgba(167,139,250,0.1)", paddingBottom:"10px", display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ width:"4px", height:"16px", background:"linear-gradient(#34d399,#10b981)", borderRadius:"2px", display:"inline-block" }}/>
              Step 3: Documents & Submit
            </h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {[
                { key:"dprUploaded", label:"Detailed Project Report (DPR)", req:true  },
                { key:"siaUploaded", label:"Social Impact Assessment (SIA)", req:true  },
                { key:"mapUploaded", label:"Cadastral / Land Boundary Maps",  req:false },
              ].map(doc=>(
                <div key={doc.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", border:`1px solid ${form[doc.key]?"rgba(16,185,129,0.3)":"rgba(167,139,250,0.12)"}`, borderRadius:"13px", background:form[doc.key]?"rgba(16,185,129,0.06)":"rgba(167,139,250,0.04)", transition:"all 0.2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                    <div style={{ width:"36px", height:"36px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", background:form[doc.key]?"rgba(16,185,129,0.15)":"rgba(167,139,250,0.1)", border:`1px solid ${form[doc.key]?"rgba(16,185,129,0.3)":"rgba(167,139,250,0.15)"}` }}>
                      {form[doc.key]
                        ? <CheckCircle2 size={17} style={{color:"#34d399"}}/>
                        : <FileText size={17} style={{color:"rgba(167,139,250,0.5)"}}/>}
                    </div>
                    <div>
                      <p style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.85)" }}>{doc.label}</p>
                      <p style={{ fontSize:"10px", color:"rgba(167,139,250,0.45)" }}>{doc.req?"Required":"Optional"}</p>
                    </div>
                  </div>
                  <button type="button" onClick={()=>set(doc.key,!form[doc.key])}
                    style={{ display:"flex", alignItems:"center", gap:"6px", padding:"7px 14px", borderRadius:"10px", fontSize:"11px", fontWeight:700, cursor:"pointer", transition:"all 0.15s", border:`1px solid ${form[doc.key]?"rgba(16,185,129,0.4)":"rgba(167,139,250,0.3)"}`, background:form[doc.key]?"rgba(16,185,129,0.15)":"rgba(124,58,237,0.2)", color:form[doc.key]?"#34d399":"#c4b5fd" }}>
                    {form[doc.key] ? <><CheckCircle2 size={12}/> Uploaded</> : <><Upload size={12}/> Upload</>}
                  </button>
                </div>
              ))}
            </div>

            {/* Review Summary */}
            <div style={{ background:"rgba(167,139,250,0.05)", border:"1px solid rgba(167,139,250,0.12)", borderRadius:"13px", padding:"16px", fontSize:"12px" }}>
              <p style={{ fontWeight:700, color:"rgba(167,139,250,0.55)", textTransform:"uppercase", fontSize:"9px", letterSpacing:"0.12em", marginBottom:"12px" }}>Proposal Review Summary</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", color:"rgba(167,139,250,0.6)" }}>
                {[["Name",form.name||"—"],["Type",form.type],["State",form.state],["District",form.district||"—"],["Land",`${form.landRequired||"—"} acres`],["Families",form.affectedFamilies||"—"],["Est. Comp",`₹${form.estimatedComp||"—"} Cr`],["Priority",form.priority]].map(([k,v])=>(
                  <span key={k}>{k}: <strong style={{color:"rgba(255,255,255,0.85)"}}>{v}</strong></span>
                ))}
              </div>
            </div>

            {/* Declaration */}
            <label style={{ display:"flex", alignItems:"flex-start", gap:"12px", cursor:"pointer", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:"13px", padding:"14px 16px" }}>
              <input type="checkbox" checked={form.agreedTerms} onChange={e=>set("agreedTerms",e.target.checked)} style={{ marginTop:"2px", width:"16px", height:"16px", accentColor:"#a78bfa", cursor:"pointer", flexShrink:0 }}/>
              <span style={{ fontSize:"11px", color:"rgba(251,191,36,0.8)", fontWeight:600, lineHeight:1.6 }}>
                I hereby declare that all information provided in this proposal is true and correct to the best of my knowledge, and the required land acquisition documents have been uploaded in accordance with RFCTLARR Act, 2013.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display:"flex", justifyContent:"space-between", gap:"12px" }}>
        <button onClick={step===1?onCancel:()=>setStep(s=>s-1)}
          style={{ padding:"10px 20px", border:"1px solid rgba(167,139,250,0.2)", borderRadius:"12px", fontSize:"13px", fontWeight:700, color:"rgba(167,139,250,0.6)", background:"rgba(167,139,250,0.06)", cursor:"pointer", transition:"all 0.18s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.4)";e.currentTarget.style.color="rgba(196,181,253,0.9)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.2)";e.currentTarget.style.color="rgba(167,139,250,0.6)";}}>
          {step===1?"Cancel":"← Back"}
        </button>
        {step<3 ? (
          <button onClick={nextStep}
            style={{ padding:"10px 22px", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", color:"white", fontWeight:700, borderRadius:"12px", border:"none", fontSize:"13px", cursor:"pointer", boxShadow:"0 4px 16px rgba(124,58,237,0.4)", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 24px rgba(167,139,250,0.5)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(124,58,237,0.4)";e.currentTarget.style.transform="none";}}>
            Next Step →
          </button>
        ) : (
          <button onClick={handleSubmit}
            style={{ padding:"10px 22px", background:"linear-gradient(135deg,#065f46,#10b981)", color:"white", fontWeight:700, borderRadius:"12px", border:"none", fontSize:"13px", cursor:"pointer", boxShadow:"0 4px 16px rgba(16,185,129,0.4)", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 24px rgba(52,211,153,0.5)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(16,185,129,0.4)";e.currentTarget.style.transform="none";}}>
            Submit Proposal ✓
          </button>
        )}
      </div>
    </div>
  );
}

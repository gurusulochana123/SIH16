import React, { useState } from "react";
import { Eye, EyeOff, ChevronRight, Shield, Globe } from "lucide-react";

const ROLES = [
  { value: "central",  label: "Central Ministry Officer",   icon: "🏧", desc: "MoRD – LACC National Admin" },
  { value: "state",    label: "State Authority",            icon: "🗺️", desc: "State Land Acquisition Authority"  },
  { value: "district", label: "District Officer",           icon: "🏢", desc: "District Collector / LAC"           },
  { value: "agency",   label: "Project Implementing Agency",icon: "🏗️", desc: "Project Authority / NHAI / DFCCIL"  },
  { value: "field",    label: "Field Verification Officer", icon: "📍", desc: "Field Survey & Geo-Tagging Team"     },
];
const DEMO_CREDS = {
  central:  { email: "mohua@gov.in",       pass: "admin@123" },
  state:    { email: "collector@ap.gov.in", pass: "state@123" },
  district: { email: "lac@kurnool.gov.in", pass: "dist@123"  },
  agency:   { email: "nhai@gov.in",        pass: "nhai@123"  },
  field:    { email: "field@gov.in",        pass: "field@123" },
};

export default function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState("mohua@gov.in");
  const [password, setPassword] = useState("admin@123");
  const [role,     setRole]     = useState("central");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const pick = (r) => {
    setRole(r);
    setEmail(DEMO_CREDS[r].email);
    setPassword(DEMO_CREDS[r].pass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, role, roleName: ROLES.find(r => r.value === role).label });
    }, 950);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 40%,#0f2027 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative", overflow: "hidden", fontFamily: "'Inter',sans-serif" }}>

      {/* Decorative blobs */}
      <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle,rgba(249,115,22,0.18) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-80px", left:"-80px", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"50%", left:"30%", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:"1000px", display:"grid", gridTemplateColumns:"1fr 1fr", borderRadius:"24px", overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.5)", position:"relative", zIndex:1 }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ background:"linear-gradient(160deg,#1e3a8a 0%,#4f46e5 55%,#7c3aed 100%)", padding:"40px", display:"flex", flexDirection:"column", justifyContent:"space-between", color:"white", minHeight:"580px" }}>
          {/* Logo */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"32px" }}>
              <div style={{ width:"56px", height:"56px", borderRadius:"16px", background:"linear-gradient(135deg,#f59e0b,#ef4444,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 4px 20px rgba(0,0,0,0.3)" }}>🗺️</div>
              <div>
                <div style={{ fontSize:"10px", fontWeight:800, color:"rgba(255,255,255,0.6)", letterSpacing:"0.2em", textTransform:"uppercase" }}>Government of India</div>
                <div style={{ fontSize:"18px", fontWeight:900, color:"white", letterSpacing:"-0.5px", lineHeight:"1.2" }}>Land Acquisition</div>
                <div style={{ fontSize:"18px", fontWeight:900, color:"#FCD34D", letterSpacing:"-0.5px", lineHeight:"1.2" }}>Command Centre</div>
                <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.5)", letterSpacing:"0.06em", marginTop:"3px" }}>Ministry of Rural Development · Govt. of India</div>
              </div>
            </div>

            <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:"16px", padding:"20px", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)", marginBottom:"28px" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(249,115,22,0.2)", border:"1px solid rgba(249,115,22,0.4)", borderRadius:"99px", padding:"4px 14px", marginBottom:"14px" }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#f97316", animation:"pulse 2s infinite" }} />
                <span style={{ fontSize:"10px", fontWeight:700, color:"#fed7aa", letterSpacing:"0.12em", textTransform:"uppercase" }}>Digital India Initiative</span>
              </div>
              <h2 style={{ fontSize:"22px", fontWeight:900, color:"white", lineHeight:1.25, marginBottom:"10px" }}>
                Land Acquisition &<br/>Command Centre (LACC)
              </h2>
              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}>
                End-to-end digital platform for land acquisition lifecycle — from project proposal to final possession, seamlessly connecting Central Ministries, State Governments, and District Authorities.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
              {[
                { val:"15",    label:"Active Projects" },
                { val:"10",    label:"States Covered"  },
                { val:"₹7380", label:"Cr. Disbursed"   },
              ].map((s, i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"12px", padding:"12px", textAlign:"center" }}>
                  <div style={{ fontSize:"18px", fontWeight:900, color: i===0?"#fbbf24":i===1?"#34d399":"#f97316" }}>{s.val}</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.55)", marginTop:"2px", fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop:"24px", display:"flex", alignItems:"center", gap:"8px", fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>
            <Shield size={11} /> CERT-In Compliant · NIC MeghRaj Cloud · End-to-End Encrypted
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ background:"white", padding:"40px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
          <div>
            <h3 style={{ fontSize:"22px", fontWeight:900, color:"#0f172a", marginBottom:"4px" }}>Sign In to LACC</h3>
            <p style={{ fontSize:"12px", color:"#64748b", marginBottom:"24px" }}>Select your role and authenticate to access the portal.</p>

            {/* Role selector */}
            <div style={{ marginBottom:"20px" }}>
              <div style={{ fontSize:"10px", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"8px" }}>Your Role</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => pick(r.value)}
                    style={{
                      display:"flex", alignItems:"center", gap:"10px", padding:"9px 12px",
                      borderRadius:"12px", border:`2px solid ${role===r.value?"#6366f1":"#e2e8f0"}`,
                      background: role===r.value ? "linear-gradient(90deg,#eef2ff,#f5f3ff)" : "white",
                      cursor:"pointer", textAlign:"left", transition:"all 0.15s",
                    }}>
                    <span style={{ fontSize:"16px" }}>{r.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"12px", fontWeight:700, color: role===r.value?"#4338ca":"#334155" }}>{r.label}</div>
                      <div style={{ fontSize:"10px", color:"#94a3b8" }}>{r.desc}</div>
                    </div>
                    {role===r.value && (
                      <div style={{ width:"16px", height:"16px", borderRadius:"50%", background:"#6366f1", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"white" }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div>
                <div style={{ fontSize:"10px", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"6px" }}>User ID / Email</div>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width:"100%", border:"1.5px solid #e2e8f0", borderRadius:"12px", padding:"10px 14px", fontSize:"13px", background:"#f8fafc", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}
                  onFocus={e=>e.target.style.border="1.5px solid #6366f1"}
                  onBlur={e=>e.target.style.border="1.5px solid #e2e8f0"}
                />
              </div>

              <div>
                <div style={{ fontSize:"10px", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"6px" }}>Password</div>
                <div style={{ position:"relative" }}>
                  <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)}
                    style={{ width:"100%", border:"1.5px solid #e2e8f0", borderRadius:"12px", padding:"10px 40px 10px 14px", fontSize:"13px", background:"#f8fafc", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}
                    onFocus={e=>e.target.style.border="1.5px solid #6366f1"}
                    onBlur={e=>e.target.style.border="1.5px solid #e2e8f0"}
                  />
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", alignItems:"center" }}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width:"100%", padding:"12px", borderRadius:"12px", border:"none", cursor:"pointer",
                  background: loading ? "#a5b4fc" : "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  color:"white", fontWeight:800, fontSize:"14px", display:"flex", alignItems:"center",
                  justifyContent:"center", gap:"8px", boxShadow:"0 6px 20px rgba(99,102,241,0.35)",
                  transition:"all 0.2s", fontFamily:"inherit",
                }}>
                {loading ? (
                  <><div style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Authenticating...</>
                ) : (
                  <>Sign In to LACC <ChevronRight size={16}/></>
                )}
              </button>
            </form>
          </div>

          <div style={{ paddingTop:"20px", borderTop:"1px solid #f1f5f9", textAlign:"center", fontSize:"10px", color:"#94a3b8", lineHeight:"1.6" }}>
            LACC Prototype – Ministry of Rural Development, GoI<br/>
            For official access: nlams-support@rural.gov.in
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }
      `}</style>
    </div>
  );
}

import React, { useState } from "react";
import { Eye, EyeOff, ChevronRight, Shield } from "lucide-react";

const ROLES = [
  { value: "central",  label: "Central Ministry Officer",    icon: "🏧", desc: "MoRD – LACC National Admin" },
  { value: "state",    label: "State Authority",             icon: "🗺️", desc: "State Land Acquisition Authority" },
  { value: "district", label: "District Officer",            icon: "🏢", desc: "District Collector / LAC" },
  { value: "agency",   label: "Project Implementing Agency", icon: "🏗️", desc: "Project Authority / NHAI / DFCCIL" },
  { value: "field",    label: "Field Verification Officer",  icon: "📍", desc: "Field Survey & Geo-Tagging Team" },
];
const DEMO_CREDS = {
  central:  { email: "mohua@gov.in",       pass: "admin@123" },
  state:    { email: "collector@ap.gov.in", pass: "state@123" },
  district: { email: "lac@kurnool.gov.in", pass: "dist@123"  },
  agency:   { email: "nhai@gov.in",        pass: "nhai@123"  },
  field:    { email: "field@gov.in",        pass: "field@123" },
};

const S = {
  root: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse 80% 60% at 50% 0%, #1a0840 0%, #05050f 55%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "16px", position: "relative", overflow: "hidden",
    fontFamily: "'Inter','Outfit',sans-serif",
  },
  orb1: {
    position:"absolute", top:"-120px", right:"-100px",
    width:"500px", height:"500px", borderRadius:"50%",
    background:"radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
    animation:"orb-drift 12s ease-in-out infinite", pointerEvents:"none",
  },
  orb2: {
    position:"absolute", bottom:"-100px", left:"-80px",
    width:"420px", height:"420px", borderRadius:"50%",
    background:"radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)",
    animation:"orb-drift 16s ease-in-out infinite reverse", pointerEvents:"none",
  },
  orb3: {
    position:"absolute", top:"40%", left:"38%",
    width:"600px", height:"600px", borderRadius:"50%",
    background:"radial-gradient(circle, rgba(76,29,149,0.08) 0%, transparent 70%)",
    pointerEvents:"none",
  },
  grid: {
    width:"100%", maxWidth:"1040px",
    display:"grid", gridTemplateColumns:"1fr 1fr",
    borderRadius:"24px", overflow:"hidden",
    boxShadow:"0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.2)",
    border:"1px solid rgba(167,139,250,0.18)",
    position:"relative", zIndex:1, animation:"fade-up 0.6s ease both",
  },
};

export default function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState("mohua@gov.in");
  const [password, setPassword] = useState("admin@123");
  const [role,     setRole]     = useState("central");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState(null);
  const [errors,   setErrors]   = useState({});

  const pick = (r) => { setRole(r); setEmail(DEMO_CREDS[r].email); setPassword(DEMO_CREDS[r].pass); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!email.trim()) {
      e.email = "Email is required.";
    } else if (!email.toLowerCase().includes("gov.in")) {
      e.email = "Only official gov.in email addresses are permitted.";
    }
    if (!password) {
      e.password = "Password is required.";
    } else if (password.length < 8) {
      e.password = "Password must be at least 8 characters.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, role, roleName: ROLES.find(r => r.value === role).label });
    }, 950);
  };

  const inputStyle = (name) => ({
    width:"100%", border:`1.5px solid ${focused===name ? "rgba(167,139,250,0.7)" : "rgba(167,139,250,0.2)"}`,
    borderRadius:"12px", padding:"11px 14px", fontSize:"13px",
    background: focused===name ? "rgba(167,139,250,0.07)" : "rgba(255,255,255,0.04)",
    outline:"none", boxSizing:"border-box", fontFamily:"inherit",
    color:"rgba(255,255,255,0.92)",
    boxShadow: focused===name ? "0 0 0 3px rgba(167,139,250,0.12)" : "none",
    transition:"all 0.2s",
  });

  return (
    <div style={S.root}>
      {/* Animated orbs */}
      <div style={S.orb1} />
      <div style={S.orb2} />
      <div style={S.orb3} />

      {/* Floating particles */}
      {[...Array(12)].map((_,i) => (
        <div key={i} style={{
          position:"absolute",
          left: `${8 + (i * 7.5) % 90}%`,
          top:  `${10 + (i * 13) % 80}%`,
          width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
          borderRadius:"50%",
          background: i%3===0 ? "rgba(167,139,250,0.6)" : i%3===1 ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.15)",
          animation:`float ${4 + (i%4)}s ease-in-out ${i*0.4}s infinite`,
          pointerEvents:"none",
        }}/>
      ))}

      <div style={S.grid}>
        {/* ── LEFT PANEL ── */}
        <div style={{
          background:"linear-gradient(160deg,#120830 0%,#1e0f50 40%,#2d1068 70%,#1a0840 100%)",
          padding:"44px", display:"flex", flexDirection:"column",
          justifyContent:"space-between", color:"white", minHeight:"600px",
          position:"relative", overflow:"hidden",
        }}>
          {/* inner glow */}
          <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"300px", height:"300px", borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,0.18) 0%,transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:"-40px", left:"-40px", width:"220px", height:"220px", borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)", pointerEvents:"none" }}/>

          <div style={{ position:"relative", zIndex:1 }}>
            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"32px" }}>
              <div style={{
                width:"56px", height:"56px", borderRadius:"18px",
                background:"linear-gradient(135deg,#f59e0b,#ef4444,#7c3aed)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"28px", border:"1px solid rgba(255,255,255,0.2)",
                boxShadow:"0 4px 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.2)",
                animation:"pulse-glow 3s ease-in-out infinite",
              }}>🗺️</div>
              <div>
                <div style={{ fontSize:"10px", fontWeight:800, color:"rgba(196,181,253,0.7)", letterSpacing:"0.22em", textTransform:"uppercase" }}>Government of India</div>
                <div style={{ fontSize:"19px", fontWeight:900, color:"white", letterSpacing:"-0.5px", lineHeight:1.2 }}>Land Acquisition</div>
                <div style={{ fontSize:"19px", fontWeight:900, color:"#c4b5fd", letterSpacing:"-0.5px", lineHeight:1.2 }}>Command Centre</div>
                <div style={{ fontSize:"9px", color:"rgba(196,181,253,0.45)", letterSpacing:"0.06em", marginTop:"3px" }}>Ministry of Rural Development · Govt. of India</div>
              </div>
            </div>

            {/* Feature card */}
            <div style={{
              background:"rgba(167,139,250,0.08)", borderRadius:"18px", padding:"22px",
              backdropFilter:"blur(12px)", border:"1px solid rgba(167,139,250,0.2)",
              marginBottom:"28px", boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(124,58,237,0.25)", border:"1px solid rgba(167,139,250,0.3)", borderRadius:"99px", padding:"5px 14px", marginBottom:"14px" }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#a78bfa", animation:"pulse 2s infinite" }}/>
                <span style={{ fontSize:"10px", fontWeight:700, color:"#c4b5fd", letterSpacing:"0.12em", textTransform:"uppercase" }}>Digital India Initiative</span>
              </div>
              <h2 style={{ fontSize:"22px", fontWeight:900, color:"white", lineHeight:1.3, marginBottom:"12px" }}>
                Land Acquisition &<br/>Command Centre (LACC)
              </h2>
              <p style={{ fontSize:"12px", color:"rgba(196,181,253,0.75)", lineHeight:1.8 }}>
                End-to-end digital platform for land acquisition lifecycle — from project proposal to final possession, seamlessly connecting Central Ministries, State Governments, and District Authorities.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
              {[
                { val:"15",    label:"Active Projects", color:"#fbbf24" },
                { val:"10",    label:"States Covered",  color:"#34d399" },
                { val:"₹7380", label:"Cr. Disbursed",   color:"#a78bfa" },
              ].map((s,i) => (
                <div key={i} style={{
                  background:"rgba(167,139,250,0.07)", border:"1px solid rgba(167,139,250,0.18)",
                  borderRadius:"14px", padding:"14px", textAlign:"center",
                  transition:"all 0.2s",
                }}>
                  <div style={{ fontSize:"20px", fontWeight:900, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:"10px", color:"rgba(196,181,253,0.55)", marginTop:"3px", fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop:"24px", display:"flex", alignItems:"center", gap:"8px", fontSize:"10px", color:"rgba(167,139,250,0.4)", position:"relative", zIndex:1 }}>
            <Shield size={11}/> CERT-In Compliant · NIC MeghRaj Cloud · End-to-End Encrypted
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          background:"linear-gradient(160deg,#0c0c1e 0%,#0f0f26 100%)",
          padding:"44px", display:"flex", flexDirection:"column", justifyContent:"space-between",
          borderLeft:"1px solid rgba(167,139,250,0.12)",
        }}>
          <div>
            <h3 style={{ fontSize:"22px", fontWeight:900, color:"rgba(255,255,255,0.95)", marginBottom:"4px" }}>Sign In to LACC</h3>
            <p style={{ fontSize:"12px", color:"rgba(167,139,250,0.65)", marginBottom:"26px" }}>Select your role and authenticate to access the portal.</p>

            {/* Role selector */}
            <div style={{ marginBottom:"22px" }}>
              <div style={{ fontSize:"10px", fontWeight:700, color:"rgba(167,139,250,0.6)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"10px" }}>Your Role</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => pick(r.value)}
                    style={{
                      display:"flex", alignItems:"center", gap:"10px", padding:"10px 13px",
                      borderRadius:"13px", border:`1.5px solid ${role===r.value ? "rgba(167,139,250,0.5)" : "rgba(167,139,250,0.13)"}`,
                      background: role===r.value
                        ? "linear-gradient(90deg,rgba(124,58,237,0.2),rgba(167,139,250,0.12))"
                        : "rgba(255,255,255,0.02)",
                      cursor:"pointer", textAlign:"left", transition:"all 0.18s",
                      boxShadow: role===r.value ? "0 0 16px rgba(124,58,237,0.2)" : "none",
                    }}>
                    <span style={{ fontSize:"16px" }}>{r.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"12px", fontWeight:700, color: role===r.value ? "#c4b5fd" : "rgba(255,255,255,0.65)" }}>{r.label}</div>
                      <div style={{ fontSize:"10px", color:"rgba(167,139,250,0.45)" }}>{r.desc}</div>
                    </div>
                    {role===r.value && (
                      <div style={{ width:"16px", height:"16px", borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#a78bfa)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 0 10px rgba(167,139,250,0.5)" }}>
                        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"white" }}/>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div>
                <div style={{ fontSize:"10px", fontWeight:700, color:"rgba(167,139,250,0.6)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"6px" }}>User ID / Email</div>
                <input type="text" value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(v=>({...v,email:undefined})); }}
                  style={{ ...inputStyle("email"), borderColor: errors.email ? "rgba(239,68,68,0.6)" : (focused==="email" ? "rgba(167,139,250,0.7)" : "rgba(167,139,250,0.2)") }}
                  onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}
                  placeholder="e.g. officer@ias.gov.in"
                />
                {errors.email && (
                  <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"5px", fontSize:"11px", fontWeight:600, color:"#f87171" }}>
                    <span style={{ flexShrink:0 }}>⚠</span> {errors.email}
                  </div>
                )}
                {!errors.email && email && email.toLowerCase().includes("gov.in") && (
                  <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"5px", fontSize:"11px", fontWeight:600, color:"#34d399" }}>
                    <span>✓</span> gov.in email verified
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize:"10px", fontWeight:700, color:"rgba(167,139,250,0.6)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"6px" }}>Password</div>
                <div style={{ position:"relative" }}>
                  <input type={showPass?"text":"password"} value={password}
                    onChange={e=>{ setPassword(e.target.value); if (errors.password) setErrors(v=>({...v,password:undefined})); }}
                    style={{ ...inputStyle("pass"), paddingRight:"40px", borderColor: errors.password ? "rgba(239,68,68,0.6)" : (focused==="pass" ? "rgba(167,139,250,0.7)" : "rgba(167,139,250,0.2)") }}
                    onFocus={()=>setFocused("pass")} onBlur={()=>setFocused(null)}
                    placeholder="Minimum 8 characters"
                  />
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(167,139,250,0.5)", display:"flex", alignItems:"center" }}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {errors.password && (
                  <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"5px", fontSize:"11px", fontWeight:600, color:"#f87171" }}>
                    <span style={{ flexShrink:0 }}>⚠</span> {errors.password}
                  </div>
                )}
                {!errors.password && password.length >= 8 && (
                  <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"5px", fontSize:"11px", fontWeight:600, color:"#34d399" }}>
                    <span>✓</span> Password length valid ({password.length} chars)
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width:"100%", padding:"13px", borderRadius:"13px", border:"none", cursor:loading?"not-allowed":"pointer",
                  background: loading
                    ? "linear-gradient(135deg,rgba(124,58,237,0.5),rgba(167,139,250,0.4))"
                    : "linear-gradient(135deg,#5b21b6,#7c3aed,#a78bfa)",
                  color:"white", fontWeight:800, fontSize:"14px",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                  boxShadow: loading ? "none" : "0 6px 24px rgba(124,58,237,0.45)",
                  transition:"all 0.25s", fontFamily:"inherit",
                  transform: loading ? "none" : undefined,
                }}
                onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.boxShadow="0 8px 32px rgba(167,139,250,0.55)"; e.currentTarget.style.transform="translateY(-1px)"; }}}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 6px 24px rgba(124,58,237,0.45)"; e.currentTarget.style.transform="none"; }}
              >
                {loading ? (
                  <><div style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>Authenticating...</>
                ) : (
                  <>Sign In to LACC <ChevronRight size={16}/></>
                )}
              </button>
            </form>
          </div>

          <div style={{ paddingTop:"20px", borderTop:"1px solid rgba(167,139,250,0.1)", textAlign:"center", fontSize:"10px", color:"rgba(167,139,250,0.35)", lineHeight:"1.7" }}>
            LACC Prototype – Ministry of Rural Development, GoI<br/>
            For official access: nlams-support@rural.gov.in
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.45} }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 4px 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.2); }
          50%      { box-shadow: 0 4px 30px rgba(167,139,250,0.7), 0 0 60px rgba(167,139,250,0.35); }
        }
        @keyframes float {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)}
        }
        @keyframes orb-drift {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(30px,-20px) scale(1.05)}
          66%{transform:translate(-20px,15px) scale(0.97)}
        }
        @keyframes fade-up {
          from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)}
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Landmark, MapPin, ClipboardList, CreditCard,
  Bell, BarChart2, MessageSquare, FolderOpen, FileText,
  LogOut, ChevronRight, RefreshCw, Smartphone, Send,
  Upload, CheckCircle2, AlertTriangle, Clock, XCircle, Users,
} from "lucide-react";
import IndiaMapSVG from "./components/IndiaMapSVG";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import GISMap from "./components/GISMap";
import LoginPage from "./views/LoginPage";
import ProjectList from "./views/ProjectList";
import AddProject from "./views/AddProject";
import ProjectDetails from "./views/ProjectDetails";
import CompensationRR from "./views/CompensationRR";
import Notifications from "./views/Notifications";
import Reports from "./views/Reports";
import {
  nationalKPIs, initialProjects, initialNotifications, reportsList,
  stateWiseChartData, monthlyAcquisitionData, projectStatusPieData,
  compensationChartData, aiInsights, scopeOfStudyTable, componentTechnologyTable,
} from "./data/mockData";

// ─── ROLE NAV ──────────────────────────────────────────────────────────────────
const NAV = {
  central: [
    { id: "dashboard",    label: "National Dashboard",   icon: Landmark,      color: "#6366f1" },
    { id: "projects",     label: "All Projects",          icon: ClipboardList, color: "#3b82f6" },
    { id: "gis",          label: "Land Acquisition Command Centre", icon: MapPin,        color: "#10b981" },
    { id: "compensation", label: "Compensation & R&R",   icon: CreditCard,    color: "#f59e0b" },
    { id: "notifications",label: "Notifications",         icon: Bell,          color: "#ef4444" },
    { id: "reports",      label: "Reports & Analytics",  icon: BarChart2,     color: "#8b5cf6" },
    { id: "copilot",      label: "AI Copilot",           icon: MessageSquare, color: "#06b6d4" },
    { id: "doc-intel",    label: "Document Intelligence",icon: FolderOpen,    color: "#f97316" },
    { id: "mobile-field", label: "Field Verification",   icon: Smartphone,    color: "#84cc16" },

  ],
  state:    [
    { id: "dashboard",    label: "State Dashboard",      icon: Landmark,      color: "#6366f1" },
    { id: "projects",     label: "Projects",              icon: ClipboardList, color: "#3b82f6" },
    { id: "gis",          label: "Land Acquisition Command Centre", icon: MapPin, color: "#10b981" },
    { id: "compensation", label: "Compensation & R&R",   icon: CreditCard,    color: "#f59e0b" },
    { id: "notifications",label: "Notifications",         icon: Bell,          color: "#ef4444" },
    { id: "reports",      label: "Reports",              icon: BarChart2,     color: "#8b5cf6" },
  ],
  district: [
    { id: "dashboard",    label: "District Overview",    icon: Landmark,      color: "#6366f1" },
    { id: "projects",     label: "Projects",              icon: ClipboardList, color: "#3b82f6" },
    { id: "gis",          label: "Land Acquisition Command Centre", icon: MapPin, color: "#10b981" },
    { id: "compensation", label: "Compensation",          icon: CreditCard,    color: "#f59e0b" },
    { id: "mobile-field", label: "Field Updates",        icon: Smartphone,    color: "#84cc16" },
    { id: "notifications",label: "Notifications",         icon: Bell,          color: "#ef4444" },
  ],
  agency:   [
    { id: "projects",     label: "My Projects",          icon: ClipboardList, color: "#3b82f6" },
    { id: "gis",          label: "Land Acquisition Command Centre", icon: MapPin, color: "#10b981" },
    { id: "notifications",label: "Notifications",         icon: Bell,          color: "#ef4444" },
    { id: "doc-intel",    label: "Documents",            icon: FolderOpen,    color: "#f97316" },
  ],
  field:    [
    { id: "gis",          label: "Land Acquisition Command Centre", icon: MapPin, color: "#10b981" },
    { id: "mobile-field", label: "Field Verification",   icon: Smartphone,    color: "#84cc16" },
    { id: "notifications",label: "Notifications",         icon: Bell,          color: "#ef4444" },
  ],
};

// ─── COLORFUL KPI CARD ─────────────────────────────────────────────────────────
function KPICard({ label, value, sub, gradient, icon: Icon }) {
  return (
    <div style={{
      background: gradient,
      borderRadius: "16px", padding: "18px",
      position: "relative", overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(167,139,250,0.15)",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.55), 0 0 20px rgba(167,139,250,0.2)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(167,139,250,0.15)"}}
    >
      <div style={{ position: "absolute", right: "-10px", top: "-10px", opacity: 0.12, fontSize: "52px" }}>
        {Icon && <Icon size={52} color="white" />}
      </div>
      <p style={{ fontSize: "9px", fontWeight: 800, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>{label}</p>
      <p style={{ fontSize: "23px", fontWeight: 900, color: "white", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", marginTop: "5px", fontWeight: 600 }}>{sub}</p>
    </div>
  );
}

// ─── AI INSIGHT COLORS ─────────────────────────────────────────────────────────
const INSIGHT_BG = {
  critical: "linear-gradient(135deg,rgba(239,68,68,0.12),rgba(220,38,38,0.07))",
  warning:  "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(217,119,6,0.07))",
  positive: "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.07))",
  info:     "linear-gradient(135deg,rgba(99,102,241,0.14),rgba(124,58,237,0.08))",
};
const INSIGHT_BORDER = { critical:"rgba(239,68,68,0.35)", warning:"rgba(245,158,11,0.35)", positive:"rgba(16,185,129,0.35)", info:"rgba(167,139,250,0.35)" };

// ─── STAGE CONFIG ──────────────────────────────────────────────────────────────
const STAGE_CFG = {
  completed:  { dot:"bg-emerald-500", badge:"bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2, label:"Completed" },
  inprogress: { dot:"bg-blue-500",    badge:"bg-blue-100 text-blue-800 border-blue-200",         icon: Clock,        label:"In Progress" },
  pending:    { dot:"bg-slate-300",   badge:"bg-slate-100 text-slate-600 border-slate-200",      icon: Clock,        label:"Pending" },
  delayed:    { dot:"bg-red-500",     badge:"bg-red-100 text-red-800 border-red-200",            icon: AlertTriangle,label:"Delayed" },
};
const ACTION_MAP = {
  "District Verification":  { label:"✔ Verify",              nextStatus:"completed" },
  "State Approval":         { label:"✔ Approve",             nextStatus:"completed" },
  "Notification (Sec 11)":  { label:"📢 Issue Notification", nextStatus:"completed" },
  "Land Survey":            { label:"📐 Mark Survey Done",   nextStatus:"completed" },
  "Award Declaration":      { label:"🏆 Declare Award",      nextStatus:"completed" },
  "Compensation Payment":   { label:"💰 Mark Comp. Paid",    nextStatus:"completed" },
  "Land Possession":        { label:"🏠 Mark Possession",    nextStatus:"completed" },
  "R&R Completion":         { label:"✅ Complete R&R",       nextStatus:"completed" },
  "Project Completed":      { label:"🎉 Close Project",      nextStatus:"completed" },
};

// ─── CHART COLORS ──────────────────────────────────────────────────────────────
const PIE_COLORS = ["#10b981","#3b82f6","#f59e0b","#ef4444"];

export default function App() {
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [userInfo,  setUserInfo]  = useState(null);
  const [projects,  setProjects]  = useState(() => {
    try { const s = localStorage.getItem("bhumi_v1_projects"); return s ? JSON.parse(s) : initialProjects; }
    catch { return initialProjects; }
  });
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab,        setActiveTab]        = useState("dashboard");
  const [selectedProjId,   setSelectedProjId]   = useState(initialProjects[0].id);
  const [detailProjId,     setDetailProjId]     = useState(null);
  const [activeParcelId,   setActiveParcelId]   = useState("P-1048");
  const [showAddProject,   setShowAddProject]   = useState(false);
  const [toast,            setToast]            = useState(null);

  // AI Copilot
  const [chatLog,  setChatLog]  = useState([{ sender:"ai", text:"Welcome Officer. I analyse LACC land acquisition data, forecast delays, scan cadastral records, and flag high-risk parcels. Ask me anything!" }]);
  const [chatInput,setChatInput] = useState("");

  // OCR / Doc Intel
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrScanning,  setOcrScanning]  = useState(false);
  const [ocrResult,    setOcrResult]    = useState(null);

  // Mobile Field
  const [mobileParcel,   setMobileParcel]   = useState("P-1048");
  const [mBoundary,      setMBoundary]      = useState(true);
  const [mOwner,         setMOwner]         = useState(true);
  const [mComp,          setMComp]          = useState(false);
  const [mRR,            setMRR]            = useState(false);
  const [mPhoto,         setMPhoto]         = useState(false);
  const [mSubmitted,     setMSubmitted]     = useState(false);

  useEffect(() => {
    localStorage.setItem("bhumi_v1_projects", JSON.stringify(projects));
  }, [projects]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const activeProject  = projects.find(p => p.id === selectedProjId) || projects[0];
  const activeParcel   = activeProject.parcels.find(p => p.id === activeParcelId) || activeProject.parcels[0];
  const detailProject  = projects.find(p => p.id === detailProjId);
  const unreadCount    = notifications.filter(n => !n.read).length;
  const navItems       = NAV[userInfo?.role] || NAV.central;

  const goTo = (tab) => { setActiveTab(tab); setShowAddProject(false); setDetailProjId(null); };
  const goProjects = () => { setDetailProjId(null); setShowAddProject(false); setActiveTab("projects"); };

  const handleLogin  = (info) => { setUserInfo(info); setLoggedIn(true); };
  const handleLogout = () => { setLoggedIn(false); setUserInfo(null); setActiveTab("dashboard"); };
  const handleReset  = () => {
    if (!window.confirm("Reset all demo data?")) return;
    setProjects(initialProjects); setNotifications(initialNotifications);
    setActiveParcelId("P-1048"); setChatLog([{sender:"ai",text:"Ready for queries."}]);
    setOcrResult(null); setSelectedFile(null); localStorage.removeItem("bhumi_v1_projects");
  };

  const handleViewDetails    = (id) => { setDetailProjId(id); setActiveTab("project-details"); };
  const handleUpdateProject  = (upd) => setProjects(prev => prev.map(p => p.id===upd.id?upd:p));
  const handleAddProjectDone = (newP) => { setProjects(prev=>[newP,...prev]); setShowAddProject(false); setActiveTab("projects"); };
  const handleMarkRead       = (id) => setNotifications(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));
  const handleMarkAllRead    = () => setNotifications(prev=>prev.map(n=>({...n,read:true})));

  // ── Chat ──
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const q = chatInput;
    setChatLog(prev=>[...prev,{sender:"user",text:q}]);
    setChatInput("");
    setTimeout(() => {
      let ai = `I found **${projects.length} projects** across 10 states. Ask about delays, compensation, R&R, or a specific parcel.`;
      if (/deadline|miss|risk/i.test(q))
        ai = "**4 projects** are at risk of missing acquisition deadlines.\n\n**Top bottlenecks:**\n- 8 parcels with compensation pending\n- 4 parcels with R&R verification pending\n- 3 parcels with document discrepancies\n\n**Recommended:**\n1. Prioritise compensation for Bharuch & Howrah\n2. Assign joint survey team for Port Trust demarcation\n3. Escalate MH tribal resettlement to Cabinet";
      else if (/maharashtra|mh|dfcc/i.test(q))
        ai = "**Maharashtra DFCC-MH Analysis:**\n- Progress: 48% — High Risk\n- Compensation blocked: ₹420 Cr (tribal Cabinet approval pending)\n- R&R families: 3 of 7 resettled\n- Recommended: Escalate tribal resettlement to Ministry immediately";
      else if (/andhra|ap|highway/i.test(q))
        ai = "**Andhra Pradesh Status:**\n- NH-AP01: 73% acquired, ₹840 Cr paid\n- IRRG-AP: 65% complete, awards for 70% parcels declared\n- Combined: 2 projects, 23 affected families, 3 families pending R&R";
      else if (/1048|parcel p/i.test(q))
        ai = "**Parcel P-1048 (Ankleshwar, Gujarat):**\n- Owner: Subramaniam Gowda\n- Area: 2.43 acres\n- Status: Compensation Pending\n- Risk: HIGH — litigation at State Collectorate\n- Action: Engage legal counsel immediately";
      setChatLog(prev=>[...prev,{sender:"ai",text:ai}]);
    }, 900);
  };

  // ── OCR ──
  const handleOcrScan = () => {
    if (!selectedFile) return;
    setOcrScanning(true); setOcrResult(null);
    setTimeout(() => {
      setOcrScanning(false);
      setOcrResult({ docType:"Award Declaration", extracted:{parcelId:"P-1048",area:"2.43 acres",amount:"₹48,50,000",date:"28/08/2026"}, checks:{parcelMatch:true,projectMatch:true,compMismatch:true} });
    }, 1600);
  };

  // ── Mobile submit ──
  const handleMobileSubmit = () => {
    if (!mPhoto) { alert("Please upload a field photo first!"); return; }
    setMSubmitted(true);
    setTimeout(() => { setMSubmitted(false); goTo("gis"); showToast(`✅ Parcel ${mobileParcel} synced to LACC GIS Command Centre!`); }, 1500);
  };

  if (!loggedIn) return <LoginPage onLogin={handleLogin} />;

  // ── SIDEBAR GRADIENT ──
  const sidebarGradient = "linear-gradient(175deg,#05050f 0%,#0c0820 45%,#080516 100%)";

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Inter','Outfit',sans-serif", background:"#05050f" }}>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:9999,
          background:"linear-gradient(135deg,#13132b,#1e1040)",
          color:"rgba(255,255,255,0.95)",
          padding:"13px 22px", borderRadius:"16px", fontSize:"13px", fontWeight:700,
          boxShadow:"0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(124,58,237,0.3)",
          display:"flex", alignItems:"center", gap:"10px",
          border:"1px solid rgba(167,139,250,0.3)",
          animation:"slide-in-right 0.3s ease both",
        }}>
          {toast}
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{ width:"235px", background:sidebarGradient, display:"flex", flexDirection:"column", justifyContent:"space-between", flexShrink:0, overflow:"hidden", borderRight:"1px solid rgba(167,139,250,0.1)" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"0", padding:"16px 12px", overflowY:"auto", flex:1 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 6px 18px" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"13px", background:"linear-gradient(135deg,#f59e0b,#ef4444,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0, boxShadow:"0 4px 16px rgba(124,58,237,0.5), 0 0 30px rgba(124,58,237,0.2)", animation:"pulse-glow 3s ease-in-out infinite" }}>🗺️</div>
            <div>
              <div style={{ fontSize:"11px", fontWeight:900, color:"rgba(255,255,255,0.92)", lineHeight:1.2 }}>Land Acquisition</div>
              <div style={{ fontSize:"10px", fontWeight:900, color:"#a78bfa", lineHeight:1.2 }}>Command Centre</div>
              <div style={{ fontSize:"7px", color:"rgba(167,139,250,0.35)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:"2px" }}>MoRD · Govt. of India</div>
            </div>
          </div>

          {/* User chip */}
          <div style={{ background:"rgba(167,139,250,0.07)", border:"1px solid rgba(167,139,250,0.15)", borderRadius:"12px", padding:"9px 10px", display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
            <div style={{ width:"28px", height:"28px", borderRadius:"10px", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:"12px", flexShrink:0, boxShadow:"0 0 10px rgba(124,58,237,0.5)" }}>
              {userInfo?.email?.slice(0,1).toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.88)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{userInfo?.roleName}</div>
              <div style={{ fontSize:"9px", color:"rgba(167,139,250,0.45)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{userInfo?.email}</div>
            </div>
          </div>

          <div style={{ height:"1px", background:"rgba(167,139,250,0.08)", marginBottom:"10px" }} />

          {/* Nav items */}
          {navItems.map(item => {
            const Icon = item.icon;
            const isAct = activeTab === item.id || (item.id==="projects" && (activeTab==="project-details"||showAddProject));
            return (
              <button key={item.id}
                onClick={() => item.id==="projects" ? goProjects() : goTo(item.id)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:"10px",
                  padding:"9px 10px", borderRadius:"12px", border:"none",
                  background: isAct
                    ? `linear-gradient(90deg,rgba(124,58,237,0.25),rgba(167,139,250,0.1))`
                    : "transparent",
                  borderLeft: isAct ? `3px solid rgba(167,139,250,0.8)` : "3px solid transparent",
                  boxShadow: isAct ? "0 0 16px rgba(124,58,237,0.2)" : "none",
                  color: isAct ? "rgba(255,255,255,0.95)" : "rgba(167,139,250,0.45)",
                  cursor:"pointer", textAlign:"left", fontSize:"12px", fontWeight: isAct ? 700 : 500,
                  marginBottom:"2px", transition:"all 0.18s", position:"relative",
                }}
                onMouseEnter={e=>{if(!isAct){e.currentTarget.style.background="rgba(167,139,250,0.06)";e.currentTarget.style.color="rgba(196,181,253,0.75)";}}}
                onMouseLeave={e=>{if(!isAct){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(167,139,250,0.45)";}}}
              >
                <Icon size={15} style={{ color: isAct ? "#a78bfa" : "rgba(167,139,250,0.4)", flexShrink:0 }} />
                <span style={{ flex:1 }}>{item.label}</span>
                {item.id==="notifications" && unreadCount>0 && (
                  <span style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"white", fontSize:"9px", fontWeight:800, padding:"1px 6px", borderRadius:"99px", minWidth:"18px", textAlign:"center", boxShadow:"0 0 8px rgba(239,68,68,0.5)" }}>{unreadCount}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding:"12px", borderTop:"1px solid rgba(167,139,250,0.08)", display:"flex", flexDirection:"column", gap:"6px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"9px", color:"rgba(167,139,250,0.35)", fontWeight:700, padding:"0 4px 4px" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#10b981", display:"inline-block", boxShadow:"0 0 6px #10b981", animation:"pulse 2s infinite" }} /> LACC Portal Active
          </div>
          <button onClick={handleReset} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", padding:"7px", background:"rgba(167,139,250,0.06)", border:"1px solid rgba(167,139,250,0.12)", borderRadius:"10px", color:"rgba(167,139,250,0.5)", cursor:"pointer", fontSize:"10px", fontWeight:600, transition:"all 0.18s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.3)";e.currentTarget.style.color="rgba(196,181,253,0.7)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.12)";e.currentTarget.style.color="rgba(167,139,250,0.5)";}}>
            <RefreshCw size={11}/> Reset Demo
          </button>
          <button onClick={handleLogout} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", padding:"7px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px", color:"rgba(239,68,68,0.75)", cursor:"pointer", fontSize:"10px", fontWeight:600, transition:"all 0.18s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.18)";e.currentTarget.style.color="rgba(248,113,113,0.9)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.1)";e.currentTarget.style.color="rgba(239,68,68,0.75)";}}>
            <LogOut size={11}/> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>

        {/* TOP BAR */}
        <header style={{ height:"52px", background:"linear-gradient(135deg,#07071a,#0d0d26)", borderBottom:"1px solid rgba(167,139,250,0.12)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0, boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", fontWeight:600, color:"rgba(167,139,250,0.6)" }}>
            <span style={{ fontWeight:900, color:"#c4b5fd", fontSize:"13px" }}>LACC</span>
            <ChevronRight size={13} style={{ color:"rgba(167,139,250,0.25)" }}/>
            <span style={{ color:"rgba(255,255,255,0.9)", fontWeight:800, textTransform:"capitalize" }}>
              {activeTab==="project-details" ? `Project – ${detailProject?.shortName||""}` :
               activeTab==="gis" ? "Land Acquisition Command Centre" :
               showAddProject ? "Add New Project" :
               activeTab.replace(/-/g," ")}
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"16px", fontSize:"12px" }}>
            <span style={{ color:"rgba(167,139,250,0.4)", fontSize:"11px", fontWeight:500 }}>Ministry of Rural Development · GoI</span>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(167,139,250,0.1)", padding:"4px 13px", borderRadius:"20px", border:"1px solid rgba(167,139,250,0.2)" }}>
              <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 8px #22C55E", animation:"pulse 2s infinite" }} />
              <span style={{ fontWeight:700, color:"rgba(196,181,253,0.9)", fontSize:"11px" }}>{userInfo?.roleName}</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px", background:"#05050f" }}>

          {/* ═══════════════════════════ DASHBOARD ═══════════════════════════ */}
          {activeTab==="dashboard" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

              {/* KPI Cards - Colorful Gradients */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"12px" }}>
                {[
                  { label:"Total Projects",    value:nationalKPIs.totalProjects,                  sub:"All India",      gradient:"linear-gradient(135deg,#6366f1,#8b5cf6)", icon:ClipboardList },
                  { label:"Land Proposed",     value:`${nationalKPIs.landProposedAcres.toLocaleString()} ac`, sub:"Across all projects", gradient:"linear-gradient(135deg,#1e40af,#2563eb)", icon:MapPin },
                  { label:"Land Acquired",     value:`${nationalKPIs.landAcquiredPercentage}%`,   sub:"of target",      gradient:"linear-gradient(135deg,#059669,#10b981)", icon:CheckCircle2 },
                  { label:"Comp. Paid",        value:`₹${nationalKPIs.totalCompensationCr} Cr`,   sub:"Disbursed",      gradient:"linear-gradient(135deg,#0891b2,#06b6d4)", icon:CreditCard },
                  { label:"Affected Families", value:nationalKPIs.affectedFamilies,                sub:"Registered",     gradient:"linear-gradient(135deg,#7c3aed,#a855f7)", icon:Users },
                  { label:"Possession",        value:`${nationalKPIs.possessionPercentage}%`,      sub:"Completed",      gradient:"linear-gradient(135deg,#b45309,#f59e0b)", icon:Landmark },
                  { label:"High Risk",         value:nationalKPIs.highRiskCount,                   sub:"Need attention", gradient:"linear-gradient(135deg,#b91c1c,#ef4444)", icon:AlertTriangle },
                ].map((k, i) => <KPICard key={i} {...k} />)}
              </div>

              {/* Charts Row 1 */}
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"16px" }}>
                <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)" }}>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ width:"4px", height:"18px", background:"linear-gradient(#a78bfa,#7c3aed)", borderRadius:"2px", display:"inline-block" }}/>
                    State-wise Land Acquisition (Acres)
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stateWiseChartData} margin={{top:0,right:10,left:0,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,139,250,0.08)"/>
                      <XAxis dataKey="state" tick={{fontSize:9,fill:"rgba(167,139,250,0.6)"}} angle={-20} textAnchor="end" height={36}/>
                      <YAxis tick={{fontSize:9,fill:"rgba(167,139,250,0.6)"}}/>
                      <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:"1px solid rgba(167,139,250,0.2)",background:"#13132b",color:"#e2e8f0",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}/>
                      <Legend wrapperStyle={{fontSize:10,color:"rgba(167,139,250,0.6)"}}/>
                      <Bar dataKey="proposed" fill="rgba(167,139,250,0.2)" name="Proposed" radius={[4,4,0,0]}/>
                      <Bar dataKey="acquired"  fill="#7c3aed" name="Acquired" radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)", display:"flex", flexDirection:"column" }}>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"12px", display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ width:"4px", height:"18px", background:"linear-gradient(#10b981,#a78bfa)", borderRadius:"2px", display:"inline-block" }}/>
                    Project Status
                  </div>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <PieChart width={140} height={140}>
                      <Pie data={projectStatusPieData} cx={70} cy={70} innerRadius={40} outerRadius={64} paddingAngle={3} dataKey="value">
                        {projectStatusPieData.map((e,i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
                      </Pie>
                      <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:"1px solid rgba(167,139,250,0.2)",background:"#13132b",color:"#e2e8f0",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}/>
                    </PieChart>
                    <div style={{ display:"flex", flexDirection:"column", gap:"5px", marginTop:"8px", width:"100%" }}>
                      {projectStatusPieData.map((d,i)=>(
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"11px" }}>
                          <span style={{ width:"10px", height:"10px", borderRadius:"50%", background:PIE_COLORS[i], flexShrink:0 }}/>
                          <span style={{ color:"rgba(167,139,250,0.7)", fontWeight:600 }}>{d.name}: <b style={{color:"rgba(255,255,255,0.9)"}}>{d.value}</b></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row 2 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)" }}>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ width:"4px", height:"18px", background:"linear-gradient(#a78bfa,#5b21b6)", borderRadius:"2px", display:"inline-block" }}/>
                    Monthly Acquisition Trend (Acres)
                  </div>
                  <ResponsiveContainer width="100%" height={170}>
                    <AreaChart data={monthlyAcquisitionData} margin={{top:0,right:10,left:0,bottom:0}}>
                      <defs>
                        <linearGradient id="acqGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,139,250,0.08)"/>
                      <XAxis dataKey="month" tick={{fontSize:10,fill:"rgba(167,139,250,0.6)"}}/>
                      <YAxis tick={{fontSize:10,fill:"rgba(167,139,250,0.6)"}}/>
                      <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:"1px solid rgba(167,139,250,0.2)",background:"#13132b",color:"#e2e8f0",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}/>
                      <Area type="monotone" dataKey="acquired" stroke="#a78bfa" strokeWidth={2.5} fill="url(#acqGrad)" name="Acquired (ac)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)" }}>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ width:"4px", height:"18px", background:"linear-gradient(#10b981,#a78bfa)", borderRadius:"2px", display:"inline-block" }}/>
                    Compensation: Assessed vs Paid (₹ Cr)
                  </div>
                  <ResponsiveContainer width="100%" height={170}>
                    <BarChart data={compensationChartData} margin={{top:0,right:10,left:0,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,139,250,0.08)"/>
                      <XAxis dataKey="project" tick={{fontSize:9,fill:"rgba(167,139,250,0.6)"}}/>
                      <YAxis tick={{fontSize:9,fill:"rgba(167,139,250,0.6)"}}/>
                      <Tooltip formatter={v=>`₹${v} Cr`} contentStyle={{fontSize:11,borderRadius:10,border:"1px solid rgba(167,139,250,0.2)",background:"#13132b",color:"#e2e8f0",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}/>
                      <Legend wrapperStyle={{fontSize:10,color:"rgba(167,139,250,0.6)"}}/>
                      <Bar dataKey="assessed" fill="rgba(167,139,250,0.2)" name="Assessed" radius={[4,4,0,0]}/>
                      <Bar dataKey="paid"     fill="#10b981" name="Paid"     radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* GIS Map */}
              <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px", paddingBottom:"14px", borderBottom:"1px solid rgba(167,139,250,0.1)" }}>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", display:"flex", alignItems:"center", gap:"8px" }}>
                      <span style={{ width:"4px", height:"18px", background:"linear-gradient(#10b981,#a78bfa)", borderRadius:"2px", display:"inline-block" }}/>
                      LACC GIS – National Cadastral View
                    </div>
                    <p style={{ fontSize:"11px", color:"rgba(167,139,250,0.5)", marginTop:"2px" }}>All 15 projects across India. Click markers to view project details. Select project to see parcels.</p>
                  </div>
                  <select value={selectedProjId} onChange={e=>setSelectedProjId(e.target.value)}
                    style={{ border:"1px solid rgba(167,139,250,0.25)", borderRadius:"12px", padding:"6px 12px", fontSize:"12px", background:"rgba(167,139,250,0.07)", color:"rgba(255,255,255,0.85)", cursor:"pointer", outline:"none" }}>
                    <option value="" style={{background:"#0f0f24"}}>🌏 National View (All States)</option>
                    {projects.map(p=><option key={p.id} value={p.id} style={{background:"#0f0f24"}}>{p.shortName} – {p.state}</option>)}
                  </select>
                </div>
                <div style={{ height:"400px" }}>
                  <GISMap
                    selectedProject={selectedProjId ? activeProject : null}
                    allProjects={projects}
                    activeParcel={activeParcel}
                    onSelectParcel={parcel => { setActiveParcelId(parcel.id); goTo("gis"); }}
                  />
                </div>
              </div>

              {/* AI Insights */}
              <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                  <div style={{ width:"28px", height:"28px", borderRadius:"10px", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"12px", fontWeight:800, boxShadow:"0 0 12px rgba(124,58,237,0.5)" }}>AI</div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>LACC AI Insights Engine</div>
                  <span style={{ fontSize:"10px", background:"rgba(167,139,250,0.12)", color:"#c4b5fd", fontWeight:700, padding:"3px 10px", borderRadius:"99px", border:"1px solid rgba(167,139,250,0.25)" }}>Rule-Based · Live</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
                  {aiInsights.map(ins => (
                    <div key={ins.id} style={{ background:INSIGHT_BG[ins.type], border:`1px solid ${INSIGHT_BORDER[ins.type]}`, borderRadius:"14px", padding:"14px", backdropFilter:"blur(8px)" }}>
                      <span style={{ fontSize:"22px" }}>{ins.icon}</span>
                      <p style={{ fontSize:"12px", color:"rgba(220,210,255,0.85)", fontWeight:600, marginTop:"6px", lineHeight:1.5 }}>{ins.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════ PROJECT LIST ═════════════════════════ */}
          {activeTab==="projects" && !showAddProject && !detailProjId && (
            <ProjectList projects={projects} onViewDetails={handleViewDetails} onAddProject={()=>setShowAddProject(true)}/>
          )}

          {/* ═══════════════════════════ ADD PROJECT ══════════════════════════ */}
          {activeTab==="projects" && showAddProject && (
            <AddProject onSubmit={handleAddProjectDone} onCancel={()=>setShowAddProject(false)}/>
          )}

          {/* ══════════════════════ PROJECT DETAILS ═══════════════════════════ */}
          {activeTab==="project-details" && detailProject && (
            <ProjectDetails project={detailProject} onBack={()=>{setActiveTab("projects");setDetailProjId(null);}} onUpdateProject={handleUpdateProject}/>
          )}

          {/* ══════════════ LAND ACQUISITION COMMAND CENTRE ══════════════ */}
          {activeTab==="gis" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

              {/* ── HERO: India SVG Command Map ── */}
              <div style={{ height:"580px", borderRadius:"20px", overflow:"hidden", boxShadow:"0 12px 48px rgba(0,0,0,0.7), 0 0 40px rgba(124,58,237,0.15)", border:"1px solid rgba(167,139,250,0.2)" }}>
                <IndiaMapSVG projects={projects}/>
              </div>

              {/* ── Parcel Drill-Down Section ── */}
              <div style={{ background:"linear-gradient(135deg,#09091e,#0e0e26)", borderRadius:"16px", padding:"14px 18px", border:"1px solid rgba(167,139,250,0.18)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <span style={{ fontSize:"15px" }}>📍</span>
                    <div>
                      <div style={{ fontSize:"13px", fontWeight:800, color:"rgba(255,255,255,0.92)" }}>Parcel-Level Drill Down</div>
                      <div style={{ fontSize:"10px", color:"rgba(167,139,250,0.45)", marginTop:"1px" }}>Select a project to zoom into individual cadastral parcels on the OpenStreetMap layer</div>
                    </div>
                  </div>
                  <select value={selectedProjId} onChange={e=>{setSelectedProjId(e.target.value);setActiveParcelId("");}}
                    style={{ border:"1px solid rgba(167,139,250,0.25)", borderRadius:"10px", padding:"7px 12px", fontSize:"11px", background:"rgba(167,139,250,0.07)", color:"rgba(255,255,255,0.85)", cursor:"pointer", outline:"none" }}>
                    <option value="" style={{ background:"#0f0f24" }}>🌏 All India</option>
                    {projects.map(p=><option key={p.id} value={p.id} style={{ background:"#0f0f24" }}>{p.shortName} – {p.state}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"16px", alignItems:"start" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"16px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
                      <span style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.85)" }}>🗺 OpenStreetMap Parcel View</span>
                      <select value={selectedProjId} onChange={e=>{setSelectedProjId(e.target.value);setActiveParcelId("");}}
                        style={{ border:"1px solid rgba(167,139,250,0.25)", borderRadius:"10px", padding:"5px 10px", fontSize:"11px", background:"rgba(167,139,250,0.07)", color:"rgba(255,255,255,0.85)", cursor:"pointer", outline:"none" }}>
                        <option value="" style={{background:"#0f0f24"}}>🌏 All India</option>
                        {projects.map(p=><option key={p.id} value={p.id} style={{background:"#0f0f24"}}>{p.shortName} – {p.state}</option>)}
                      </select>
                    </div>
                    <div style={{ height:"400px" }}>
                      <GISMap selectedProject={selectedProjId?activeProject:null} allProjects={projects} activeParcel={activeParcel} onSelectParcel={p=>setActiveParcelId(p.id)}/>
                    </div>
                  </div>
                  {activeProject.parcels.length > 0 && (
                    <div style={{ background:"#0f0f24", borderRadius:"14px", padding:"12px", border:"1px solid rgba(167,139,250,0.12)", display:"flex", gap:"8px", flexWrap:"wrap" }}>
                      {activeProject.parcels.map(p => (
                        <button key={p.id} onClick={()=>setActiveParcelId(p.id)}
                          style={{ padding:"6px 12px", borderRadius:"10px", border:`2px solid ${activeParcelId===p.id?"rgba(167,139,250,0.6)":"rgba(167,139,250,0.15)"}`, background:activeParcelId===p.id?"rgba(124,58,237,0.2)":"rgba(255,255,255,0.03)", cursor:"pointer", fontSize:"11px", fontWeight:700, color:activeParcelId===p.id?"#c4b5fd":"rgba(167,139,250,0.55)", transition:"all 0.15s", boxShadow:activeParcelId===p.id?"0 0 10px rgba(124,58,237,0.25)":"none" }}>
                          {p.id} ({p.areaAcres} ac)
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Parcel Details Panel */}
                <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)", position:"sticky", top:"0" }}>
                  {activeParcel ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                      <div style={{ paddingBottom:"12px", borderBottom:"1px solid rgba(167,139,250,0.1)" }}>
                        <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Selected Parcel</div>
                        <div style={{ fontSize:"20px", fontWeight:900, color:"rgba(255,255,255,0.92)", marginTop:"2px" }}>ID: {activeParcel.id}</div>
                        <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:activeParcel.risk==="HIGH"?"rgba(239,68,68,0.15)":"rgba(16,185,129,0.15)", color:activeParcel.risk==="HIGH"?"#f87171":"#34d399", border:`1px solid ${activeParcel.risk==="HIGH"?"rgba(239,68,68,0.3)":"rgba(16,185,129,0.3)"}`, marginTop:"6px", boxShadow:activeParcel.risk==="HIGH"?"0 0 10px rgba(239,68,68,0.2)":"0 0 10px rgba(16,185,129,0.2)" }}>
                          {activeParcel.risk} RISK
                        </span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                        {[["Survey No",activeParcel.surveyNo],["Village",activeParcel.village],["Area",`${activeParcel.areaAcres} ac`],["Families",activeParcel.familiesCount]].map(([l,v],i)=>(
                          <div key={i} style={{ background:"rgba(167,139,250,0.06)", borderRadius:"10px", padding:"8px", border:"1px solid rgba(167,139,250,0.1)" }}>
                            <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase" }}>{l}</div>
                            <div style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.88)", marginTop:"2px", wordBreak:"break-word" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize:"12px", fontWeight:600, color:"rgba(196,181,253,0.7)" }}>
                        <span style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", display:"block", marginBottom:"4px" }}>Owner</span>
                        {activeParcel.owner}
                      </div>
                      <div style={{ borderTop:"1px solid rgba(167,139,250,0.1)", paddingTop:"12px", display:"flex", flexDirection:"column", gap:"7px" }}>
                        <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", marginBottom:"4px" }}>Acquisition Pipeline</div>
                        {[["Notification",activeParcel.notificationStatus],["Award",activeParcel.awardStatus],["Compensation",activeParcel.compensationStatus],["R&R",activeParcel.rrStatus],["Possession",activeParcel.possessionStatus]].map(([l,v],i)=>{
                          const done = ["Paid","Issued","Declared","Completed"].includes(v);
                          return (
                            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"12px" }}>
                              <span style={{ color:"rgba(167,139,250,0.65)" }}>{l}</span>
                              <span style={{ fontWeight:700, padding:"2px 10px", borderRadius:"99px", fontSize:"10px", background:done?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.12)", color:done?"#34d399":"#fbbf24", border:`1px solid ${done?"rgba(16,185,129,0.25)":"rgba(245,158,11,0.2)"}`}}>{v}</span>
                            </div>
                          );
                        })}
                      </div>
                      {activeParcel.dispute && (
                        <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:"12px", padding:"10px 12px", fontSize:"11px", color:"#f87171", display:"flex", gap:"8px" }}>
                          <AlertTriangle size={14} style={{ flexShrink:0, marginTop:"1px" }}/>
                          <div><b>Dispute:</b> {activeParcel.dispute}</div>
                        </div>
                      )}
                      <button onClick={()=>goTo("mobile-field")}
                        style={{ width:"100%", padding:"10px", borderRadius:"12px", border:"none", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", color:"white", fontWeight:700, fontSize:"12px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", boxShadow:"0 4px 16px rgba(124,58,237,0.4)", transition:"all 0.2s" }}
                        onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 24px rgba(167,139,250,0.5)";e.currentTarget.style.transform="translateY(-1px)";}}
                        onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(124,58,237,0.4)";e.currentTarget.style.transform="none";}}>
                        <Smartphone size={14}/> Field Verification
                      </button>
                    </div>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", color:"rgba(167,139,250,0.4)", textAlign:"center" }}>
                      <MapPin size={36} style={{ marginBottom:"12px" }}/>
                      <p style={{ fontSize:"12px", fontWeight:600 }}>Select a project above to drill down into parcels</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════ COMPENSATION & R&R ═══════════════════════ */}
          {activeTab==="compensation" && <CompensationRR projects={projects}/>}

          {/* ═══════════════════════ NOTIFICATIONS ════════════════════════════ */}
          {activeTab==="notifications" && <Notifications notifications={notifications} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead}/>}

          {/* ═══════════════════════ REPORTS ══════════════════════════════════ */}
          {activeTab==="reports" && <Reports reports={reportsList}/>}

          {/* ════════════════════════ AI COPILOT ══════════════════════════════ */}
          {activeTab==="copilot" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px", height:"calc(100vh - 10rem)" }}>
              <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"16px 20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)", flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"12px", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"13px", fontWeight:800, boxShadow:"0 0 14px rgba(124,58,237,0.5)" }}>AI</div>
                  <div>
                    <div style={{ fontSize:"14px", fontWeight:800, color:"rgba(255,255,255,0.92)" }}>LACC AI Officer Copilot</div>
                    <div style={{ fontSize:"11px", color:"rgba(167,139,250,0.5)" }}>Heuristic query engine · Acquisition intelligence · Delay forecasting</div>
                  </div>
                </div>
              </div>
              <div style={{ flex:1, minHeight:0, display:"grid", gridTemplateColumns:"1fr 3fr", gap:"16px" }}>
                <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"16px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)", display:"flex", flexDirection:"column", gap:"10px", overflow:"auto" }}>
                  <div style={{ fontSize:"11px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", paddingBottom:"8px", borderBottom:"1px solid rgba(167,139,250,0.08)" }}>Suggested Queries</div>
                  {["Which parcels are likely to miss the possession deadline?","Analyse dispute risk index for parcel P-1048","What is the R&R status in Maharashtra?","Show compensation bottlenecks across all projects"].map((q,i)=>(
                    <button key={i} onClick={()=>setChatInput(q)}
                      style={{ width:"100%", textAlign:"left", padding:"10px 12px", border:"1px solid rgba(167,139,250,0.15)", borderRadius:"12px", fontSize:"12px", color:"rgba(196,181,253,0.75)", fontWeight:600, cursor:"pointer", background:"rgba(167,139,250,0.05)", lineHeight:1.5, transition:"all 0.15s" }}
                      onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.15)";e.currentTarget.style.borderColor="rgba(167,139,250,0.35)";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="rgba(167,139,250,0.05)";e.currentTarget.style.borderColor="rgba(167,139,250,0.15)";}}>
                      "{q}"
                    </button>
                  ))}
                </div>
                <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"16px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)", display:"flex", flexDirection:"column", minHeight:0 }}>
                  <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:"12px", paddingBottom:"8px" }}>
                    {chatLog.map((msg,i)=>(
                      <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:msg.sender==="user"?"flex-end":"flex-start", maxWidth:"80%", alignSelf:msg.sender==="user"?"flex-end":"flex-start" }}>
                        <span style={{ fontSize:"9px", fontWeight:700, color:"rgba(167,139,250,0.45)", textTransform:"uppercase", marginBottom:"4px" }}>
                          {msg.sender==="user"?"Officer":"LACC Copilot"}
                        </span>
                        <div style={{ padding:"12px 14px", borderRadius:msg.sender==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", fontSize:"12px", lineHeight:1.6, whiteSpace:"pre-wrap",
                          background:msg.sender==="user"?"linear-gradient(135deg,#5b21b6,#7c3aed)":"rgba(167,139,250,0.07)",
                          color:msg.sender==="user"?"white":"rgba(220,210,255,0.85)",
                          border:msg.sender==="user"?"none":"1px solid rgba(167,139,250,0.15)",
                          boxShadow:msg.sender==="user"?"0 4px 16px rgba(124,58,237,0.35)":"none",
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendChat} style={{ display:"flex", gap:"8px", borderTop:"1px solid rgba(167,139,250,0.08)", paddingTop:"12px", flexShrink:0 }}>
                    <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)}
                      placeholder="Ask about delays, compensation, parcel risk..."
                      style={{ flex:1, border:"1px solid rgba(167,139,250,0.2)", borderRadius:"12px", padding:"10px 14px", fontSize:"12px", background:"rgba(167,139,250,0.05)", outline:"none", fontFamily:"inherit", color:"rgba(255,255,255,0.88)" }}/>
                    <button type="submit" style={{ padding:"10px 14px", borderRadius:"12px", border:"none", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", color:"white", cursor:"pointer", display:"flex", alignItems:"center", boxShadow:"0 4px 14px rgba(124,58,237,0.4)" }}>
                      <Send size={14}/>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════ DOCUMENT INTELLIGENCE ════════════════════════ */}
          {activeTab==="doc-intel" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"16px 20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)" }}>
                <div style={{ fontSize:"14px", fontWeight:800, color:"rgba(255,255,255,0.92)" }}>📎 Document Intelligence Workspace</div>
                <div style={{ fontSize:"12px", color:"rgba(167,139,250,0.5)", marginTop:"2px" }}>Simulate OCR scanning with automated parcel matching and validation.</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)", display:"flex", flexDirection:"column", gap:"14px" }}>
                  <div style={{ fontSize:"12px", fontWeight:800, color:"rgba(167,139,250,0.55)", textTransform:"uppercase", letterSpacing:"0.1em" }}>OCR Scan Simulator</div>
                  <p style={{ fontSize:"12px", color:"rgba(167,139,250,0.5)", lineHeight:1.6 }}>Upload an official Gazette Notification or Award deed. The system extracts and validates structured data automatically.</p>
                  <div>
                    <div style={{ fontSize:"10px", fontWeight:700, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"6px" }}>Select Document</div>
                    <select onChange={e=>setSelectedFile(e.target.value||null)}
                      style={{ width:"100%", border:"1px solid rgba(167,139,250,0.2)", borderRadius:"12px", padding:"10px 12px", fontSize:"12px", background:"rgba(167,139,250,0.05)", color:"rgba(255,255,255,0.85)", cursor:"pointer", outline:"none" }}>
                      <option value="" style={{background:"#0f0f24"}}>-- Choose Sample PDF --</option>
                      <option value="Award_Deed_P1048.pdf" style={{background:"#0f0f24"}}>Award_Deed_P1048.pdf (Bharuch Corridor)</option>
                      <option value="Gazette_Sec11_AP01.pdf" style={{background:"#0f0f24"}}>Gazette_Sec11_AP01.pdf (Kurnool NH)</option>
                    </select>
                  </div>
                  {ocrScanning ? (
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"10px", padding:"24px" }}>
                      <div style={{ width:"32px", height:"32px", border:"3px solid rgba(167,139,250,0.2)", borderTopColor:"#a78bfa", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                      <span style={{ fontSize:"12px", color:"rgba(167,139,250,0.6)", fontWeight:600 }}>Scanning document structure...</span>
                    </div>
                  ) : (
                    <button onClick={handleOcrScan} disabled={!selectedFile}
                      style={{ padding:"11px", borderRadius:"12px", border:"none", background:selectedFile?"linear-gradient(135deg,#5b21b6,#7c3aed)":"rgba(167,139,250,0.08)", color:selectedFile?"white":"rgba(167,139,250,0.3)", fontWeight:700, fontSize:"13px", cursor:selectedFile?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", boxShadow:selectedFile?"0 4px 16px rgba(124,58,237,0.4)":"none", transition:"all 0.2s" }}>
                      <Upload size={15}/> Upload & Run OCR Scan
                    </button>
                  )}
                </div>
                <div style={{ background:"#0f0f24", borderRadius:"16px", padding:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)" }}>
                  <div style={{ fontSize:"12px", fontWeight:800, color:"rgba(167,139,250,0.55)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"14px" }}>Extraction Output</div>
                  {ocrResult ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", alignItems:"center" }}>
                        <span style={{ color:"rgba(167,139,250,0.6)" }}>Document Type:</span>
                        <span style={{ background:"rgba(167,139,250,0.08)", padding:"3px 10px", borderRadius:"8px", fontWeight:700, color:"#c4b5fd", border:"1px solid rgba(167,139,250,0.2)" }}>{ocrResult.docType}</span>
                      </div>
                      <div style={{ background:"rgba(167,139,250,0.05)", borderRadius:"12px", padding:"14px", border:"1px solid rgba(167,139,250,0.1)", display:"flex", flexDirection:"column", gap:"8px" }}>
                        {[["Parcel ID",ocrResult.extracted.parcelId],["Area",ocrResult.extracted.area],["Award Amount",ocrResult.extracted.amount],["Award Date",ocrResult.extracted.date]].map(([l,v])=>(
                          <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:"12px" }}>
                            <span style={{ color:"rgba(167,139,250,0.55)" }}>{l}:</span>
                            <strong style={{ color:"rgba(255,255,255,0.88)" }}>{v}</strong>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"8px", borderTop:"1px solid rgba(167,139,250,0.08)", paddingTop:"12px" }}>
                        {[["✅ Parcel matched in registry",true],["✅ Project matched (NH-48)",true]].map(([t],i)=>(
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12px", color:"#34d399", fontWeight:600 }}>{t}</div>
                        ))}
                        {ocrResult.checks.compMismatch && (
                          <div style={{ display:"flex", gap:"8px", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:"12px", padding:"10px 12px", fontSize:"12px", color:"#fbbf24", fontWeight:600 }}>
                            <AlertTriangle size={14} style={{ flexShrink:0, marginTop:"1px" }}/>
                            <div>Compensation amount mismatch<br/><span style={{ color:"rgba(167,139,250,0.45)", fontSize:"11px", fontWeight:400 }}>Registry: ₹5.80 Cr vs document: ₹48,50,000. Flagged for audit.</span></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", color:"rgba(167,139,250,0.35)", textAlign:"center" }}>
                      <FolderOpen size={36} style={{ marginBottom:"12px" }}/>
                      <p style={{ fontSize:"12px", fontWeight:600 }}>Select a sample PDF and run OCR scan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════ MOBILE FIELD ════════════════════════════════ */}
          {activeTab==="mobile-field" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px", alignItems:"center" }}>
              <div style={{ width:"100%", background:"#0f0f24", borderRadius:"16px", padding:"16px 20px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", border:"1px solid rgba(167,139,250,0.12)" }}>
                <div style={{ fontSize:"14px", fontWeight:800, color:"rgba(255,255,255,0.92)" }}>📱 m-Governance Field Collector App</div>
                <div style={{ fontSize:"12px", color:"rgba(167,139,250,0.5)", marginTop:"2px" }}>Simulates offline-capable parcel inspection with GPS tagging and photo upload.</div>
              </div>
              <div style={{ width:"340px", border:"8px solid #130e2e", borderRadius:"40px", background:"#0d0d1e", boxShadow:"0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.2)", overflow:"hidden" }}>
                <div style={{ background:"#0a0a1e", height:"20px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ width:"60px", height:"6px", background:"#1e1040", borderRadius:"3px" }}/>
                </div>
                <div style={{ padding:"8px 16px", background:"#0f0f24", borderBottom:"1px solid rgba(167,139,250,0.1)", display:"flex", justifyContent:"space-between", fontSize:"10px", fontWeight:700, color:"rgba(167,139,250,0.6)" }}>
                  <span>15:26</span>
                  <span style={{ display:"flex", alignItems:"center", gap:"5px" }}><span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#10b981", display:"inline-block", boxShadow:"0 0 6px #10b981", animation:"pulse 2s infinite" }}/>GPS Locked</span>
                </div>
                <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:"14px", maxHeight:"520px", overflowY:"auto", background:"#0d0d1e" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <div style={{ width:"36px", height:"36px", borderRadius:"12px", background:"linear-gradient(135deg,#f97316,#ef4444)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", boxShadow:"0 4px 12px rgba(239,68,68,0.4)" }}>📍</div>
                    <div>
                      <div style={{ fontSize:"13px", fontWeight:900, color:"rgba(255,255,255,0.92)" }}>Bhoomi Field Surveyor</div>
                      <div style={{ fontSize:"10px", color:"rgba(167,139,250,0.5)" }}>Section 4 boundary verification</div>
                    </div>
                  </div>
                  <div style={{ background:"rgba(167,139,250,0.06)", borderRadius:"12px", padding:"12px", border:"1px solid rgba(167,139,250,0.12)" }}>
                    <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", marginBottom:"6px" }}>Target Parcel</div>
                    <select value={mobileParcel} onChange={e=>setMobileParcel(e.target.value)}
                      style={{ width:"100%", border:"1px solid rgba(167,139,250,0.2)", borderRadius:"10px", padding:"8px", fontSize:"11px", background:"rgba(167,139,250,0.05)", color:"rgba(255,255,255,0.85)", fontWeight:600, cursor:"pointer", outline:"none" }}>
                      <option value="P-1048" style={{background:"#0f0f24"}}>P-1048 · 2.43 ac · Ankleshwar</option>
                      <option value="P-1050" style={{background:"#0f0f24"}}>P-1050 · 6.2 ac · Hansot</option>
                      <option value="P-AP01" style={{background:"#0f0f24"}}>P-AP01 · 4.8 ac · Nandyal</option>
                      <option value="P-RJ02" style={{background:"#0f0f24"}}>P-RJ02 · 5.2 ac · Tapukara SEZ</option>
                    </select>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"rgba(124,58,237,0.12)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:"10px", padding:"8px 10px", fontSize:"10px", color:"#c4b5fd", fontWeight:600 }}>
                    📡 GPS: <strong>21.6265° N, 73.0145° E</strong> · Accuracy: ±3m
                  </div>
                  {/* Photo */}
                  <div>
                    <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", marginBottom:"6px" }}>📷 Parcel Boundary Photo</div>
                    {mPhoto ? (
                      <div style={{ borderRadius:"12px", overflow:"hidden", height:"100px", position:"relative", background:"linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.1))", border:"1px solid rgba(16,185,129,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div style={{ fontSize:"13px", color:"#34d399", fontWeight:800, display:"flex", alignItems:"center", gap:"6px" }}><CheckCircle2 size={16}/> Photo Captured & Geotagged</div>
                      </div>
                    ) : (
                      <button onClick={()=>setMPhoto(true)}
                        style={{ width:"100%", height:"90px", border:"2px dashed rgba(167,139,250,0.25)", borderRadius:"12px", background:"transparent", color:"rgba(167,139,250,0.45)", cursor:"pointer", fontSize:"11px", fontWeight:600, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"6px", transition:"all 0.2s" }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.5)";e.currentTarget.style.background="rgba(167,139,250,0.05)";e.currentTarget.style.color="rgba(196,181,253,0.7)";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.25)";e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(167,139,250,0.45)";}}>
                        <Upload size={18}/> Tap to Capture
                      </button>
                    )}
                  </div>
                  {/* Checklist */}
                  <div style={{ borderTop:"1px solid rgba(167,139,250,0.1)", paddingTop:"10px", display:"flex", flexDirection:"column", gap:"8px" }}>
                    <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase" }}>Verification Checklist</div>
                    {[["Boundary demarcated",mBoundary,setMBoundary],["Owner identity verified",mOwner,setMOwner],["Compensation verified",mComp,setMComp],["R&R complete",mRR,setMRR]].map(([label,val,setter],i)=>(
                      <label key={i} style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600, color:val?"rgba(196,181,253,0.85)":"rgba(167,139,250,0.5)" }}>
                        <input type="checkbox" checked={val} onChange={e=>setter(e.target.checked)} style={{ width:"16px", height:"16px", accentColor:"#a78bfa", cursor:"pointer" }}/>
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ padding:"12px", background:"#0f0f24", borderTop:"1px solid rgba(167,139,250,0.1)" }}>
                  <button onClick={handleMobileSubmit}
                    style={{ width:"100%", padding:"11px", borderRadius:"14px", border:"none", background:"linear-gradient(135deg,#5b21b6,#7c3aed)", color:"white", fontWeight:800, fontSize:"13px", cursor:"pointer", boxShadow:"0 4px 16px rgba(124,58,237,0.4)", transition:"all 0.2s" }}>
                    {mSubmitted ? "Syncing to LACC GIS Command Centre..." : "Submit Verification Report"}
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 4px 16px rgba(124,58,237,0.5), 0 0 30px rgba(124,58,237,0.2); }
          50%      { box-shadow: 0 4px 24px rgba(167,139,250,0.7), 0 0 50px rgba(167,139,250,0.35); }
        }
        @keyframes slide-in-right {
          from { opacity:0; transform:translateX(20px); }
          to   { opacity:1; transform:translateX(0);    }
        }
      `}</style>
    </div>
  );
}

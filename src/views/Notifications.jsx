import React, { useState } from "react";
import { Bell, CheckCheck, Filter } from "lucide-react";

const PRIORITY_CFG = {
  high:   { bg:"rgba(239,68,68,0.15)",  text:"#f87171", border:"rgba(239,68,68,0.3)",   dot:"#ef4444", label:"High Priority"   },
  medium: { bg:"rgba(245,158,11,0.15)", text:"#fbbf24", border:"rgba(245,158,11,0.3)",  dot:"#f59e0b", label:"Medium Priority" },
  low:    { bg:"rgba(16,185,129,0.15)", text:"#34d399", border:"rgba(16,185,129,0.3)", dot:"#10b981", label:"Low Priority"    },
};

const card = { background:"#0f0f24", borderRadius:"16px", border:"1px solid rgba(167,139,250,0.12)", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" };

export default function Notifications({ notifications, onMarkRead, onMarkAllRead }) {
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly]  = useState(false);

  const filtered = notifications.filter(n => {
    if (showUnreadOnly && n.read) return false;
    if (priorityFilter !== "all" && n.priority !== priorityFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      {/* Header */}
      <div style={{ ...card, padding:"20px", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.15em" }}>System Alerts</div>
          <h2 style={{ fontSize:"18px", fontWeight:900, color:"rgba(255,255,255,0.92)", margin:"2px 0 0", display:"flex", alignItems:"center", gap:"10px" }}>
            Notifications
            {unreadCount>0 && (
              <span style={{ width:"24px", height:"24px", borderRadius:"50%", background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"white", fontSize:"10px", fontWeight:900, display:"inline-flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 10px rgba(239,68,68,0.5)" }}>{unreadCount}</span>
            )}
          </h2>
          <p style={{ fontSize:"11px", color:"rgba(167,139,250,0.5)", marginTop:"2px" }}>{unreadCount} unread · {notifications.length} total notifications</p>
        </div>
        <button onClick={onMarkAllRead}
          style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 16px", border:"1px solid rgba(167,139,250,0.2)", borderRadius:"12px", fontSize:"12px", fontWeight:700, color:"rgba(196,181,253,0.7)", background:"rgba(167,139,250,0.06)", cursor:"pointer", transition:"all 0.18s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.4)";e.currentTarget.style.color="rgba(196,181,253,0.9)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.2)";e.currentTarget.style.color="rgba(196,181,253,0.7)";}}>
          <CheckCheck size={14}/> Mark All as Read
        </button>
      </div>

      {/* Filters */}
      <div style={{ ...card, padding:"14px 18px", display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
        <Filter size={13} style={{ color:"rgba(167,139,250,0.4)", flexShrink:0 }}/>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {["all","high","medium","low"].map(p=>(
            <button key={p} onClick={()=>setPriorityFilter(p)}
              style={{ padding:"6px 14px", borderRadius:"10px", fontSize:"11px", fontWeight:700, cursor:"pointer", transition:"all 0.15s", border:`1px solid ${priorityFilter===p?"rgba(167,139,250,0.5)":"rgba(167,139,250,0.15)"}`, background:priorityFilter===p?"linear-gradient(135deg,rgba(124,58,237,0.3),rgba(167,139,250,0.15))":"rgba(167,139,250,0.04)", color:priorityFilter===p?"#c4b5fd":"rgba(167,139,250,0.55)" }}>
              {p==="all"?"All Priorities":p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"8px" }}>
          <label style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", fontSize:"12px", fontWeight:700, color:"rgba(167,139,250,0.6)" }}>
            <input type="checkbox" checked={showUnreadOnly} onChange={e=>setShowUnreadOnly(e.target.checked)} style={{ width:"16px", height:"16px", accentColor:"#a78bfa", cursor:"pointer" }}/>
            Unread only
          </label>
        </div>
      </div>

      {/* Priority summary chips */}
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
        {["high","medium","low"].map(p=>{
          const count = notifications.filter(n=>n.priority===p).length;
          const cfg = PRIORITY_CFG[p];
          return (
            <button key={p} onClick={()=>setPriorityFilter(priorityFilter===p?"all":p)}
              style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 16px", borderRadius:"12px", border:`1px solid ${priorityFilter===p?cfg.border:"rgba(167,139,250,0.15)"}`, background:priorityFilter===p?cfg.bg:"rgba(167,139,250,0.04)", fontSize:"11px", fontWeight:700, cursor:"pointer", color:priorityFilter===p?cfg.text:"rgba(167,139,250,0.55)", transition:"all 0.15s" }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:cfg.dot, boxShadow:`0 0 6px ${cfg.dot}` }}/>
              {cfg.label}: {count}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        {filtered.length===0 ? (
          <div style={{ ...card, padding:"48px", textAlign:"center", color:"rgba(167,139,250,0.4)" }}>
            <Bell style={{ margin:"0 auto 12px", display:"block" }} size={36}/>
            <p style={{ fontSize:"13px", fontWeight:600 }}>No notifications match the selected filters.</p>
          </div>
        ) : (
          filtered.map(n=>{
            const cfg = PRIORITY_CFG[n.priority];
            return (
              <div key={n.id} onClick={()=>onMarkRead(n.id)}
                style={{ background:"#0f0f24", borderRadius:"14px", padding:"16px", border:`1px solid ${n.read?"rgba(167,139,250,0.08)":"rgba(167,139,250,0.2)"}`, borderLeft:`4px solid ${n.read?"rgba(167,139,250,0.1)":cfg.dot}`, cursor:"pointer", opacity:n.read?0.6:1, transition:"all 0.2s", boxShadow:"0 2px 12px rgba(0,0,0,0.3)" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=n.read?"rgba(167,139,250,0.15)":"rgba(167,139,250,0.35)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.4)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=n.read?"rgba(167,139,250,0.08)":"rgba(167,139,250,0.2)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.3)";}}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"12px" }}>
                  <div style={{ fontSize:"24px", flexShrink:0, marginTop:"2px" }}>{n.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px", flexWrap:"wrap" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                        <p style={{ fontSize:"13px", fontWeight:700, color:n.read?"rgba(167,139,250,0.6)":"rgba(255,255,255,0.9)" }}>{n.title}</p>
                        <span style={{ padding:"2px 10px", fontSize:"9px", fontWeight:700, borderRadius:"99px", background:cfg.bg, color:cfg.text, border:`1px solid ${cfg.border}` }}>{cfg.label}</span>
                        {!n.read && <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#a78bfa", flexShrink:0, boxShadow:"0 0 6px rgba(167,139,250,0.6)", display:"inline-block" }}/>}
                      </div>
                      <span style={{ fontSize:"10px", color:"rgba(167,139,250,0.4)", fontWeight:600, flexShrink:0 }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize:"12px", marginTop:"4px", lineHeight:1.6, color:n.read?"rgba(167,139,250,0.4)":"rgba(196,181,253,0.7)" }}>{n.message}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"8px" }}>
                      <span style={{ fontSize:"10px", fontWeight:700, color:"rgba(167,139,250,0.5)", background:"rgba(167,139,250,0.08)", padding:"2px 10px", borderRadius:"6px", border:"1px solid rgba(167,139,250,0.12)" }}>{n.project}</span>
                      {!n.read && <span style={{ fontSize:"10px", color:"#a78bfa", fontWeight:600 }}>Click to mark as read</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

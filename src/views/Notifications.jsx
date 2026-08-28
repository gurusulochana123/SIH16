import React, { useState } from "react";
import { Bell, CheckCheck, Filter } from "lucide-react";

const PRIORITY_CONFIG = {
  high:   { badge: "bg-red-100 text-red-800 border-red-200",    dot: "bg-red-500",    label: "High Priority"   },
  medium: { badge: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500", label: "Medium Priority" },
  low:    { badge: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500", label: "Low Priority" },
};

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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SYSTEM ALERTS</span>
          <h2 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{unreadCount} unread · {notifications.length} total notifications</p>
        </div>
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <CheckCheck size={14} /> Mark All as Read
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 flex-wrap">
        <Filter size={14} className="text-slate-400 shrink-0" />
        <div className="flex gap-2 flex-wrap">
          {["all", "high", "medium", "low"].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                priorityFilter === p
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {p === "all" ? "All Priorities" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={e => setShowUnreadOnly(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            Unread only
          </label>
        </div>
      </div>

      {/* Priority summary chips */}
      <div className="flex gap-3 flex-wrap">
        {["high", "medium", "low"].map(p => {
          const count = notifications.filter(n => n.priority === p).length;
          const cfg   = PRIORITY_CONFIG[p];
          return (
            <button
              key={p}
              onClick={() => setPriorityFilter(priorityFilter === p ? "all" : p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                priorityFilter === p ? `${cfg.badge} border` : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}: {count}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Bell className="mx-auto text-slate-300 mb-3" size={36} />
            <p className="text-slate-500 font-semibold">No notifications match the selected filters.</p>
          </div>
        ) : (
          filtered.map(n => {
            const cfg = PRIORITY_CONFIG[n.priority];
            return (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all ${
                  n.read ? "border-slate-200 opacity-70" : "border-slate-200 border-l-4 border-l-current"
                }`}
                style={!n.read ? { borderLeftColor: n.priority === "high" ? "#ef4444" : n.priority === "medium" ? "#f59e0b" : "#10b981" } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0 mt-0.5">{n.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-bold ${n.read ? "text-slate-600" : "text-slate-900"}`}>{n.title}</p>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${cfg.badge}`}>{cfg.label}</span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Unread" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0">{n.time}</span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${n.read ? "text-slate-400" : "text-slate-600"}`}>{n.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {n.project}
                      </span>
                      {!n.read && (
                        <span className="text-[10px] text-blue-500 font-semibold">Click to mark as read</span>
                      )}
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

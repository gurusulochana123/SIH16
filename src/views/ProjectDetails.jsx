[import React, { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle, ChevronLeft, FileText, Users, MapPin } from "lucide-react";

const STAGE_CONFIG = {
  completed: { color: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2, label: "Completed" },
  inprogress: { color: "bg-blue-500", border: "border-blue-500", text: "text-blue-700", badge: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock, label: "In Progress" },
  pending: { color: "bg-slate-300", border: "border-slate-300", text: "text-slate-500", badge: "bg-slate-100 text-slate-600 border-slate-200", icon: Clock, label: "Pending" },
  delayed: { color: "bg-red-500", border: "border-red-500", text: "text-red-700", badge: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle, label: "Delayed" },
};

const ACTION_MAP = {
  "District Verification": { label: "✔ Verify", nextStatus: "completed", nextStage: 2 },
  "State Approval": { label: "✔ Approve", nextStatus: "completed", nextStage: 3 },
  "Notification (Sec 11)": { label: "📢 Issue Notification", nextStatus: "completed", nextStage: 4 },
  "Land Survey": { label: "📐 Mark Survey Done", nextStatus: "completed", nextStage: 5 },
  "Award Declaration": { label: "🏆 Declare Award", nextStatus: "completed", nextStage: 6 },
  "Compensation Payment": { label: "💰 Mark Comp. Paid", nextStatus: "completed", nextStage: 7 },
  "Land Possession": { label: "🏠 Mark Possession", nextStatus: "completed", nextStage: 8 },
  "R&R Completion": { label: "✅ Complete R&R", nextStatus: "completed", nextStage: 9 },
  "Project Completed": { label: "🎉 Close Project", nextStatus: "completed", nextStage: 9 },
};

export default function ProjectDetails({ project, onBack, onUpdateProject }) {
  const [stages, setStages] = useState(project.workflowStages);
  const [toast, setToast] = useState(null);
  const [activeParcel, setActiveParcel] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (stageName, stageIdx) => {
    const action = ACTION_MAP[stageName];
    if (!action) return;

    const updated = stages.map((s, i) => {
      if (i === stageIdx) {
        return { ...s, status: action.nextStatus, date: new Date().toISOString().slice(0, 10) };
      }
      // Unlock next stage
      if (i === stageIdx + 1 && s.status === "pending") {
        return { ...s, status: "inprogress" };
      }
      return s;
    });

    setStages(updated);
    const updatedProject = { ...project, workflowStages: updated };

    // Also update progress
    const done = updated.filter(s => s.status === "completed").length;
    updatedProject.progressPercentage = Math.round((done / updated.length) * 100);
    if (done === updated.length) updatedProject.overallStatus = "Completed";

    onUpdateProject(updatedProject);
    showToast(`✅ Stage "${stageName}" updated successfully!`);
  };

  const pct = Math.round((stages.filter(s => s.status === "completed").length / stages.length) * 100);

  return (
    <div className="flex flex-col gap-6 relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      {/* Back + Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors">
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PROJECT DETAILS</span>
            <h2 className="text-base font-black text-slate-900 mt-0.5 leading-tight">{project.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{project.state} · {project.district} · {project.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500">Overall Progress</p>
            <p className="text-2xl font-black text-blue-600">{pct}%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle cx="20" cy="20" r="16" fill="none" stroke="#3b82f6" strokeWidth="4"
                strokeDasharray={`${(pct / 100) * 100.53} 100.53`} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Land Proposed", value: `${project.landProposedAcres} ac`, color: "text-slate-800" },
          { label: "Land Acquired", value: `${project.landAcquiredAcres} ac`, color: "text-emerald-600" },
          { label: "Comp. Assessed", value: `₹${project.compensationAssessedCr} Cr`, color: "text-sky-600" },
          { label: "Comp. Paid", value: `₹${project.compensationPaidCr} Cr`, color: "text-blue-600" },
          { label: "Affected Families", value: project.affectedFamiliesCount, color: "text-purple-600" },
          { label: "R&R Completed", value: `${project.rrCompletedCount}/${project.affectedFamiliesCount}`, color: "text-emerald-600" },
        ].map((k, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k.label}</p>
            <p className={`text-lg font-black mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Workflow Timeline */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-500 rounded-full block" />
          Acquisition Workflow Timeline
        </h3>

        <div className="flex flex-col gap-0">
          {stages.map((stage, idx) => {
            const cfg = STAGE_CONFIG[stage.status] || STAGE_CONFIG.pending;
            const Icon = cfg.icon;
            const isLast = idx === stages.length - 1;
            const canAct = (stage.status === "inprogress" || stage.status === "pending") && ACTION_MAP[stage.name];

            return (
              <div key={idx} className="flex gap-4">
                {/* Left: connector + icon */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-white ${cfg.border}`}>
                    <Icon size={14} className={cfg.text} />
                  </div>
                  {!isLast && <div className={`w-0.5 flex-1 my-1 ${stage.status === "completed" ? "bg-emerald-400" : "bg-slate-200"}`} />}
                </div>

                {/* Right: content */}
                <div className={`flex-1 pb-6 ${isLast ? "" : ""}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{stage.name}</h4>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold border ${cfg.badge}`}>{cfg.label}</span>
                        {stage.status === "delayed" && <span className="text-[10px] text-red-600 font-bold">⚠️ OVERDUE</span>}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Users size={10} /> {stage.authority}</span>
                        {stage.date && <span className="flex items-center gap-1"><Clock size={10} /> {stage.date}</span>}
                      </div>
                      {stage.remarks && (
                        <p className="mt-1.5 text-[11px] text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-100">
                          {stage.remarks}
                        </p>
                      )}
                    </div>
                    {canAct && (
                      <button
                        onClick={() => handleAction(stage.name, idx)}
                        className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-all shadow-md shadow-blue-600/20"
                      >
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
      {project.parcels && project.parcels.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-5 bg-amber-500 rounded-full block" /> Land Parcels ({project.parcels.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Parcel ID", "Survey No.", "Village", "Owner", "Area (Acres)", "Compensation", "Possession", "R&R", "Risk"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.parcels.map(parcel => (
                  <tr key={parcel.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setActiveParcel(activeParcel?.id === parcel.id ? null : parcel)}>
                    <td className="px-4 py-3 font-bold font-mono text-slate-700">{parcel.id}</td>
                    <td className="px-4 py-3 text-slate-600">{parcel.surveyNo}</td>
                    <td className="px-4 py-3 text-slate-600">{parcel.village}</td>
                    <td className="px-4 py-3 text-slate-700 font-semibold max-w-[140px] truncate" title={parcel.owner}>{parcel.owner}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{parcel.areaAcres}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parcel.compensationStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {parcel.compensationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parcel.possessionStatus === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                        {parcel.possessionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parcel.rrStatus === "Completed" ? "bg-emerald-100 text-emerald-800" : parcel.rrStatus === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"}`}>
                        {parcel.rrStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parcel.risk === "HIGH" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>
                        {parcel.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Parcel detail pop-in */}
          {activeParcel && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="font-bold text-slate-800">Parcel {activeParcel.id} – Detail View</p>
                <button onClick={() => setActiveParcel(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><XCircle size={14} /></button>
              </div>
              {activeParcel.dispute && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-800">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                  <span><strong>Dispute:</strong> {activeParcel.dispute}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-slate-700">
                <span>Families: <strong>{activeParcel.familiesCount}</strong></span>
                <span>Award: <strong>{activeParcel.awardStatus}</strong></span>
                <span>Notification: <strong>{activeParcel.notificationStatus}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit Trail */}
      {project.auditTrail && project.auditTrail.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-5 bg-slate-400 rounded-full block" /> Audit Trail
          </h3>
          <div className="flex flex-col gap-2">
            {project.auditTrail.map((log, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                  {log.user.slice(0, 1)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-600">{log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-700 font-semibold">{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

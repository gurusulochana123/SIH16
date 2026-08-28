import React, { useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";
import { rrProgressData } from "../data/mockData";

const COMP_COLORS = { paid: "#10b981", pending: "#f59e0b" };

export default function CompensationRR({ projects }) {
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || "");
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Aggregate totals
  const totalAssessed   = projects.reduce((s, p) => s + p.compensationAssessedCr, 0);
  const totalPaid       = projects.reduce((s, p) => s + p.compensationPaidCr, 0);
  const totalPending    = totalAssessed - totalPaid;
  const totalBeneficiaries = projects.reduce((s, p) => s + p.affectedFamiliesCount, 0);

  const totalAffected   = projects.reduce((s, p) => s + p.affectedFamiliesCount, 0);
  const totalDisplaced  = projects.reduce((s, p) => s + p.displacedFamiliesCount, 0);
  const totalRRDone     = projects.reduce((s, p) => s + p.rrCompletedCount, 0);
  const totalRRPending  = totalDisplaced - totalRRDone;

  const paidPct   = Math.round((totalPaid / totalAssessed) * 100);
  const rrPct     = totalDisplaced > 0 ? Math.round((totalRRDone / totalDisplaced) * 100) : 0;

  const compProjectData = projects.map(p => ({
    name: p.shortName,
    Assessed: p.compensationAssessedCr,
    Paid:     p.compensationPaidCr,
    Pending:  p.compensationAssessedCr - p.compensationPaidCr,
  }));

  const compPieData = [
    { name: "Paid",    value: totalPaid,    color: "#10b981" },
    { name: "Pending", value: totalPending, color: "#f59e0b" },
  ];

  const rrPieData = [
    { name: "Rehabilitated", value: totalRRDone,    color: "#10b981" },
    { name: "Pending",       value: totalRRPending,  color: "#f59e0b" },
    { name: "Non-displaced", value: totalAffected - totalDisplaced, color: "#e2e8f0" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FINANCIAL & SOCIAL</span>
        <h2 className="text-lg font-black text-slate-900 mt-0.5">Compensation & R&R Dashboard</h2>
        <p className="text-xs text-slate-500 mt-0.5">Track compensation disbursement and rehabilitation status across all projects.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Assessed",     value: `₹${totalAssessed} Cr`,   sub: "Compensation liability",  color: "text-slate-900", accent: "border-l-slate-400" },
          { label: "Total Paid",         value: `₹${totalPaid} Cr`,       sub: `${paidPct}% disbursed`,   color: "text-emerald-600", accent: "border-l-emerald-500" },
          { label: "Pending Amount",     value: `₹${totalPending} Cr`,    sub: "Awaiting disbursement",   color: "text-amber-600", accent: "border-l-amber-500" },
          { label: "Total Beneficiaries",value: totalBeneficiaries,        sub: "Registered families",     color: "text-purple-600", accent: "border-l-purple-500" },
        ].map((k, i) => (
          <div key={i} className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 ${k.accent}`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k.label}</p>
            <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-slate-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Compensation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Project-wise Compensation (₹ Crore)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={compProjectData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(val) => `₹${val} Cr`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Paid"    fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-slate-900 mb-4 self-start">Disbursement Status</h3>
          <PieChart width={180} height={180}>
            <Pie data={compPieData} cx={90} cy={90} innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
              {compPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(val) => `₹${val} Cr`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          </PieChart>
          <div className="flex flex-col gap-2 text-xs mt-2">
            {compPieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="font-semibold text-slate-700">{d.name}: ₹{d.value} Cr ({Math.round((d.value / totalAssessed) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project-wise progress bars */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Project-wise Compensation Progress</h3>
        <div className="flex flex-col gap-4">
          {projects.map(p => {
            const pct = p.compensationAssessedCr > 0 ? Math.round((p.compensationPaidCr / p.compensationAssessedCr) * 100) : 0;
            return (
              <div key={p.id} className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">{p.shortName}</span>
                    <span className="text-slate-400 ml-2">{p.state}</span>
                  </div>
                  <span className="font-bold text-slate-700">₹{p.compensationPaidCr} / ₹{p.compensationAssessedCr} Cr ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-sky-500" : "bg-amber-500"}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rehabilitation & Resettlement (R&R)</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* R&R KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Affected Families",   value: totalAffected,  sub: "Registered in NLAMS",     color: "text-slate-900",   accent: "border-l-slate-400"   },
          { label: "Displaced Families",         value: totalDisplaced, sub: "Require rehabilitation",  color: "text-orange-600",  accent: "border-l-orange-500"  },
          { label: "Rehabilitation Completed",   value: totalRRDone,    sub: `${rrPct}% rehabilitated`, color: "text-emerald-600", accent: "border-l-emerald-500" },
          { label: "Rehabilitation Pending",     value: totalRRPending, sub: "Awaiting R&R completion", color: "text-red-600",     accent: "border-l-red-500"     },
        ].map((k, i) => (
          <div key={i} className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 ${k.accent}`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k.label}</p>
            <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-slate-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* R&R Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">State-wise R&R Progress</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={rrProgressData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="state" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="affected"      fill="#e2e8f0" name="Affected"       radius={[4,4,0,0]} />
              <Bar dataKey="displaced"     fill="#f59e0b" name="Displaced"      radius={[4,4,0,0]} />
              <Bar dataKey="rehabilitated" fill="#10b981" name="Rehabilitated"  radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="text-sm font-bold text-slate-900 mb-4 self-start">R&R Status (Displaced)</h3>
          <PieChart width={180} height={180}>
            <Pie data={rrPieData.filter(d => d.name !== "Non-displaced")} cx={90} cy={90} innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
              {rrPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          </PieChart>
          <div className="flex flex-col gap-2 text-xs mt-2">
            {rrPieData.slice(0, 2).map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="font-semibold text-slate-700">{d.name}: {d.value} families</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project R&R breakdown table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Project-wise R&R Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Project", "State", "Affected", "Displaced", "R&R Done", "Pending", "Progress"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map(p => {
                const pending = p.displacedFamiliesCount - p.rrCompletedCount;
                const pct2 = p.displacedFamiliesCount > 0 ? Math.round((p.rrCompletedCount / p.displacedFamiliesCount) * 100) : 100;
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800">{p.shortName}</td>
                    <td className="px-4 py-3 text-slate-600">{p.state}</td>
                    <td className="px-4 py-3 font-semibold">{p.affectedFamiliesCount}</td>
                    <td className="px-4 py-3 font-semibold text-orange-600">{p.displacedFamiliesCount}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{p.rrCompletedCount}</td>
                    <td className="px-4 py-3 font-semibold text-red-600">{pending}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct2 === 100 ? "bg-emerald-500" : pct2 >= 50 ? "bg-sky-500" : "bg-amber-500"}`}
                            style={{ width: `${pct2}%` }} />
                        </div>
                        <span className="font-bold text-slate-700">{pct2}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

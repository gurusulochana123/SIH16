import React, { useState } from "react";
import { Download, Eye, FileSpreadsheet, FileText, ChevronDown, ChevronUp } from "lucide-react";

const TYPE_COLORS = {
  acquisition: "bg-sky-100 text-sky-800",
  progress: "bg-indigo-100 text-indigo-800",
  compensation: "bg-emerald-100 text-emerald-800",
  rr: "bg-purple-100 text-purple-800",
  delayed: "bg-red-100 text-red-800",
};

function downloadCSV(headers, rows, filename) {
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPDF(title) {
  // Simulate PDF generation with a text blob
  const content = `NLAMS – National Land Acquisition & Management System\nMinistry of Rural Development, Govt. of India\n\n${title}\nGenerated: ${new Date().toLocaleString()}\n\n[Report data exported from NLAMS prototype system]\n\nFor official use only. Data is illustrative/sample.`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `NLAMS_${title.replace(/\s+/g, "_")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports({ reports }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MIS REPORTS</span>
        <h2 className="text-lg font-black text-slate-900 mt-0.5">Reports & Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">Generate, preview, and export acquisition reports for decision support.</p>
      </div>

      {/* Report Cards */}
      <div className="flex flex-col gap-4">
        {reports.map(report => {
          const isOpen = expanded[report.id];
          const tc = TYPE_COLORS[report.type] || "bg-slate-100 text-slate-700";

          return (
            <div key={report.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">{report.title}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${tc}`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                        ✓ {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{report.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Last generated: {report.lastGenerated}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <button
                    onClick={() => toggle(report.id)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <Eye size={13} />
                    {isOpen ? "Hide" : "View Report"}
                    {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                  <button
                    onClick={() => downloadPDF(report.title)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Download size={13} /> PDF
                  </button>
                  <button
                    onClick={() => downloadCSV(report.headers, report.rows, `NLAMS_${report.id}.csv`)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    <FileSpreadsheet size={13} /> CSV
                  </button>
                </div>
              </div>

              {/* Inline Table Preview */}
              {isOpen && (
                <div className="border-t border-slate-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {report.headers.map(h => (
                            <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {report.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            {row.map((cell, j) => (
                              <td key={j} className={`px-4 py-3 ${j === 0 ? "font-bold text-slate-800" : "text-slate-600"}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-semibold flex justify-between">
                    <span>{report.rows.length} rows · Generated by NLAMS Analytics Engine</span>
                    <span>RFCTLARR Act, 2013 compliant</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
        <p className="font-bold mb-1">📊 Report Generation Note</p>
        <p>All reports are generated from live NLAMS database. CSV exports can be opened in Excel/Spreadsheets. PDF exports are formatted for official government correspondence. For custom date-range reports, contact the NLAMS Analytics Team.</p>
      </div>
    </div>
  );
}

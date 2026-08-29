import React, { useState } from "react";
import { Download, Eye, FileSpreadsheet, FileText, ChevronDown, ChevronUp } from "lucide-react";

const TYPE_CFG = {
  acquisition:  { bg:"rgba(56,189,248,0.15)",  text:"#7dd3fc" },
  progress:     { bg:"rgba(99,102,241,0.15)",   text:"#a78bfa" },
  compensation: { bg:"rgba(16,185,129,0.15)",   text:"#34d399" },
  rr:           { bg:"rgba(167,139,250,0.15)",  text:"#c4b5fd" },
  delayed:      { bg:"rgba(239,68,68,0.15)",    text:"#f87171" },
};

function downloadCSV(headers, rows, filename) {
  const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
  const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
}
function downloadPDF(title) {
  const content = `NLAMS – National Land Acquisition & Management System\nMinistry of Rural Development, Govt. of India\n\n${title}\nGenerated: ${new Date().toLocaleString()}\n\n[Report data exported from NLAMS prototype system]\n\nFor official use only. Data is illustrative/sample.`;
  const blob = new Blob([content],{type:"text/plain"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`NLAMS_${title.replace(/\s+/g,"_")}.txt`; a.click();
  URL.revokeObjectURL(url);
}

const card = { background:"#0f0f24", borderRadius:"16px", border:"1px solid rgba(167,139,250,0.12)", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" };

export default function Reports({ reports }) {
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded(prev=>({...prev,[id]:!prev[id]}));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      {/* Header */}
      <div style={{ ...card, padding:"20px" }}>
        <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.15em" }}>MIS Reports</div>
        <h2 style={{ fontSize:"18px", fontWeight:900, color:"rgba(255,255,255,0.92)", margin:"2px 0 0" }}>Reports & Analytics</h2>
        <p style={{ fontSize:"11px", color:"rgba(167,139,250,0.5)", marginTop:"2px" }}>Generate, preview, and export acquisition reports for decision support.</p>
      </div>

      {/* Report Cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
        {reports.map(report=>{
          const isOpen = expanded[report.id];
          const tc = TYPE_CFG[report.type] || { bg:"rgba(167,139,250,0.1)", text:"#a78bfa" };
          return (
            <div key={report.id} style={{ ...card, overflow:"hidden" }}>
              {/* Card Header */}
              <div style={{ padding:"18px 20px", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"12px" }}>
                  <div style={{ width:"40px", height:"40px", background:"rgba(124,58,237,0.2)", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"1px solid rgba(167,139,250,0.2)", boxShadow:"0 0 12px rgba(124,58,237,0.2)" }}>
                    <FileText size={18} style={{ color:"#a78bfa" }}/>
                  </div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                      <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>{report.title}</h3>
                      <span style={{ padding:"2px 10px", fontSize:"9px", fontWeight:700, borderRadius:"99px", background:tc.bg, color:tc.text }}>{report.type.charAt(0).toUpperCase()+report.type.slice(1)}</span>
                      <span style={{ padding:"2px 10px", fontSize:"9px", fontWeight:700, borderRadius:"99px", background:"rgba(16,185,129,0.15)", color:"#34d399" }}>✓ {report.status}</span>
                    </div>
                    <p style={{ fontSize:"11px", color:"rgba(167,139,250,0.5)", marginTop:"3px" }}>{report.description}</p>
                    <p style={{ fontSize:"10px", color:"rgba(167,139,250,0.35)", marginTop:"2px" }}>Last generated: {report.lastGenerated}</p>
                  </div>
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", flexShrink:0 }}>
                  <button onClick={()=>toggle(report.id)}
                    style={{ display:"flex", alignItems:"center", gap:"6px", padding:"7px 14px", border:"1px solid rgba(167,139,250,0.2)", borderRadius:"10px", fontSize:"11px", fontWeight:700, color:"rgba(196,181,253,0.7)", background:"rgba(167,139,250,0.06)", cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.4)";e.currentTarget.style.color="rgba(196,181,253,0.9)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,0.2)";e.currentTarget.style.color="rgba(196,181,253,0.7)";}}>
                    <Eye size={12}/>
                    {isOpen?"Hide":"View Report"}
                    {isOpen?<ChevronUp size={12}/>:<ChevronDown size={12}/>}
                  </button>
                  <button onClick={()=>downloadPDF(report.title)}
                    style={{ display:"flex", alignItems:"center", gap:"6px", padding:"7px 14px", background:"rgba(30,16,64,0.8)", border:"1px solid rgba(167,139,250,0.25)", borderRadius:"10px", fontSize:"11px", fontWeight:700, color:"#c4b5fd", cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.25)";e.currentTarget.style.borderColor="rgba(167,139,250,0.5)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(30,16,64,0.8)";e.currentTarget.style.borderColor="rgba(167,139,250,0.25)";}}>
                    <Download size={12}/> PDF
                  </button>
                  <button onClick={()=>downloadCSV(report.headers,report.rows,`NLAMS_${report.id}.csv`)}
                    style={{ display:"flex", alignItems:"center", gap:"6px", padding:"7px 14px", background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:"10px", fontSize:"11px", fontWeight:700, color:"#34d399", cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(16,185,129,0.25)";e.currentTarget.style.borderColor="rgba(16,185,129,0.5)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(16,185,129,0.15)";e.currentTarget.style.borderColor="rgba(16,185,129,0.3)";}}>
                    <FileSpreadsheet size={12}/> CSV
                  </button>
                </div>
              </div>

              {/* Inline Table Preview */}
              {isOpen && (
                <div style={{ borderTop:"1px solid rgba(167,139,250,0.1)" }}>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
                      <thead style={{ background:"rgba(167,139,250,0.06)" }}>
                        <tr>
                          {report.headers.map(h=>(
                            <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.55)", textTransform:"uppercase", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {report.rows.map((row,i)=>(
                          <tr key={i} style={{ borderTop:"1px solid rgba(167,139,250,0.07)", transition:"background 0.15s" }}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(167,139,250,0.04)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            {row.map((cell,j)=>(
                              <td key={j} style={{ padding:"10px 14px", color:j===0?"rgba(255,255,255,0.85)":"rgba(167,139,250,0.65)", fontWeight:j===0?700:400 }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding:"10px 18px", background:"rgba(167,139,250,0.03)", borderTop:"1px solid rgba(167,139,250,0.07)", fontSize:"10px", color:"rgba(167,139,250,0.4)", fontWeight:600, display:"flex", justifyContent:"space-between" }}>
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
      <div style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:"14px", padding:"16px 18px", fontSize:"12px", color:"rgba(196,181,253,0.8)" }}>
        <p style={{ fontWeight:700, marginBottom:"4px", color:"#c4b5fd" }}>📊 Report Generation Note</p>
        <p>All reports are generated from live NLAMS database. CSV exports can be opened in Excel/Spreadsheets. PDF exports are formatted for official government correspondence. For custom date-range reports, contact the NLAMS Analytics Team.</p>
      </div>
    </div>
  );
}

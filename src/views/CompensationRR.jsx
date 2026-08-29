import React, { useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";
import { rrProgressData } from "../data/mockData";

const card = { background:"#0f0f24", borderRadius:"16px", border:"1px solid rgba(167,139,250,0.12)", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" };
const tooltipS = { fontSize:11, borderRadius:10, border:"1px solid rgba(167,139,250,0.2)", background:"#13132b", color:"#e2e8f0", boxShadow:"0 8px 32px rgba(0,0,0,0.5)" };

export default function CompensationRR({ projects }) {
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || "");
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const totalAssessed      = projects.reduce((s,p)=>s+p.compensationAssessedCr,0);
  const totalPaid          = projects.reduce((s,p)=>s+p.compensationPaidCr,0);
  const totalPending       = totalAssessed - totalPaid;
  const totalBeneficiaries = projects.reduce((s,p)=>s+p.affectedFamiliesCount,0);
  const totalAffected      = projects.reduce((s,p)=>s+p.affectedFamiliesCount,0);
  const totalDisplaced     = projects.reduce((s,p)=>s+p.displacedFamiliesCount,0);
  const totalRRDone        = projects.reduce((s,p)=>s+p.rrCompletedCount,0);
  const totalRRPending     = totalDisplaced - totalRRDone;
  const paidPct = Math.round((totalPaid/totalAssessed)*100);
  const rrPct   = totalDisplaced>0?Math.round((totalRRDone/totalDisplaced)*100):0;

  const compProjectData = projects.map(p=>({ name:p.shortName, Paid:p.compensationPaidCr, Pending:p.compensationAssessedCr-p.compensationPaidCr }));
  const compPieData = [{ name:"Paid",value:totalPaid,color:"#10b981" },{ name:"Pending",value:totalPending,color:"#f59e0b" }];
  const rrPieData   = [{ name:"Rehabilitated",value:totalRRDone,color:"#10b981" },{ name:"Pending",value:totalRRPending,color:"#f59e0b" }];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      {/* Header */}
      <div style={{ ...card, padding:"20px" }}>
        <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.15em" }}>Financial & Social</div>
        <h2 style={{ fontSize:"18px", fontWeight:900, color:"rgba(255,255,255,0.92)", margin:"2px 0 0" }}>Compensation & R&R Dashboard</h2>
        <p style={{ fontSize:"11px", color:"rgba(167,139,250,0.5)", marginTop:"2px" }}>Track compensation disbursement and rehabilitation status across all projects.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
        {[
          { label:"Total Assessed",      value:`₹${totalAssessed} Cr`,  sub:"Compensation liability",  gradient:"linear-gradient(135deg,#1e0f50,#2d1568)", accent:"rgba(167,139,250,0.6)" },
          { label:"Total Paid",          value:`₹${totalPaid} Cr`,      sub:`${paidPct}% disbursed`,   gradient:"linear-gradient(135deg,#052e16,#0a3d1f)", accent:"rgba(16,185,129,0.6)" },
          { label:"Pending Amount",      value:`₹${totalPending} Cr`,   sub:"Awaiting disbursement",   gradient:"linear-gradient(135deg,#1c0e00,#2d1700)", accent:"rgba(245,158,11,0.6)" },
          { label:"Total Beneficiaries", value:totalBeneficiaries,       sub:"Registered families",     gradient:"linear-gradient(135deg,#1a0840,#2d1568)", accent:"rgba(196,181,253,0.6)" },
        ].map((k,i)=>(
          <div key={i} style={{ ...card, padding:"18px", background:k.gradient, borderLeft:`4px solid ${k.accent}`, borderTop:"1px solid rgba(167,139,250,0.12)" }}>
            <p style={{ fontSize:"9px", fontWeight:800, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.12em" }}>{k.label}</p>
            <p style={{ fontSize:"22px", fontWeight:900, color:"white", marginTop:"4px", lineHeight:1 }}>{k.value}</p>
            <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.45)", marginTop:"4px", fontWeight:600 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Compensation Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"14px" }}>
        <div style={{ ...card, padding:"20px" }}>
          <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"16px" }}>Project-wise Compensation (₹ Crore)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={compProjectData} margin={{top:0,right:10,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,139,250,0.08)"/>
              <XAxis dataKey="name" tick={{fontSize:10,fill:"rgba(167,139,250,0.6)"}}/>
              <YAxis tick={{fontSize:10,fill:"rgba(167,139,250,0.6)"}}/>
              <Tooltip formatter={v=>`₹${v} Cr`} contentStyle={tooltipS}/>
              <Legend wrapperStyle={{fontSize:11,color:"rgba(167,139,250,0.6)"}}/>
              <Bar dataKey="Paid"    fill="#10b981" radius={[4,4,0,0]}/>
              <Bar dataKey="Pending" fill="#f59e0b" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...card, padding:"20px", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"12px", alignSelf:"flex-start" }}>Disbursement Status</h3>
          <PieChart width={180} height={180}>
            <Pie data={compPieData} cx={90} cy={90} innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
              {compPieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip formatter={v=>`₹${v} Cr`} contentStyle={tooltipS}/>
          </PieChart>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginTop:"6px", width:"100%" }}>
            {compPieData.map((d,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12px" }}>
                <span style={{ width:"12px", height:"12px", borderRadius:"50%", background:d.color, flexShrink:0 }}/>
                <span style={{ fontWeight:600, color:"rgba(196,181,253,0.7)" }}>{d.name}: <b style={{color:"rgba(255,255,255,0.85)"}}>₹{d.value} Cr ({Math.round((d.value/totalAssessed)*100)}%)</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project-wise progress bars */}
      <div style={{ ...card, padding:"20px" }}>
        <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"16px" }}>Project-wise Compensation Progress</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          {projects.map(p=>{
            const pct = p.compensationAssessedCr>0?Math.round((p.compensationPaidCr/p.compensationAssessedCr)*100):0;
            return (
              <div key={p.id} style={{ display:"flex", flexDirection:"column", gap:"5px", fontSize:"12px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <span style={{ fontWeight:700, color:"rgba(255,255,255,0.88)" }}>{p.shortName}</span>
                    <span style={{ color:"rgba(167,139,250,0.45)", marginLeft:"8px" }}>{p.state}</span>
                  </div>
                  <span style={{ fontWeight:700, color:"rgba(196,181,253,0.7)" }}>₹{p.compensationPaidCr} / ₹{p.compensationAssessedCr} Cr ({pct}%)</span>
                </div>
                <div style={{ width:"100%", background:"rgba(167,139,250,0.1)", height:"6px", borderRadius:"99px", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:"99px", width:`${pct}%`, background:pct>=80?"#10b981":pct>=50?"#38bdf8":"#fbbf24", transition:"width 0.3s" }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
        <div style={{ flex:1, height:"1px", background:"rgba(167,139,250,0.1)" }}/>
        <span style={{ fontSize:"10px", fontWeight:800, color:"rgba(167,139,250,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>Rehabilitation & Resettlement (R&R)</span>
        <div style={{ flex:1, height:"1px", background:"rgba(167,139,250,0.1)" }}/>
      </div>

      {/* R&R KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
        {[
          { label:"Total Affected Families",  value:totalAffected,  sub:"Registered in NLAMS",     gradient:"linear-gradient(135deg,#1e0f50,#2d1568)", accent:"rgba(167,139,250,0.6)" },
          { label:"Displaced Families",        value:totalDisplaced, sub:"Require rehabilitation",  gradient:"linear-gradient(135deg,#1c0700,#2d1200)", accent:"rgba(251,146,60,0.6)" },
          { label:"Rehabilitation Completed",  value:totalRRDone,    sub:`${rrPct}% rehabilitated`, gradient:"linear-gradient(135deg,#052e16,#0a3d1f)", accent:"rgba(16,185,129,0.6)" },
          { label:"Rehabilitation Pending",    value:totalRRPending, sub:"Awaiting R&R completion", gradient:"linear-gradient(135deg,#1c0000,#2d0a0a)", accent:"rgba(239,68,68,0.6)" },
        ].map((k,i)=>(
          <div key={i} style={{ ...card, padding:"18px", background:k.gradient, borderLeft:`4px solid ${k.accent}`, borderTop:"1px solid rgba(167,139,250,0.12)" }}>
            <p style={{ fontSize:"9px", fontWeight:800, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.12em" }}>{k.label}</p>
            <p style={{ fontSize:"22px", fontWeight:900, color:"white", marginTop:"4px", lineHeight:1 }}>{k.value}</p>
            <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.45)", marginTop:"4px", fontWeight:600 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* R&R Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"14px" }}>
        <div style={{ ...card, padding:"20px" }}>
          <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"16px" }}>State-wise R&R Progress</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={rrProgressData} margin={{top:0,right:10,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,139,250,0.08)"/>
              <XAxis dataKey="state" tick={{fontSize:10,fill:"rgba(167,139,250,0.6)"}}/>
              <YAxis tick={{fontSize:10,fill:"rgba(167,139,250,0.6)"}}/>
              <Tooltip contentStyle={tooltipS}/>
              <Legend wrapperStyle={{fontSize:11,color:"rgba(167,139,250,0.6)"}}/>
              <Bar dataKey="affected"      fill="rgba(167,139,250,0.2)" name="Affected"      radius={[4,4,0,0]}/>
              <Bar dataKey="displaced"     fill="#f59e0b" name="Displaced"      radius={[4,4,0,0]}/>
              <Bar dataKey="rehabilitated" fill="#10b981" name="Rehabilitated"  radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...card, padding:"20px", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:"12px", alignSelf:"flex-start" }}>R&R Status (Displaced)</h3>
          <PieChart width={180} height={180}>
            <Pie data={rrPieData} cx={90} cy={90} innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
              {rrPieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip contentStyle={tooltipS}/>
          </PieChart>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginTop:"6px", width:"100%" }}>
            {rrPieData.map((d,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12px" }}>
                <span style={{ width:"12px", height:"12px", borderRadius:"50%", background:d.color, flexShrink:0 }}/>
                <span style={{ fontWeight:600, color:"rgba(196,181,253,0.7)" }}>{d.name}: <b style={{color:"rgba(255,255,255,0.85)"}}>{d.value} fam.</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project R&R breakdown table */}
      <div style={{ ...card, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(167,139,250,0.1)" }}>
          <h3 style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>Project-wise R&R Status</h3>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead style={{ background:"rgba(167,139,250,0.06)" }}>
              <tr>
                {["Project","State","Affected","Displaced","R&R Done","Pending","Progress"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"9px", fontWeight:800, color:"rgba(167,139,250,0.55)", textTransform:"uppercase", letterSpacing:"0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map(p=>{
                const pending = p.displacedFamiliesCount - p.rrCompletedCount;
                const pct2 = p.displacedFamiliesCount>0?Math.round((p.rrCompletedCount/p.displacedFamiliesCount)*100):100;
                return (
                  <tr key={p.id} style={{ borderTop:"1px solid rgba(167,139,250,0.07)", transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(167,139,250,0.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"10px 14px", fontWeight:700, color:"rgba(255,255,255,0.88)" }}>{p.shortName}</td>
                    <td style={{ padding:"10px 14px", color:"rgba(167,139,250,0.6)" }}>{p.state}</td>
                    <td style={{ padding:"10px 14px", fontWeight:600, color:"rgba(255,255,255,0.75)" }}>{p.affectedFamiliesCount}</td>
                    <td style={{ padding:"10px 14px", fontWeight:600, color:"#fb923c" }}>{p.displacedFamiliesCount}</td>
                    <td style={{ padding:"10px 14px", fontWeight:600, color:"#34d399" }}>{p.rrCompletedCount}</td>
                    <td style={{ padding:"10px 14px", fontWeight:600, color:"#f87171" }}>{pending}</td>
                    <td style={{ padding:"10px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <div style={{ width:"80px", background:"rgba(167,139,250,0.1)", height:"5px", borderRadius:"99px", overflow:"hidden" }}>
                          <div style={{ height:"100%", borderRadius:"99px", width:`${pct2}%`, background:pct2===100?"#10b981":pct2>=50?"#38bdf8":"#fbbf24" }}/>
                        </div>
                        <span style={{ fontWeight:700, color:"rgba(255,255,255,0.8)", fontSize:"11px" }}>{pct2}%</span>
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

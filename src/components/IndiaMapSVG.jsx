import React, { useState } from "react";

// ─── ALL INDIA STATES / UTs — viewBox 0 0 900 1000 ────────────────────────────
const INDIA_STATES = [
  // ── NORTH INDIA ──────────────────────────────────────────────────────────────
  {
    id:"jk",  name:"Jammu & Kashmir",
    points:"190,18 248,8 328,12 370,32 360,88 300,110 250,100 212,75 190,45",
    cx:285, cy:58, label:"J&K", size:9
  },
  {
    id:"la",  name:"Ladakh",
    points:"370,32 462,15 535,24 558,50 538,95 462,100 362,90",
    cx:462, cy:58, label:"Ladakh", size:8
  },
  {
    id:"hp",  name:"Himachal Pradesh",
    points:"250,100 300,110 360,88 392,115 365,155 320,165 275,150 252,128",
    cx:320, cy:130, label:"H.P.", size:8
  },
  {
    id:"pb",  name:"Punjab",
    points:"198,98 252,95 252,128 230,162 200,165 183,138",
    cx:222, cy:128, label:"PB", size:7
  },
  {
    id:"hr",  name:"Haryana",
    points:"230,162 275,150 320,165 342,198 320,232 278,235 242,220 228,196",
    cx:285, cy:198, label:"HR", size:7
  },
  {
    id:"dl",  name:"Delhi",
    points:"320,195 340,192 345,215 325,220",
    cx:332, cy:205, label:"DL", size:6
  },
  {
    id:"uk",  name:"Uttarakhand",
    points:"365,155 392,115 470,110 500,138 488,175 448,185 408,180",
    cx:438, cy:150, label:"UK", size:7
  },
  // ── WEST INDIA ───────────────────────────────────────────────────────────────
  {
    id:"rj",  name:"Rajasthan",
    points:"118,142 150,120 183,90 200,98 183,138 200,165 228,196 242,220 268,282 260,338 230,382 195,385 160,365 128,335 100,292 90,238 100,188",
    cx:185, cy:262, label:"Rajasthan", size:9
  },
  {
    id:"gj",  name:"Gujarat",
    points:"100,245 120,225 150,225 175,238 228,260 232,312 222,365 195,388 170,402 158,435 145,472 120,492 92,492 68,475 52,445 48,408 50,362 60,322 53,288 58,255 74,242",
    cx:138, cy:372, label:"Gujarat", size:9
  },
  // ── CENTRAL INDIA ────────────────────────────────────────────────────────────
  {
    id:"up",  name:"Uttar Pradesh",
    points:"320,192 342,192 408,180 448,185 488,175 545,178 595,192 625,232 612,292 568,325 500,338 440,345 370,335 320,330 275,335 278,295 290,265 300,235 320,232",
    cx:452, cy:268, label:"Uttar Pradesh", size:8
  },
  {
    id:"br",  name:"Bihar",
    points:"568,248 615,235 662,252 680,278 670,325 640,355 578,355 548,332 538,298",
    cx:612, cy:295, label:"Bihar", size:8
  },
  {
    id:"jh",  name:"Jharkhand",
    points:"500,338 548,332 578,355 640,355 660,395 645,438 605,452 562,455 525,432 508,392",
    cx:578, cy:398, label:"JH", size:7
  },
  {
    id:"mp",  name:"Madhya Pradesh",
    points:"230,382 270,370 320,365 395,360 445,370 505,360 555,372 575,398 570,435 532,468 485,485 418,495 355,495 290,485 250,470 220,445 220,415 228,395",
    cx:402, cy:432, label:"Madhya Pradesh", size:8
  },
  {
    id:"cg",  name:"Chhattisgarh",
    points:"505,360 558,355 580,392 603,415 625,448 628,485 605,518 568,535 530,528 505,508 490,468 480,428 480,405 488,382",
    cx:558, cy:448, label:"C.G.", size:7
  },
  // ── EAST INDIA ───────────────────────────────────────────────────────────────
  {
    id:"sk",  name:"Sikkim",
    points:"668,245 688,238 700,258 685,268",
    cx:685, cy:252, label:"SK", size:6
  },
  {
    id:"wb",  name:"West Bengal",
    points:"640,252 668,245 700,258 720,275 718,335 705,402 682,458 658,475 635,443 645,378 655,318 647,278",
    cx:682, cy:358, label:"W.Bengal", size:8
  },
  {
    id:"od",  name:"Odisha",
    points:"508,392 525,432 562,455 605,452 645,438 662,475 678,512 662,558 625,575 578,578 535,552 508,508 492,465 488,428",
    cx:582, cy:488, label:"Odisha", size:8
  },
  // ── WEST-CENTRAL ─────────────────────────────────────────────────────────────
  {
    id:"mh",  name:"Maharashtra",
    points:"120,492 145,472 158,435 170,402 195,388 220,415 250,470 290,485 355,495 418,495 485,485 502,512 498,552 475,585 420,612 365,625 305,632 245,625 190,602 160,575 130,538 115,505",
    cx:312, cy:558, label:"Maharashtra", size:9
  },
  {
    id:"ts",  name:"Telangana",
    points:"370,575 420,565 480,565 505,588 535,618 520,662 480,675 435,672 402,648 382,618 372,592",
    cx:452, cy:618, label:"Telangana", size:8
  },
  {
    id:"ap",  name:"Andhra Pradesh",
    points:"435,672 480,675 520,662 535,618 565,615 605,628 638,655 635,702 605,732 562,752 512,755 462,738 430,715 402,682 395,658",
    cx:518, cy:702, label:"Andhra Pradesh", size:8
  },
  {
    id:"ka",  name:"Karnataka",
    points:"160,575 190,602 245,625 305,632 365,625 420,612 475,585 502,618 462,662 430,680 402,742 370,768 330,782 288,782 248,768 208,745 180,708 165,668 158,625",
    cx:318, cy:685, label:"Karnataka", size:8
  },
  {
    id:"ga",  name:"Goa",
    points:"158,595 180,588 190,608 178,625 158,620",
    cx:172, cy:608, label:"Goa", size:6
  },
  {
    id:"tn",  name:"Tamil Nadu",
    points:"288,782 330,782 370,768 402,742 430,715 462,738 472,772 452,818 420,855 385,878 348,888 315,878 290,845 275,808",
    cx:375, cy:822, label:"Tamil Nadu", size:8
  },
  {
    id:"kl",  name:"Kerala",
    points:"180,708 208,745 248,768 275,808 275,862 255,892 225,902 198,885 180,848 172,802 165,762 160,722 162,705",
    cx:218, cy:798, label:"Kerala", size:7
  },
  // ── NORTHEAST ────────────────────────────────────────────────────────────────
  {
    id:"as",  name:"Assam",
    points:"720,275 758,262 792,272 828,292 840,318 815,352 778,362 748,365 720,355 702,335 700,305",
    cx:772, cy:318, label:"Assam", size:7
  },
  {
    id:"ar",  name:"Arunachal Pradesh",
    points:"748,195 815,178 868,192 898,218 892,258 858,272 828,292 792,272 758,262 742,240 740,215",
    cx:822, cy:232, label:"Ar.Pradesh", size:7
  },
  {
    id:"ml",  name:"Meghalaya",
    points:"702,335 720,355 748,365 778,362 788,385 762,402 732,405 702,392 692,368 700,348",
    cx:742, cy:372, label:"Meghalaya", size:6
  },
  {
    id:"nl",  name:"Nagaland",
    points:"815,352 840,318 870,332 882,362 865,388 840,395 815,385 808,362",
    cx:845, cy:362, label:"NL", size:6
  },
  {
    id:"mn",  name:"Manipur",
    points:"840,395 865,388 882,408 885,438 868,458 845,465 825,452 822,422 832,402",
    cx:855, cy:428, label:"MN", size:6
  },
  {
    id:"mz",  name:"Mizoram",
    points:"792,435 815,425 825,452 845,465 852,495 832,515 805,522 785,505 782,475 788,452",
    cx:818, cy:472, label:"MZ", size:6
  },
  {
    id:"tr",  name:"Tripura",
    points:"732,405 762,402 788,385 792,435 788,452 782,475 762,482 742,465 732,438 730,415",
    cx:762, cy:438, label:"TR", size:6
  },
];

// ─── UNIQUE COLOR PER STATE (vibrant political map palette) ───────────────────
const STATE_COLORS = {
  jk: { base:"#5B21B6", hover:"#7C3AED", border:"#8B5CF6" },
  la: { base:"#1E3A8A", hover:"#1D4ED8", border:"#3B82F6" },
  hp: { base:"#075985", hover:"#0284C7", border:"#38BDF8" },
  pb: { base:"#065F46", hover:"#047857", border:"#34D399" },
  hr: { base:"#155E75", hover:"#0891B2", border:"#22D3EE" },
  dl: { base:"#92400E", hover:"#B45309", border:"#FBBF24" },
  uk: { base:"#134E4A", hover:"#0D9488", border:"#2DD4BF" },
  rj: { base:"#B45309", hover:"#D97706", border:"#F59E0B" },
  gj: { base:"#14532D", hover:"#15803D", border:"#4ADE80" },
  up: { base:"#1E3A8A", hover:"#2563EB", border:"#60A5FA" },
  br: { base:"#991B1B", hover:"#B91C1C", border:"#F87171" },
  jh: { base:"#78350F", hover:"#92400E", border:"#FCA5A5" },
  mp: { base:"#4C1D95", hover:"#6D28D9", border:"#C4B5FD" },
  cg: { base:"#7C2D12", hover:"#9A3412", border:"#FCA5A5" },
  od: { base:"#0C4A6E", hover:"#0369A1", border:"#7DD3FC" },
  sk: { base:"#052E16", hover:"#059669", border:"#6EE7B7" },
  wb: { base:"#831843", hover:"#9D174D", border:"#F9A8D4" },
  as: { base:"#2E1065", hover:"#4C1D95", border:"#C4B5FD" },
  ar: { base:"#14532D", hover:"#166534", border:"#86EFAC" },
  ml: { base:"#713F12", hover:"#92400E", border:"#FDE68A" },
  nl: { base:"#1A2E05", hover:"#3F6212", border:"#BEF264" },
  mn: { base:"#4C0519", hover:"#7F1D1D", border:"#FECACA" },
  mz: { base:"#1E1B4B", hover:"#312E81", border:"#A5B4FC" },
  tr: { base:"#4A044E", hover:"#701A75", border:"#E879F9" },
  mh: { base:"#172554", hover:"#1E3A8A", border:"#93C5FD" },
  ts: { base:"#78350F", hover:"#B45309", border:"#FCD34D" },
  ap: { base:"#042F2E", hover:"#115E59", border:"#5EEAD4" },
  ka: { base:"#881337", hover:"#9F1239", border:"#FDA4AF" },
  ga: { base:"#44403C", hover:"#57534E", border:"#D6D3D1" },
  tn: { base:"#172554", hover:"#1D4ED8", border:"#BAE6FD" },
  kl: { base:"#052E16", hover:"#065F46", border:"#6EE7B7" },
};

// ─── PROJECT STATUS DOT COLORS ─────────────────────────────────────────────────
const STATUS_DOT = {
  "Completed": "#22C55E",
  "On Track":  "#38BDF8",
  "Delayed":   "#FBBF24",
  "High Risk": "#F87171",
};

const STATUS_PRIORITY = ["High Risk", "Delayed", "On Track", "Completed"];

export default function IndiaMapSVG({ projects = [] }) {
  const [hovered, setHovered] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);

  // Build state → projects map
  const stateMap = {};
  projects.forEach(p => {
    if (!stateMap[p.state]) stateMap[p.state] = [];
    stateMap[p.state].push(p);
  });

  const getWorstStatus = (stateName) => {
    const ps = stateMap[stateName] || [];
    if (!ps.length) return null;
    for (const s of STATUS_PRIORITY) if (ps.some(p => p.overallStatus === s)) return s;
    return null;
  };

  const getStateById = (id) => INDIA_STATES.find(s => s.id === id);

  // State name → id map for lookup
  const stateNameToId = {
    "Andhra Pradesh": "ap", "Arunachal Pradesh": "ar", "Assam": "as",
    "Bihar": "br", "Chhattisgarh": "cg", "Goa": "ga", "Gujarat": "gj",
    "Haryana": "hr", "Himachal Pradesh": "hp", "Jharkhand": "jh",
    "Karnataka": "ka", "Kerala": "kl", "Madhya Pradesh": "mp",
    "Maharashtra": "mh", "Manipur": "mn", "Meghalaya": "ml",
    "Mizoram": "mz", "Nagaland": "nl", "Odisha": "od", "Punjab": "pb",
    "Rajasthan": "rj", "Sikkim": "sk", "Tamil Nadu": "tn", "Telangana": "ts",
    "Tripura": "tr", "Uttar Pradesh": "up", "Uttarakhand": "uk",
    "West Bengal": "wb", "Delhi": "dl", "Jammu & Kashmir": "jk",
    "Jammu and Kashmir": "jk", "Ladakh": "la",
  };

  // Build unique markers per state
  const markers = [];
  const seen = new Set();
  projects.forEach(p => {
    const svgId = stateNameToId[p.state];
    if (!svgId || seen.has(svgId)) return;
    seen.add(svgId);
    const svgState = INDIA_STATES.find(s => s.id === svgId);
    if (svgState) markers.push({ svgState, projs: stateMap[p.state], worstStatus: getWorstStatus(p.state) });
  });

  return (
    <div style={{
      width:"100%", height:"100%",
      background:"linear-gradient(145deg,#030912 0%,#06122a 35%,#0a1f3d 65%,#030912 100%)",
      borderRadius:"16px", overflow:"hidden", display:"flex", flexDirection:"column",
      position:"relative",
    }}>
      {/* TOP STATUS BAR */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 18px", background:"rgba(0,0,0,0.4)",
        borderBottom:"1px solid rgba(59,130,246,0.25)", flexShrink:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ position:"relative", width:"10px", height:"10px" }}>
            <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 10px #22C55E" }}/>
            <div style={{ position:"absolute", inset:"-4px", borderRadius:"50%", border:"2px solid #22C55E", opacity:0.4, animation:"ping 1.5s infinite" }}/>
          </div>
          <span style={{ fontWeight:900, fontSize:"12px", color:"#93C5FD", letterSpacing:"0.2em", textTransform:"uppercase" }}>
            🌐 Land Acquisition Command Centre — All India GIS
          </span>
        </div>
        <div style={{ display:"flex", gap:"20px" }}>
          {[
            ["Projects", projects.length, "#60A5FA"],
            ["States Active", Object.keys(stateMap).length, "#34D399"],
            ["High Risk", projects.filter(p=>p.overallStatus==="High Risk").length, "#F87171"],
            ["Completed", projects.filter(p=>p.overallStatus==="Completed").length, "#A78BFA"],
          ].map(([l,v,c])=>(
            <div key={l} style={{ fontSize:"10px", display:"flex", gap:"5px", alignItems:"center" }}>
              <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{l}:</span>
              <span style={{ color:c, fontWeight:900, fontSize:"12px" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAP + LEGEND */}
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 190px", overflow:"hidden" }}>

        {/* SVG MAP */}
        <div style={{ position:"relative", overflow:"hidden" }}>
          <svg viewBox="0 0 900 1000" style={{ width:"100%", height:"100%", display:"block" }} preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Radial glow for project states */}
              <filter id="stateGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="bgr" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#0d1f42" stopOpacity="1"/>
                <stop offset="100%" stopColor="#030912" stopOpacity="1"/>
              </radialGradient>
            </defs>

            {/* Background */}
            <rect width="900" height="1000" fill="url(#bgr)"/>

            {/* Grid */}
            {Array.from({length:23},(_,i)=>(
              <line key={`h${i}`} x1="0" y1={i*44} x2="900" y2={i*44} stroke="#1a3060" strokeWidth="0.4" opacity="0.6"/>
            ))}
            {Array.from({length:21},(_,i)=>(
              <line key={`v${i}`} x1={i*45} y1="0" x2={i*45} y2="1000" stroke="#1a3060" strokeWidth="0.4" opacity="0.6"/>
            ))}

            {/* STATES */}
            {INDIA_STATES.map(state => {
              const colors   = STATE_COLORS[state.id] || { base:"#1e3a5f", hover:"#2d5a8e", border:"#3b82f6" };
              const isHover  = hovered === state.id;
              const worstS   = getWorstStatus(state.name);
              const hasProj  = !!worstS;
              const dotC     = worstS ? STATUS_DOT[worstS] : null;

              return (
                <g key={state.id}
                  style={{ cursor:"pointer" }}
                  onMouseEnter={e => {
                    setHovered(state.id);
                    setTooltipData({ name:state.name, projs:stateMap[state.name]||[], status:worstS });
                  }}
                  onMouseLeave={() => { setHovered(null); setTooltipData(null); }}
                >
                  {/* State fill */}
                  <polygon
                    points={state.points}
                    fill={isHover ? colors.hover : colors.base}
                    stroke={hasProj ? (isHover ? dotC||colors.border : colors.border) : "rgba(255,255,255,0.12)"}
                    strokeWidth={isHover ? "2.5" : hasProj ? "2" : "0.8"}
                    filter={isHover && hasProj ? "url(#stateGlow)" : "none"}
                    style={{ transition:"all 0.18s ease" }}
                  />
                  {/* State label */}
                  <text
                    x={state.cx} y={state.cy + 3}
                    fill={hasProj ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)"}
                    fontSize={state.size || 8} fontWeight="700"
                    textAnchor="middle" fontFamily="'Inter',sans-serif"
                    style={{ pointerEvents:"none", userSelect:"none" }}
                  >
                    {state.label}
                  </text>
                </g>
              );
            })}

            {/* PROJECT MARKERS */}
            {markers.map(({ svgState, projs, worstStatus }) => {
              const dotColor = STATUS_DOT[worstStatus] || "#60A5FA";
              return (
                <g key={svgState.id} style={{ pointerEvents:"none" }}>
                  {/* Outer pulse 1 */}
                  <circle cx={svgState.cx} cy={svgState.cy} r="5" fill="none" stroke={dotColor} strokeWidth="1.5">
                    <animate attributeName="r"       from="8"  to="26" dur="2.4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" from="0.8" to="0"  dur="2.4s" repeatCount="indefinite"/>
                  </circle>
                  {/* Outer pulse 2 */}
                  <circle cx={svgState.cx} cy={svgState.cy} r="5" fill="none" stroke={dotColor} strokeWidth="1">
                    <animate attributeName="r"       from="6"  to="18" dur="2.4s" begin="0.6s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" from="0.6" to="0"  dur="2.4s" begin="0.6s" repeatCount="indefinite"/>
                  </circle>
                  {/* Core dot */}
                  <circle cx={svgState.cx} cy={svgState.cy} r="7"
                    fill={dotColor} stroke="white" strokeWidth="2"
                    filter="url(#dotGlow)"
                  />
                  {/* Project count */}
                  {projs.length > 1 && (
                    <text x={svgState.cx+10} y={svgState.cy-8} fontSize="8" fontWeight="900"
                      fill={dotColor} fontFamily="'Inter',sans-serif" textAnchor="middle"
                      style={{ filter:`drop-shadow(0 0 3px ${dotColor})` }}>
                      {projs.length}▲
                    </text>
                  )}
                </g>
              );
            })}

            {/* COMPASS ROSE */}
            <g transform="translate(850,80)">
              <circle cx="0" cy="0" r="20" fill="rgba(0,0,0,0.4)" stroke="rgba(59,130,246,0.4)" strokeWidth="1"/>
              <text x="0" y="-8" textAnchor="middle" fill="#93C5FD" fontSize="8" fontWeight="900" fontFamily="sans-serif">N</text>
              <polygon points="0,-15 3,-5 -3,-5" fill="#93C5FD" opacity="0.8"/>
              <polygon points="0,15 3,5 -3,5" fill="rgba(255,255,255,0.3)"/>
              <text x="0" y="22" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="sans-serif">S</text>
            </g>

            {/* SCALE BAR */}
            <g transform="translate(40,955)">
              <line x1="0" y1="0" x2="80" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <line x1="80" y1="-4" x2="80" y2="4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <text x="40" y="-8" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="sans-serif">≈ 500 km</text>
            </g>

            {/* ATTRIBUTION */}
            <text x="460" y="980" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="sans-serif">
              Land Acquisition Command Centre (LACC) — GIS Portal · Ministry of Rural Development, GoI
            </text>
          </svg>

          {/* FLOATING TOOLTIP */}
          {tooltipData && (
            <div style={{
              position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
              background:"rgba(3,9,18,0.96)", backdropFilter:"blur(20px)",
              border:`1px solid ${tooltipData.status ? STATUS_DOT[tooltipData.status]+"55" : "rgba(59,130,246,0.3)"}`,
              borderRadius:"18px", padding:"16px 18px", minWidth:"210px", maxWidth:"260px",
              boxShadow:`0 12px 48px rgba(0,0,0,0.6)${tooltipData.status ? `, 0 0 24px ${STATUS_DOT[tooltipData.status]}25` : ""}`,
              zIndex:20, pointerEvents:"none",
            }}>
              <div style={{ fontWeight:900, color:"white", fontSize:"14px", marginBottom:"10px", borderBottom:"1px solid rgba(255,255,255,0.1)", paddingBottom:"8px", display:"flex", alignItems:"center", gap:"8px" }}>
                🗺 {tooltipData.name}
              </div>
              {!tooltipData.projs.length ? (
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px", fontWeight:600 }}>No active projects in this state</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
                  {tooltipData.projs.map(p => {
                    const c = STATUS_DOT[p.overallStatus] || "#60A5FA";
                    return (
                      <div key={p.id} style={{ background:`${c}12`, borderRadius:"10px", padding:"8px 10px", border:`1px solid ${c}30` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontSize:"11px", fontWeight:800, color:"white" }}>{p.shortName}</span>
                          <span style={{ fontSize:"9px", background:c, color:"white", fontWeight:800, padding:"1px 7px", borderRadius:"99px" }}>{p.overallStatus}</span>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px", fontSize:"10px" }}>
                          <span style={{ color:"rgba(255,255,255,0.5)" }}>{p.type}</span>
                          <span style={{ color:c, fontWeight:800 }}>{p.progressPercentage}% done</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* LEGEND + STATS PANEL */}
        <div style={{
          borderLeft:"1px solid rgba(59,130,246,0.18)",
          background:"rgba(0,0,0,0.35)", padding:"14px 12px",
          display:"flex", flexDirection:"column", gap:"14px", overflowY:"auto",
        }}>
          {/* Status legend */}
          <div>
            <div style={{ fontSize:"9px", fontWeight:900, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:"10px" }}>
              Project Status
            </div>
            {Object.entries(STATUS_DOT).map(([label, color]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
                <div style={{ width:"11px", height:"11px", borderRadius:"50%", background:color, border:"2px solid rgba(255,255,255,0.4)", boxShadow:`0 0 10px ${color}`, flexShrink:0 }}/>
                <span style={{ fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.7)" }}>{label}</span>
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"4px" }}>
              <div style={{ width:"11px", height:"11px", borderRadius:"50%", background:"#1e3a5f", border:"1.5px solid rgba(255,255,255,0.15)", flexShrink:0 }}/>
              <span style={{ fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.3)" }}>No Projects</span>
            </div>
          </div>

          <div style={{ height:"1px", background:"rgba(255,255,255,0.08)" }}/>

          {/* Active states */}
          <div>
            <div style={{ fontSize:"9px", fontWeight:900, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:"10px" }}>
              Active States
            </div>
            {Object.entries(stateMap).map(([state, projs]) => {
              const worst = getWorstStatus(state);
              const color = worst ? STATUS_DOT[worst] : "#60A5FA";
              return (
                <div key={state} style={{ marginBottom:"8px", padding:"8px 10px", borderRadius:"10px", background:`${color}12`, border:`1px solid ${color}28` }}>
                  <div style={{ fontSize:"9px", fontWeight:800, color:"rgba(255,255,255,0.65)", marginBottom:"3px", lineHeight:1.3 }}>{state}</div>
                  {projs.map(p => (
                    <div key={p.id} style={{ display:"flex", justifyContent:"space-between", fontSize:"9px" }}>
                      <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{p.shortName}</span>
                      <span style={{ color, fontWeight:900 }}>{p.progressPercentage}%</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div style={{ height:"1px", background:"rgba(255,255,255,0.08)" }}/>

          {/* Summary bars */}
          <div>
            <div style={{ fontSize:"9px", fontWeight:900, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.18em", marginBottom:"10px" }}>
              Summary
            </div>
            {[
              ["On Track",  projects.filter(p=>p.overallStatus==="On Track").length,  "#38BDF8"],
              ["Delayed",   projects.filter(p=>p.overallStatus==="Delayed").length,   "#FBBF24"],
              ["High Risk", projects.filter(p=>p.overallStatus==="High Risk").length, "#F87171"],
              ["Completed", projects.filter(p=>p.overallStatus==="Completed").length, "#22C55E"],
            ].map(([l,v,c])=>(
              <div key={l} style={{ marginBottom:"7px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", marginBottom:"3px" }}>
                  <span style={{ color:"rgba(255,255,255,0.5)", fontWeight:600 }}>{l}</span>
                  <span style={{ color:c, fontWeight:900 }}>{v}</span>
                </div>
                <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:"99px", height:"4px", overflow:"hidden" }}>
                  <div style={{ height:"4px", width:`${(v/projects.length)*100}%`, background:c, borderRadius:"99px", boxShadow:`0 0 6px ${c}`, transition:"width 0.5s" }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Live status */}
          <div style={{ marginTop:"auto", fontSize:"9px", lineHeight:1.8, color:"rgba(255,255,255,0.25)", fontWeight:600 }}>
            <span style={{ color:"#22C55E", fontWeight:800 }}>● LACC GIS LIVE</span><br/>
            {new Date().toLocaleString("en-IN", { timeZone:"Asia/Kolkata", hour12:true, hour:"2-digit", minute:"2-digit" })} IST
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0%   { transform:scale(1); opacity:0.5; }
          100% { transform:scale(2.2); opacity:0; }
        }
      `}</style>
    </div>
  );
}

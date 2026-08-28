import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// All Indian state centroids for project markers
const STATE_CENTERS = {
  "Andhra Pradesh": [15.9129, 79.7400],
  "Arunachal Pradesh": [28.2180, 94.7278],
  "Assam": [26.2006, 92.9376],
  "Bihar": [25.0961, 85.3131],
  "Chhattisgarh": [21.2787, 81.8661],
  "Goa": [15.2993, 74.1240],
  "Gujarat": [22.2587, 71.1924],
  "Haryana": [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1734],
  "Jharkhand": [23.6102, 85.2799],
  "Karnataka": [15.3173, 75.7139],
  "Kerala": [10.8505, 76.2711],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Maharashtra": [19.7515, 75.7139],
  "Manipur": [24.6637, 93.9063],
  "Meghalaya": [25.4670, 91.3662],
  "Mizoram": [23.1645, 92.9376],
  "Nagaland": [26.1584, 94.5624],
  "Odisha": [20.9517, 85.0985],
  "Punjab": [31.1471, 75.3412],
  "Rajasthan": [27.0238, 74.2179],
  "Sikkim": [27.5330, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  "Telangana": [17.1232, 79.2088],
  "Tripura": [23.9408, 91.9882],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Uttarakhand": [30.0668, 79.0193],
  "West Bengal": [22.9868, 87.8550],
  "Delhi": [28.7041, 77.1025],
  "Jammu and Kashmir": [33.7782, 76.5762],
  "Ladakh": [34.1526, 77.5771],
};

const STATUS_COLOR = {
  "Completed":  "#10b981",
  "On Track":   "#3b82f6",
  "Delayed":    "#f59e0b",
  "High Risk":  "#ef4444",
};

const PARCEL_COLOR = {
  "Acquired":              "#10b981",
  "Compensation Pending":  "#f59e0b",
  "Notified":              "#3b82f6",
  "Survey Completed":      "#06b6d4",
  "Proposed":              "#94a3b8",
};

const makeProjectIcon = (color, size = 18) => L.divIcon({
  className: "",
  html: `<div style="
    width:${size}px;height:${size}px;border-radius:50%;
    background:${color};border:3px solid white;
    box-shadow:0 0 0 2px ${color},0 4px 14px rgba(0,0,0,0.35);
    position:relative;
  ">
    <div style="
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
      width:${size * 0.4}px;height:${size * 0.4}px;
      border-radius:50%;background:rgba(255,255,255,0.9);
    "/>
  </div>`,
  iconSize: [size, size],
  iconAnchor: [size / 2, size / 2],
  popupAnchor: [0, -size / 2],
});

const makeParcelIcon = (color, selected = false) => {
  const s = selected ? 22 : 14;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${s}px;height:${s}px;border-radius:4px;
      background:${color};border:${selected ? "3px" : "2px"} solid white;
      box-shadow:0 2px 10px rgba(0,0,0,0.3);
      transform:${selected ? "rotate(45deg) scale(1.2)" : "rotate(45deg)"};
    "/>`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
    popupAnchor: [0, -s],
  });
};

function MapFlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.0 });
  }, [center[0], center[1], zoom]);
  return null;
}

export default function GISMap({ selectedProject, activeParcel, onSelectParcel, allProjects = [] }) {
  const [indiaGeo, setIndiaGeo] = useState(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson")
      .then(r => r.json())
      .then(d => setIndiaGeo(d))
      .catch(() => console.warn("India GeoJSON unavailable – using markers only"));
  }, []);

  // Build project-per-state count
  const stateCount = {};
  allProjects.forEach(p => { stateCount[p.state] = (stateCount[p.state] || 0) + 1; });

  const getStateStyle = (feature) => {
    const name = feature.properties?.ST_NM || feature.properties?.NAME_1 || "";
    const cnt  = stateCount[name] || 0;
    return {
      fillColor: cnt > 2 ? "#6366f1" : cnt > 0 ? "#3b82f6" : "#e2e8f0",
      fillOpacity: cnt > 0 ? 0.22 : 0.08,
      color: cnt > 0 ? "#2563eb" : "#94a3b8",
      weight: cnt > 0 ? 2 : 0.8,
    };
  };

  const onEachState = (feature, layer) => {
    const name = feature.properties?.ST_NM || feature.properties?.NAME_1 || "";
    const cnt  = stateCount[name] || 0;
    if (name) {
      layer.bindTooltip(
        `<div style="font:600 12px sans-serif;color:#1e293b"><b>${name}</b>${cnt ? `<br/><span style="color:#3b82f6">${cnt} project(s)</span>` : ""}</div>`,
        { sticky: true, className: "bhumisetu-tip", direction: "top", offset: [0, -4] }
      );
    }
    layer.on({
      mouseover: e => e.target.setStyle({ fillOpacity: 0.42, weight: 2.5 }),
      mouseout:  e => e.target.setStyle(getStateStyle(feature)),
    });
  };

  // Determine map focus
  const showNational = !selectedProject?.parcels?.length;
  const mapCenter = showNational ? [20.5937, 78.9629] :
    selectedProject.parcels[0]?.coords || [20.5937, 78.9629];
  const mapZoom = showNational ? 5 : 11;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom
        zoomControl
        style={{ width: "100%", height: "100%" }}
      >
        {/* Vibrant Voyager tile */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {/* India state boundaries */}
        {indiaGeo && (
          <GeoJSON
            key={JSON.stringify(stateCount)}
            data={indiaGeo}
            style={getStateStyle}
            onEachFeature={onEachState}
          />
        )}

        {/* National-level project markers (all states) */}
        {allProjects.map(p => {
          const center = STATE_CENTERS[p.state];
          if (!center) return null;
          const color = STATUS_COLOR[p.overallStatus] || "#3b82f6";
          return (
            <Marker key={p.id} position={center} icon={makeProjectIcon(color, 20)}>
              <Popup maxWidth={240}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", minWidth: "200px" }}>
                  <div style={{ background: `linear-gradient(135deg,${color}22,${color}11)`, padding: "8px 10px", borderRadius: "8px", marginBottom: "8px", borderLeft: `4px solid ${color}` }}>
                    <div style={{ fontWeight: 800, fontSize: "13px", color: "#1e293b" }}>{p.shortName}</div>
                    <div style={{ color: "#64748b", fontSize: "11px", marginTop: "2px", lineHeight: "1.4" }}>{p.name}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", fontSize: "11px" }}>
                    {[
                      ["🗺 State",      p.state],
                      ["🏗 Type",       p.type],
                      ["📊 Progress",   `${p.progressPercentage}%`],
                      ["💰 Comp. Paid", `₹${p.compensationPaidCr} Cr`],
                    ].map(([l, v], i) => (
                      <div key={i} style={{ background: "#f8fafc", padding: "4px 6px", borderRadius: "6px" }}>
                        <div style={{ color: "#94a3b8", fontSize: "9px", fontWeight: 700 }}>{l}</div>
                        <div style={{ color: "#334155", fontWeight: 700 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>{p.state} · {p.district}</span>
                    <span style={{ background: color, color: "white", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "99px" }}>{p.overallStatus}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Selected project: parcel circles + markers */}
        {selectedProject?.parcels?.map(parcel => {
          const color    = PARCEL_COLOR[parcel.status] || "#94a3b8";
          const isActive = activeParcel?.id === parcel.id;
          return (
            <React.Fragment key={parcel.id}>
              <Circle
                center={parcel.coords}
                radius={isActive ? 900 : 600}
                pathOptions={{
                  color:       isActive ? "#ffffff" : color,
                  fillColor:   color,
                  fillOpacity: isActive ? 0.75 : 0.5,
                  weight:      isActive ? 3 : 1.5,
                }}
                eventHandlers={{ click: () => onSelectParcel(parcel) }}
              />
              <Marker
                position={parcel.coords}
                icon={makeParcelIcon(color, isActive)}
                eventHandlers={{ click: () => onSelectParcel(parcel) }}
              >
                <Popup maxWidth={220}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", minWidth: "190px" }}>
                    <div style={{ fontWeight: 800, fontSize: "13px", color: "#1e293b", marginBottom: "6px" }}>
                      Parcel {parcel.id}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", fontSize: "11px" }}>
                      {[
                        ["Survey No", parcel.surveyNo],
                        ["Village",   parcel.village],
                        ["Area",      `${parcel.areaAcres} ac`],
                        ["Families",  parcel.familiesCount],
                      ].map(([l, v], i) => (
                        <div key={i} style={{ background: "#f8fafc", padding: "4px 6px", borderRadius: "6px" }}>
                          <div style={{ color: "#94a3b8", fontSize: "9px", fontWeight: 700 }}>{l}</div>
                          <div style={{ color: "#334155", fontWeight: 700 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: "8px", padding: "6px 8px", borderRadius: "8px", background: `${color}22`, borderLeft: `3px solid ${color}` }}>
                      <span style={{ fontWeight: 700, fontSize: "11px", color }}>{parcel.status}</span>
                    </div>
                    {parcel.dispute && (
                      <div style={{ marginTop: "6px", padding: "5px 8px", borderRadius: "6px", background: "#fef2f2", border: "1px solid #fecaca", fontSize: "10px", color: "#dc2626" }}>
                        ⚠ {parcel.dispute}
                      </div>
                    )}
                    <div style={{ marginTop: "6px", fontSize: "10px", color: "#94a3b8" }}>Owner: {parcel.owner}</div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        <MapFlyTo center={mapCenter} zoom={mapZoom} />
      </MapContainer>

      {/* Legend overlay */}
      <div style={{
        position: "absolute", bottom: 14, left: 14, zIndex: 1000,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
        borderRadius: "14px", padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.06)", minWidth: "140px",
      }}>
        <div style={{ fontWeight: 800, fontSize: "10px", color: "#334155", marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Project Status
        </div>
        {Object.entries(STATUS_COLOR).map(([label, color]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
            <div style={{
              width: "10px", height: "10px", borderRadius: "50%",
              background: color, border: "2px solid white",
              boxShadow: `0 0 0 1.5px ${color}`,
            }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>{label}</span>
          </div>
        ))}
        <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #e2e8f0" }}>
          <div style={{ fontWeight: 800, fontSize: "10px", color: "#334155", marginBottom: "6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Parcel Status</div>
          {[["#10b981","Acquired"],["#f59e0b","Comp. Pending"],["#3b82f6","Notified"],["#94a3b8","Proposed"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", transform: "rotate(45deg)", background: c, border: "1.5px solid white", boxShadow: `0 0 0 1px ${c}` }} />
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#64748b" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* India GeoJSON loading badge */}
      {!indiaGeo && (
        <div style={{
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 1000,
          background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)",
          borderRadius: "10px", padding: "5px 14px", fontSize: "10px",
          fontWeight: 700, color: "#64748b", border: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid #3b82f6", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
          Loading India state boundaries...
        </div>
      )}
    </div>
  );
}

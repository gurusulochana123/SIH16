import React, { useState } from "react";
import { ChevronRight, CheckCircle2, Upload, FileText } from "lucide-react";

const STATES = ["Andhra Pradesh", "Telangana", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "Uttar Pradesh", "Bihar", "Madhya Pradesh"];
const TYPES  = ["Highway", "Railway", "Urban Transit", "Industrial", "Irrigation", "Renewable Energy", "Defense", "Urban Development"];
const AGENCIES = ["NHAI", "DFCCIL", "HMDA", "TSIIC", "KIADB", "SECI", "MSEDCL", "Airport Authority of India", "Ministry of Jal Shakti"];

const STEPS = [
  { num: 1, label: "Project Details" },
  { num: 2, label: "Land & Families" },
  { num: 3, label: "Documents & Submit" },
];

export default function AddProject({ onSubmit, onCancel }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    // Step 1
    name: "", type: "Highway", state: "Andhra Pradesh", district: "",
    requiringBody: "", ministry: "", agency: "",
    // Step 2
    landRequired: "", parcels: "", affectedFamilies: "", estimatedComp: "",
    priority: "High",
    // Step 3
    dprUploaded: false, siaUploaded: false, mapUploaded: false,
    agreedTerms: false,
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())        e.name        = "Project name is required";
    if (!form.district.trim())    e.district    = "District is required";
    if (!form.requiringBody.trim()) e.requiringBody = "Requiring body is required";
    if (!form.ministry.trim())    e.ministry    = "Ministry is required";
    if (!form.agency.trim())      e.agency      = "Implementing agency is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.landRequired || isNaN(+form.landRequired)) e.landRequired = "Enter a valid acreage";
    if (!form.parcels || isNaN(+form.parcels))           e.parcels      = "Enter a valid number";
    if (!form.affectedFamilies || isNaN(+form.affectedFamilies)) e.affectedFamilies = "Enter a valid number";
    if (!form.estimatedComp || isNaN(+form.estimatedComp))       e.estimatedComp    = "Enter a valid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    if (!form.agreedTerms) { alert("Please agree to the declaration to submit."); return; }
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        id: `PRJ-NEW-${Date.now()}`,
        name: form.name,
        shortName: form.name.slice(0, 8).toUpperCase().replace(/\s/g, "-"),
        type: form.type,
        state: form.state,
        district: form.district,
        requiringBody: form.requiringBody,
        ministry: form.ministry,
        implementingAgency: form.agency,
        priority: form.priority,
        landProposedAcres: +form.landRequired,
        landAcquiredAcres: 0,
        progressPercentage: 0,
        compensationAssessedCr: +form.estimatedComp,
        compensationPaidCr: 0,
        affectedFamiliesCount: +form.affectedFamilies,
        displacedFamiliesCount: 0,
        rrCompletedCount: 0,
        overallStatus: "On Track",
        workflowStages: [
          { name: "Proposal Submitted",    status: "completed",  date: new Date().toISOString().slice(0, 10), authority: form.agency, remarks: "Proposal submitted via NLAMS portal" },
          { name: "District Verification", status: "pending", date: null, authority: `Collector, ${form.district}`, remarks: "" },
          { name: "State Approval",        status: "pending", date: null, authority: `Govt. of ${form.state}`, remarks: "" },
          { name: "Notification (Sec 11)", status: "pending", date: null, authority: "District Collector", remarks: "" },
          { name: "Land Survey",           status: "pending", date: null, authority: "Survey Department", remarks: "" },
          { name: "Award Declaration",     status: "pending", date: null, authority: "LAC", remarks: "" },
          { name: "Compensation Payment",  status: "pending", date: null, authority: "Treasury", remarks: "" },
          { name: "Land Possession",       status: "pending", date: null, authority: "District Collector", remarks: "" },
          { name: "R&R Completion",        status: "pending", date: null, authority: "SLAO", remarks: "" },
          { name: "Project Completed",     status: "pending", date: null, authority: "Ministry", remarks: "" },
        ],
        lifecycleBreakdown: { notifications: 0, awards: 0, compensation: 0, rr: 0, possession: 0 },
        attentionRequired: { compensationDelay: 0, documentMismatch: 0, rrPending: 0, milestoneApproaching: +form.parcels },
        parcels: [],
        documents: [],
        auditTrail: [{ id: `AUD-NEW-01`, timestamp: new Date().toLocaleString(), user: "System", action: "Proposal submitted via NLAMS online portal" }],
      });
    }, 600);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="text-emerald-600 w-12 h-12" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Proposal Submitted Successfully!</h2>
          <p className="text-slate-500 text-sm max-w-md">
            Your project proposal for <strong>"{form.name}"</strong> has been submitted. Status: <span className="text-amber-600 font-bold">Pending District Verification</span>. You will be notified once the district authority reviews the proposal.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md text-xs">
          <p className="font-bold text-slate-500 uppercase tracking-wider mb-3">Submission Summary</p>
          <div className="flex flex-col gap-2 text-slate-700">
            <div className="flex justify-between"><span>Project Name</span><strong>{form.name}</strong></div>
            <div className="flex justify-between"><span>Type</span><strong>{form.type}</strong></div>
            <div className="flex justify-between"><span>State / District</span><strong>{form.state} / {form.district}</strong></div>
            <div className="flex justify-between"><span>Land Required</span><strong>{form.landRequired} acres</strong></div>
            <div className="flex justify-between"><span>Affected Families</span><strong>{form.affectedFamilies}</strong></div>
            <div className="flex justify-between"><span>Est. Compensation</span><strong>₹{form.estimatedComp} Cr</strong></div>
            <div className="flex justify-between"><span>Status</span><strong className="text-amber-600">Pending Verification</strong></div>
          </div>
        </div>
        <button onClick={onCancel} className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer text-sm">
          Back to Projects
        </button>
      </div>
    );
  }

  const ErrMsg = ({ field }) => errors[field] ? <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors[field]}</p> : null;

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PROJECT MANAGEMENT</span>
        <h2 className="text-lg font-black text-slate-900 mt-0.5">Submit New Project Proposal</h2>
        <p className="text-xs text-slate-500">Complete all steps to submit a land acquisition proposal to NLAMS.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              step === s.num ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" :
              step > s.num  ? "bg-emerald-100 text-emerald-800" : "bg-white border border-slate-200 text-slate-400"
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step > s.num ? "bg-emerald-500 text-white" : step === s.num ? "bg-white text-blue-600" : "bg-slate-200 text-slate-500"
              }`}>
                {step > s.num ? "✓" : s.num}
              </div>
              {s.label}
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={16} className="text-slate-300 mx-1 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 1: Project Details</h3>

            <div>
              <label className="label-xs">Project Name *</label>
              <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="e.g. National Highway AP-01 Extension" className="input-field" />
              <ErrMsg field="name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-xs">Project Type *</label>
                <select value={form.type} onChange={e => set("type", e.target.value)} className="input-field">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label-xs">Priority</label>
                <select value={form.priority} onChange={e => set("priority", e.target.value)} className="input-field">
                  {["High", "Medium", "Low"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-xs">State *</label>
                <select value={form.state} onChange={e => set("state", e.target.value)} className="input-field">
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label-xs">District *</label>
                <input type="text" value={form.district} onChange={e => set("district", e.target.value)}
                  placeholder="e.g. Kurnool" className="input-field" />
                <ErrMsg field="district" />
              </div>
            </div>

            <div>
              <label className="label-xs">Land Requiring Body *</label>
              <input type="text" value={form.requiringBody} onChange={e => set("requiringBody", e.target.value)}
                placeholder="e.g. NHAI, DFCCIL, HMDA..." className="input-field" />
              <ErrMsg field="requiringBody" />
            </div>

            <div>
              <label className="label-xs">Sponsoring Ministry *</label>
              <input type="text" value={form.ministry} onChange={e => set("ministry", e.target.value)}
                placeholder="e.g. Ministry of Road Transport & Highways" className="input-field" />
              <ErrMsg field="ministry" />
            </div>

            <div>
              <label className="label-xs">Implementing Agency *</label>
              <input type="text" value={form.agency} onChange={e => set("agency", e.target.value)}
                placeholder="e.g. NHAI Regional Office, Hyderabad" className="input-field" />
              <ErrMsg field="agency" />
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 2: Land & Family Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-xs">Total Land Required (Acres) *</label>
                <input type="number" value={form.landRequired} onChange={e => set("landRequired", e.target.value)}
                  placeholder="e.g. 1250" className="input-field" min="1" />
                <ErrMsg field="landRequired" />
              </div>
              <div>
                <label className="label-xs">Number of Land Parcels *</label>
                <input type="number" value={form.parcels} onChange={e => set("parcels", e.target.value)}
                  placeholder="e.g. 45" className="input-field" min="1" />
                <ErrMsg field="parcels" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-xs">Total Affected Families *</label>
                <input type="number" value={form.affectedFamilies} onChange={e => set("affectedFamilies", e.target.value)}
                  placeholder="e.g. 24" className="input-field" min="0" />
                <ErrMsg field="affectedFamilies" />
              </div>
              <div>
                <label className="label-xs">Estimated Compensation (₹ Crore) *</label>
                <input type="number" value={form.estimatedComp} onChange={e => set("estimatedComp", e.target.value)}
                  placeholder="e.g. 850" className="input-field" min="0" />
                <ErrMsg field="estimatedComp" />
              </div>
            </div>

            {/* Summary preview */}
            {form.landRequired && form.affectedFamilies && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs">
                <p className="font-bold text-blue-800 mb-2">📊 Quick Summary</p>
                <div className="grid grid-cols-2 gap-2 text-blue-700">
                  <span>Land Density: <strong>{(+form.landRequired / Math.max(+form.affectedFamilies, 1)).toFixed(1)} acres/family</strong></span>
                  <span>Comp per Acre: <strong>₹{form.estimatedComp ? ((+form.estimatedComp * 100) / +form.landRequired).toFixed(1) : "—"} L</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 3: Documents & Submit</h3>

            <div className="flex flex-col gap-3">
              {[
                { key: "dprUploaded",  label: "Detailed Project Report (DPR)",      req: true  },
                { key: "siaUploaded",  label: "Social Impact Assessment (SIA)",      req: true  },
                { key: "mapUploaded",  label: "Cadastral / Land Boundary Maps",      req: false },
              ].map(doc => (
                <div key={doc.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form[doc.key] ? "bg-emerald-100" : "bg-slate-100"}`}>
                      {form[doc.key] ? <CheckCircle2 size={18} className="text-emerald-600" /> : <FileText size={18} className="text-slate-400" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{doc.label}</p>
                      <p className="text-[10px] text-slate-400">{doc.req ? "Required" : "Optional"}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => set(doc.key, !form[doc.key])}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                      form[doc.key] ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-slate-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    {form[doc.key] ? <><CheckCircle2 size={12} /> Uploaded</> : <><Upload size={12} /> Upload</>}
                  </button>
                </div>
              ))}
            </div>

            {/* Review Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
              <p className="font-bold text-slate-700 mb-3 uppercase tracking-wider">Proposal Review Summary</p>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <span>Name: <strong className="text-slate-800">{form.name || "—"}</strong></span>
                <span>Type: <strong className="text-slate-800">{form.type}</strong></span>
                <span>State: <strong className="text-slate-800">{form.state}</strong></span>
                <span>District: <strong className="text-slate-800">{form.district || "—"}</strong></span>
                <span>Land: <strong className="text-slate-800">{form.landRequired || "—"} acres</strong></span>
                <span>Families: <strong className="text-slate-800">{form.affectedFamilies || "—"}</strong></span>
                <span>Est. Comp: <strong className="text-slate-800">₹{form.estimatedComp || "—"} Cr</strong></span>
                <span>Priority: <strong className="text-slate-800">{form.priority}</strong></span>
              </div>
            </div>

            {/* Declaration */}
            <label className="flex items-start gap-3 cursor-pointer bg-amber-50 border border-amber-200 rounded-xl p-4">
              <input
                type="checkbox"
                checked={form.agreedTerms}
                onChange={e => set("agreedTerms", e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
              />
              <span className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                I hereby declare that all information provided in this proposal is true and correct to the best of my knowledge, and the required land acquisition documents have been uploaded in accordance with RFCTLARR Act, 2013.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={step === 1 ? onCancel : () => setStep(s => s - 1)}
          className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
        >
          {step === 1 ? "Cancel" : "← Back"}
        </button>
        {step < 3 ? (
          <button onClick={nextStep} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm cursor-pointer transition-all shadow-lg shadow-blue-600/20">
            Next Step →
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm cursor-pointer transition-all shadow-lg shadow-emerald-600/20">
            Submit Proposal ✓
          </button>
        )}
      </div>

      <style>{`
        .label-xs { display: block; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .input-field { width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; font-size: 13px; background: #f8fafc; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .input-field:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
      `}</style>
    </div>
  );
}

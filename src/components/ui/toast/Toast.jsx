import { toast } from "react-toastify";

/* ── Accent colours per type ─────────────────────────────────── */
const ACCENT = {
  success: "#22c55e",
  error:   "#ef4444",
  warning: "#f59e0b",
  info:    "#4684ff",
};

/* ── Compact inline SVG icons ────────────────────────────────── */
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#22c55e"/>
    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const XCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#ef4444"/>
    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const WarnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#f59e0b"/>
    <path d="M8 5v3.5M8 10.5h.01" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#4684ff"/>
    <path d="M8 7.5V11M8 5.5h.01" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const ICONS = { success: <CheckIcon/>, error: <XCircleIcon/>, warning: <WarnIcon/>, info: <InfoIcon/> };

/* ── Toast body ───────────────────────────────────────────────── */
const ToastBody = ({ title, text, type }) => (
  <div style={{ display:"flex", alignItems:"flex-start", gap:"10px", padding:"2px 0", paddingRight:"24px" }}>
    <span style={{ marginTop:"1px", flexShrink:0 }}>{ICONS[type]}</span>
    <div style={{ flex:1, minWidth:0 }}>
      {title && (
        <p style={{ margin:0, fontSize:"13px", fontWeight:600, color:"#111827", lineHeight:"1.3" }}>
          {title}
        </p>
      )}
      {text && (
        <p style={{ margin: title ? "2px 0 0" : 0, fontSize:"12px", color:"#6b7280", lineHeight:"1.4" }}>
          {text}
        </p>
      )}
    </div>
  </div>
);

/* ── Shared options factory ───────────────────────────────────── */
const makeOptions = (type, timer) => ({
  position:        "top-right",
  autoClose:       timer ?? 3000,
  hideProgressBar: false,
  closeOnClick:    true,
  pauseOnHover:    true,
  draggable:       false,
  icon:            false,
  closeButton:     ({ closeToast }) => (
    <button
      onClick={closeToast}
      style={{
        background:"none", border:"none", cursor:"pointer",
        padding:"4px", color:"#9ca3af", lineHeight:1,
        position:"absolute", top:"12px", right:"12px",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </button>
  ),
  style: {
    background:   "#ffffff",
    borderRadius: "12px",
    boxShadow:    "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
    padding:      "12px 14px",
    minWidth:     "260px",
    maxWidth:     "340px",
    borderLeft:   `3px solid ${ACCENT[type]}`,
    border:       `1px solid #f1f5f9`,
    borderLeftWidth: "3px",
    borderLeftColor: ACCENT[type],
    position:     "relative",
  },
  progressStyle: { background: ACCENT[type], height:"2px" },
});

/* ── Public API ───────────────────────────────────────────────── */
const Toast = {
  success: (title, text, timer) => {
    const t = typeof title === "string" ? title : undefined;
    const b = typeof title === "string" ? text  : title;
    toast(<ToastBody title={t} text={b} type="success"/>, makeOptions("success", timer));
  },
  error: (title, text) => {
    const t = typeof title === "string" ? title : undefined;
    const b = typeof title === "string" ? text  : title;
    toast(<ToastBody title={t} text={b} type="error"/>, makeOptions("error"));
  },
  warning: (title, text) => {
    const t = typeof title === "string" ? title : undefined;
    const b = typeof title === "string" ? text  : title;
    toast(<ToastBody title={t} text={b} type="warning"/>, makeOptions("warning"));
  },
  info: (title, text) => {
    const t = typeof title === "string" ? title : undefined;
    const b = typeof title === "string" ? text  : title;
    toast(<ToastBody title={t} text={b} type="info"/>, makeOptions("info"));
  },
};

export default Toast;

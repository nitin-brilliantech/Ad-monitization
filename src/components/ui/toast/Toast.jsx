// toast.js
import Swal from "sweetalert2";

// 🎨 Themed toast styles (using only brand colors w/ lighter rgba variants)
const toastThemes = {
  success: {
    background: "rgba(68, 94, 148, 0.85)", // lightened #445E94
    color: "white",
    iconColor: "white",
    border: "1px solid #445E94",
    shadow: "0 4px 12px rgba(68, 94, 148, 0.4)",
  },
  error: {
    background: "rgba(22, 18, 47, 0.85)", // lightened #16122F
    color: "white",
    iconColor: "#445E94",
    border: "1px solid #16122F",
    shadow: "0 4px 12px rgba(22, 18, 47, 0.5)",
  },
  warning: {
    background: "rgba(84, 84, 84, 0.85)", // softened #545454
    color: "white",
    iconColor: "#445E94",
    border: "1px solid #545454",
    shadow: "0 4px 12px rgba(84, 84, 84, 0.5)",
  },
  info: {
    background: "rgba(68, 94, 148, 0.75)", // lighter blue
    color: "white",
    iconColor: "#16122F",
    border: "1px solid #445E94",
    shadow: "0 4px 12px rgba(68, 94, 148, 0.5)",
  },
  default: {
    background: "rgba(22, 18, 47, 0.8)", // fallback deep purple
    color: "white",
    iconColor: "#445E94",
    border: "1px solid #445E94",
    shadow: "0 4px 12px rgba(22, 18, 47, 0.4)",
  },
};

// ✅ Base config
const baseConfig = {
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  toast: true,
  timerProgressBar: true,
  customClass: {
    popup: "branded-toast",
  },
};

const Toast = ({
  title = "Notification",
  text = "",
  icon = "info",
  timer,
  showOkBtn,
}) => {
  const theme = toastThemes[icon] || toastThemes.default;

  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon,
    timer: timer ?? baseConfig.timer,
    showConfirmButton: showOkBtn ?? baseConfig.showConfirmButton,
    background: theme.background,
    color: theme.color,
    iconColor: theme.iconColor,
    didOpen: (popup) => {
      Object.assign(popup.style, {
        border: theme.border,
        boxShadow: theme.shadow,
        borderRadius: "12px",
        padding: "14px 18px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      });
    },
  });
};

// 🔹 Shortcuts
Toast.success = (title, text,timer) => Toast({ title, text, icon: "success",timer });
Toast.error = (title, text) => Toast({ title, text, icon: "error" });
Toast.warning = (title, text) => Toast({ title, text, icon: "warning" });
Toast.info = (title, text) => Toast({ title, text, icon: "info" });

export default Toast;
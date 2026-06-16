import { Modal as MUIModal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import LoaderEmpt from "../../../components/loader/LoaderEmpt";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  isFullscreen = false,
  size = "md", // "sm", "md", "lg", "xl", "full"
  containerClassName = "",
  containerSx = {},
  modalSx = {},
  disableBackdropClick = false,
  formLoading = false,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getSizeClass = () => {
    if (isFullscreen || size === "full") return "w-screen h-screen";
    if (size === "sm") return "w-[300px]";
    if (size === "md") return "w-[90vw] sm:w-[600px]";
    if (size === "lg") return "w-[90vw] sm:w-[800px]";
    if (size === "xl") return "w-[95vw] sm:w-[1000px]";
    return "w-[90vw] sm:w-[600px]";
  };

  return (
    <MUIModal
      open={isOpen}
      onClose={disableBackdropClick ? undefined : onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeAfterTransition
      disableAutoFocus
      disableEnforceFocus
      sx={{
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(59, 89, 152, 0.15)",
        zIndex: 1300,
        ...modalSx,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        className={`
          relative bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-100
          max-h-[90vh] overflow-y-auto ${getSizeClass()} ${containerClassName}
        `}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: 0,
          scrollbarWidth: "thin",
          scrollbarColor: "#5B7FE5 #E0E7FF",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#E0E7FF",
            borderRadius: "10px",
            margin: "8px 0",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#5B7FE5",
            borderRadius: "10px",
            "&:hover": {
              background: "#4a6dd4",
            },
          },
          ...containerSx,
        }}
      >
        {/* Blue header bar — renders when title prop is provided */}
        {title ? (
          <div className="flex items-center justify-between px-6 py-4 bg-[#4684ff] rounded-t-2xl">
            <h2 id="modal-title" className="text-xl font-bold text-white">
              {title}
            </h2>
            {showCloseButton && (
              <IconButton
                onClick={onClose}
                size="small"
                className="!text-white/80 hover:!text-white hover:!bg-white/20 transition-colors"
                aria-label="Close modal"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        ) : (
          showCloseButton && (
            <IconButton
              onClick={onClose}
              className="!absolute right-4 top-4 !text-gray-400 hover:!text-blue-600 z-10 transition-colors"
              aria-label="Close modal"
            >
              <CloseIcon />
            </IconButton>
          )
        )}

        {/* Modal body */}
        <div className="p-6">
          {formLoading && <LoaderEmpt size="large" />}
          {children}
        </div>
      </Box>
    </MUIModal>
  );
};
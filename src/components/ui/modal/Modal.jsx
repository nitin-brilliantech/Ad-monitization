import { Modal as MUIModal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import LoaderEmpt from "../../../components/loader/LoaderEmpt"
export const Modal = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  isFullscreen = false,
  size = "md", // "sm", "md", "lg", "xl", "full"hy
  containerClassName = "",
  containerSx = {},
  modalSx = {},
  disableBackdropClick = false,
  formLoading =false
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
        // backdropFilter: "blur(32px)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        zIndex: 1300,
        ...modalSx,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        className={`
          relative bg-white rounded-3xl shadow-lg p-6 
          max-h-[90vh] overflow-y-auto ${getSizeClass()} ${containerClassName}
        `}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          scrollbarWidth: "none", 
          msOverflowStyle: "none", 
          "&::-webkit-scrollbar": {
            display: "none", 
          },
          ...containerSx,
        }}
      >
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            className="!absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:hover:text-white z-10"
          >
            <CloseIcon />
          </IconButton>
        )}
        {formLoading && (
  <LoaderEmpt size="large" />)}
{children}



      </Box>
    </MUIModal>
  );
};
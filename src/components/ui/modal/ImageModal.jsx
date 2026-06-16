import { Modal as MUIModal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import LoaderEmpt from "../../../components/loader/LoaderEmpt";

export const ImageModal = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  containerClassName = "",
  containerSx = {},
  modalSx = {},
  disableBackdropClick = false,
  formLoading = false,
  gap = 20,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...modalSx,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full h-full ${containerClassName} p-30`}
        sx={{
          position: "relative",
          width: `calc(100vw - ${gap * 2}px)`,
          height: `calc(100vh - ${gap * 2}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          ...containerSx,
        }}
      >
        {/* Close Button */}
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            className="!absolute right-4 top-4 text-white z-50"
          >
            <CloseIcon />
          </IconButton>
        )}

        {/* Loading */}
        {formLoading && <LoaderEmpt size="large" />}

        {/* Fullscreen image */}
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </Box>
    </MUIModal>
  );
};

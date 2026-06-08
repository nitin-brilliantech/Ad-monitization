import { useState } from "react";

const ImageRenderer = ({
  src,
  alt = "image",
  className = "w-full h-full object-cover",
  fallback = "/no-image.png",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
      loading="lazy"
      className={className}
      {...props}
    />
  );
};

export default ImageRenderer;

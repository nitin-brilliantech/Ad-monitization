import React from "react";

const VideoRenderer = ({
  src,
  className = "w-full h-full object-cover",
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  poster = "/video-thumbnail.png",
  ...props
}) => {
  if (!src) return null;

  return (
    <video
      src={src}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      poster={poster}
      className={className}
      {...props}
    />
  );
};

export default VideoRenderer;

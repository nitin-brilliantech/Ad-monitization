import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Custom Next Arrow
const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 bg-white text-gray-700 border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
    aria-label="Next Slide"
  >
    <FaChevronRight className="w-4 h-4" />
  </button>
);

// Custom Previous Arrow
const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50 bg-white text-gray-700 border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <FaChevronLeft className="w-4 h-4" />
  </button>
);

// Detect if file is a video
const isVideo = (url) => url?.match(/\.(mp4|webm|ogg)$/i);

// Height class mapping for different sizes
const sizeClassMap = {
  sm: "h-60",
  md: "h-80",
  lg: "h-[500px]",
  xl: "h-full",
};

const MediaCarousels = ({ mediaFiles = { images: [], videos: [] }, size = "md", autoplay = false }) => {
  // Merge images and videos into a single array
  const files = [
    ...(Array.isArray(mediaFiles.images) ? mediaFiles.images : []),
    ...(Array.isArray(mediaFiles.videos) ? mediaFiles.videos : []),
  ];

  const isSingleItem = files.length === 1;

  const settings = {
    dots: !isSingleItem,
    infinite: !isSingleItem,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !isSingleItem,
    autoplay: !isSingleItem && autoplay,
    autoplaySpeed: 3000,
    nextArrow: !isSingleItem ? <NextArrow /> : null,
    prevArrow: !isSingleItem ? <PrevArrow /> : null,
  };

  const heightClass = sizeClassMap[size] || sizeClassMap["md"];

  return (
    <div className="relative w-full">
      <Slider {...settings}>
        {files.map((file, idx) => (
          <div key={`${file}-${idx}`} className="w-full">
            <div className={`w-full overflow-hidden rounded ${heightClass}`}>
              {isVideo(file) ? (
                <video
                  src={file}
                  controls
                  autoPlay={autoplay}
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={file}
                  alt={`Media ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MediaCarousels;
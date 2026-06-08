import ImageRenderer from "../media/ImageRenderer";
import VideoRenderer from "../media/VideoRenderer";

const ProductMedia = ({ productFiles }) => {
  if (!productFiles) return null;

  const mainImage = productFiles.images?.[0];
  const mainVideo = productFiles.videos?.[0];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">Product Media</h3>

      <div className="flex flex-col md:flex-row gap-6 p-4 border border-gray-300 rounded-xl bg-gray-50">
        {/* Main Media */}
        <div className="w-full md:w-1/3">
          <p className="text-sm font-medium mb-2">Main Product Image/Video</p>
          {mainImage ? (
            <div className="rounded-md overflow-hidden border border-dashed border-gray-300 bg-white aspect-[3/2]">
             <ImageRenderer
                src={mainImage}
                alt="Main Product"
                className="w-full h-full object-contain"
              />
            </div>
          ) : mainVideo ? (
            <div className="rounded-md overflow-hidden border border-dashed border-gray-300 bg-white aspect-[3/2]">
              <VideoRenderer
                src={mainVideo}
                className="w-full h-full object-contain"
                poster="/fallback-video-thumbnail.png"
                muted
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 border border-dashed text-gray-400 text-sm">
              No media available
            </div>
          )}
        </div>

        {/* Other Media */}
        <div className="w-full md:w-2/3">
          <p className="text-sm font-medium mb-2">Other Images/Videos</p>
          <div className="flex flex-wrap gap-4">
            {productFiles.images?.slice(1).map((url, i) => (
              <div key={`img-${i}`} className="w-24 h-24 rounded-md overflow-hidden border border-dashed bg-white">
                <ImageRenderer
                  src={url}
                  alt={`Other Image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {productFiles.videos?.slice(1).map((url, i) => (
              <div key={`vid-${i}`} className="w-24 h-24 rounded-md overflow-hidden border border-dashed bg-white">
                <VideoRenderer
                  src={url}
                  className="w-full h-full object-cover"
                  poster="/fallback-video-thumbnail.png"
                  muted
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMedia;

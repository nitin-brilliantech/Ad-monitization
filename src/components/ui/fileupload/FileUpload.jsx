import React, { useRef, useState, useEffect } from 'react';
import { useController } from 'react-hook-form';
import Label from '../label/Label';
import { FiImage, FiX } from 'react-icons/fi';

const FileUpload = ({
  name,
  label,
  control,
  accept = '.jpg,.png,.mp4',
  inputProps = {},
  labelProps = {},
    maxFileSizeMB = 5,

}) => {
  const {
    field: { onChange, value = [] },
    fieldState: { error },
  } = useController({ name, control });

  const inputRef = useRef();
  const [failedUrls, setFailedUrls] = useState([]);

  const validFiles = (value || []).filter(
    (file) => file && (typeof file === 'string' || file instanceof File)
  );
  const mainFile = validFiles[0];
  const otherFiles = validFiles.slice(1);
  const hasFiles = validFiles.length > 0;

  // Generate object URLs for File objects only, keep strings as-is (S3 URLs)
  const urls = validFiles.map((file) => {
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file);
  });

  // Cleanup object URLs on unmount or when files change
  useEffect(() => {
    return () => {
      urls.forEach((url, idx) => {
        if (typeof validFiles[idx] !== 'string') {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [validFiles]); // runs cleanup when validFiles change

  // const handleFileChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   onChange([...validFiles, ...files]);
  //   e.target.value = '';
  // };
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  const maxBytes = maxFileSizeMB * 1024 * 1024;

  const [valid, oversized] = files.reduce(
    ([validFiles, oversizedFiles], file) => {
      if (file.size <= maxBytes) {
        return [[...validFiles, file], oversizedFiles];
      } else {
        return [validFiles, [...oversizedFiles, file.name]];
      }
    },
    [[], []]
  );

  if (oversized.length > 0) {
    alert(
      `The following files exceed the ${maxFileSizeMB}MB limit and were not added:\n\n${oversized.join(
        '\n'
      )}`
    );
  }

  onChange([...validFiles, ...valid]);
  e.target.value = '';
};

  const handleRemove = (idx) => {
    const newFiles = validFiles.filter((_, i) => i !== idx);
    onChange(newFiles);
    const removedUrl = urls[idx];
    setFailedUrls((prev) => prev.filter((url) => url !== removedUrl));
  };

  const renderPreview = (file, index) => {
    if (!file || (typeof file !== 'string' && !(file instanceof File))) {
      return (
        <div className="flex flex-col items-center justify-center p-2 w-full h-full">
          <FiImage className="text-2xl text-gray-400" />
          <span className="text-xs mt-1 text-center">Invalid file</span>
        </div>
      );
    }

    const isString = typeof file === 'string';
    const url = urls[index];
    const isFailed = failedUrls.includes(url);

    
    const isVideo = isString
      ? /\.(mp4|webm|ogg)$/i.test(url)
      : file.type.startsWith('video/');
    const isImage = isString
      ? /\.(jpeg|jpg|png|gif|webp)$/i.test(url)
      : file.type.startsWith('image/');

    if (isFailed) {
      return (
        <div className="flex flex-col items-center justify-center p-2 w-full h-full">
          <FiImage className="text-2xl text-gray-400" />
          <span className="text-xs mt-1 text-center">Failed to load</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        {isVideo ? (
          <video
            src={url}
            className="w-full h-full object-cover rounded"
            controls
            onError={() => {
              console.error(`Failed to load video: ${url}`);
              setFailedUrls((prev) => [...prev, url]);
            }}
          />
        ) : isImage ? (
          <img
            src={url}
            alt={`preview-${index}`}
            className="w-full h-full object-cover rounded"
            onError={() => {
              console.error(`Failed to load image: ${url}`);
              setFailedUrls((prev) => [...prev, url]);
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-2 w-full h-full">
            <FiImage className="text-2xl text-gray-400" />
            <span className="text-xs mt-1 text-center">Unsupported format</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-4">
      <Label text={label} {...labelProps} />
      <div className="border border-dashed rounded-xl p-3 bg-gray-50">
        {!hasFiles ? (
          <div className="flex flex-col items-center justify-center py-10">
            <FiImage className="text-4xl text-gray-400 mb-2" />
            <div className="font-medium text-gray-700 mb-1">Drop image or browse</div>
            {/* <div className="text-xs text-gray-400 mb-3">Format: .jpeg, .png, .mp4</div> */}
            <p className="text-xs text-gray-400 mb-3">
  Format: jpeg, png, mp4. Max file size: {maxFileSizeMB}MB.
</p>

            <input
              type="file"
              accept={accept}
              multiple
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
              {...inputProps}
            />
            <button
              type="button"
              className="px-4 py-1 border border-blue-400 rounded text-blue-500 hover:bg-blue-50 text-sm cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              Browse Files
            </button>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Main File */}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1">Main Product Image/ Video</span>
                <div className="w-32 h-32 border border-dashed rounded-lg flex items-center justify-center bg-white relative overflow-hidden">
                  {mainFile ? (
                    <>
                      {renderPreview(mainFile, 0)}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500 hover:bg-red-50"
                        onClick={() => handleRemove(0)}
                      >
                        <FiX size={16} />
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs">No file</span>
                  )}
                </div>
              </div>

              {/* Other Files */}
              <div className="flex-1">
                <span className="text-xs mb-1">Other Images/ Videos</span>
                <div className="flex gap-2 flex-wrap">
                  {otherFiles.length > 0 ? (
                    otherFiles.map((file, idx) => (
                      <div
                        key={`other-${idx}`}
                        className="w-24 h-24 border border-dashed rounded-lg flex items-center justify-center bg-white relative overflow-hidden"
                      >
                        {renderPreview(file, idx + 1)}
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-red-500 hover:bg-red-50"
                          onClick={() => handleRemove(idx + 1)}
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="w-24 h-24 border border-dashed rounded-lg flex items-center justify-center bg-white text-gray-400 text-xs">
                      No files
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mt-4">
              <input
                type="file"
                accept={accept}
                multiple
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
                {...inputProps}
              />
              <button
                type="button"
                className="px-4 py-1 border border-blue-400 rounded text-blue-500 hover:bg-blue-50 text-sm"
                onClick={() => inputRef.current?.click()}
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-400 mt-1">
  Format: jpeg, png, mp4. Max file size: {maxFileSizeMB}MB.
</p>

            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default FileUpload;


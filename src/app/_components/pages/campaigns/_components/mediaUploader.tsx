"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

type MediaUploaderProps = {
  onMediaChange: (media: { images: File[]; video: File | null }) => void;
};

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaChange }) => {
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validImages = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    const totalImages = [...images, ...validImages].slice(0, 3);
    if (totalImages.length > 3) {
      toast.error("You can only upload up to 3 images");
    }

    setImages(totalImages);
    onMediaChange({ images: totalImages, video });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Uploaded file is not a video");
    } else if (file.size > 20 * 1024 * 1024) {
      toast.error("Video exceeds 20MB size limit");
    } else {
      setVideo(file);
      onMediaChange({ images, video: file });
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    onMediaChange({ images: updated, video });
  };

  const removeVideo = () => {
    setVideo(null);
    onMediaChange({ images, video: null });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold mb-2">
          Upload Images (Max 3)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5V7.5A1.5 1.5 0 014.5 6h15a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 16.5zM21 12l-4.5-3.5L12 15l-4.5-6L3 12"
              />
            </svg>
            <p className="text-sm">Click or drag image files to upload</p>
            <span className="text-xs text-gray-400">
              (JPG, PNG, Max 5MB each)
            </span>
          </div>
        </div>
        <div className="flex gap-3 mt-2 flex-wrap">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-24 h-24 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${i}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Upload Video (Max 20MB)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a2.25 2.25 0 00-2.25-2.25h-3A2.25 2.25 0 008.25 6v4.5M4.5 10.5h15M6.75 10.5v6.75A2.25 2.25 0 009 19.5h6a2.25 2.25 0 002.25-2.25V10.5"
              />
            </svg>
            <p className="text-sm">Click or drag a video file to upload</p>
            <span className="text-xs text-gray-400">(MP4, Max 20MB)</span>
          </div>
        </div>
        {video && (
          <div className="relative mt-2 hover:bg-gray-100 cursor-pointer w-fit">
            <video
              src={URL.createObjectURL(video)}
              controls
              className="w-64 max-h-40 rounded"
            />
            <button
              onClick={removeVideo}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;

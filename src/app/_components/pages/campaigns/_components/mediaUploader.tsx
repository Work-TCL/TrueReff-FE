"use client";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

type MediaUploaderProps = {
  onMediaChange: (media: { images: File[]; video: File | null }) => void;
  setMediaPriview: (media: { images: string[]; video: string | null }) => void;
  mediaPreview: { images: string[]; video: string | null };
};

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onMediaChange,
  mediaPreview,
  setMediaPriview,
}) => {
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

    // how many are already on the server / in the preview
    const existingCount = mediaPreview.images.length; // e.g. 2
    const maxTotal = 3;

    // how many more we’re allowed to add
    const availableSlots = maxTotal - existingCount; // e.g. 1

    // combine your new files (from file input + any validated ones)
    const pending = [...images, ...validImages]; // e.g. 2 new selects

    const totalImages = pending.slice(0, availableSlots);
    if (availableSlots < pending.length || pending.length > 3) {
      toast.error("You can only upload up to 3 images");
    }

    setImages(totalImages);
    onMediaChange({ images: totalImages, video });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mediaPreview.video) {
      toast.error("You can only upload 1 video");
      return;
    }

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
  const removeFromS3 = (index: number) => {
    const updated = [...mediaPreview.images];
    updated.splice(index, 1);
    setMediaPriview({ images: updated, video: mediaPreview.video });
  };
  const removeVideoFromS3 = () => {
    setMediaPriview({ images: mediaPreview.images, video: null });
  };

  const removeVideo = () => {
    setVideo(null);
    onMediaChange({ images, video: null });
  };

  const videoPreviewUrl = useMemo(() => {
    return video ? URL.createObjectURL(video) : null;
  }, [video]);

  const imagePreviewUrls = useMemo(() => {
    return images.map((img) => URL.createObjectURL(img));
  }, [images]);

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
          {mediaPreview.images.map((img, i) => (
            <div
              key={i}
              className="relative w-24 h-24 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={img}
                alt={`preview-${i}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => removeFromS3(i)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
          {imagePreviewUrls.map((img, i) => (
            <div
              key={i}
              className="relative w-24 h-24 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={img}
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
        {mediaPreview.video && (
          <div className="relative mt-2 hover:bg-gray-100 cursor-pointer w-fit">
            <video
              src={mediaPreview.video}
              controls
              className="w-64 max-h-40 rounded"
            />
            <button
              onClick={removeVideoFromS3}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
        {videoPreviewUrl && (
          <div className="relative mt-2 hover:bg-gray-100 cursor-pointer w-fit">
            <video
              src={videoPreviewUrl}
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

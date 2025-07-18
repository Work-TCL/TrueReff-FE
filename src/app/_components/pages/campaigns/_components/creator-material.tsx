"use client";
import { Video } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@sohanemon/utils";
import { labelStyle } from "@/app/_components/ui/form/Input";

type MediaUploaderProps = {
  onMediaChange: (media: { images: File[]; video: File | null }) => void;
  setMediaPriview: (media: { images: string[]; video: string | null }) => void;
  mediaPreview: { images: string[]; video: string | null };
  videoTypeComponent?: () => any;
  disabled: boolean;
};

const CreatorMaterial: React.FC<MediaUploaderProps> = ({
  onMediaChange,
  mediaPreview,
  setMediaPriview,
  videoTypeComponent,
  disabled = false,
}) => {
  const t = useTranslations();

  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const imagePreviewUrls = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images]
  );

  const videoPreviewUrl = useMemo(
    () => (video ? URL.createObjectURL(video) : null),
    [video]
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let newImages: File[] = [...images];
    let newVideo: File | null = video;

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        if (mediaPreview.images.length + newImages.length >= 3) {
          toast.error("You can only upload up to 3 images.");
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit.`);
          continue;
        }
        newImages.push(file);
      } else if (file.type.startsWith("video/")) {
        if (mediaPreview.video || newVideo) {
          toast.error("You can only upload 1 video.");
          continue;
        }
        if (file.size > 20 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 20MB limit.`);
          continue;
        }
        newVideo = file;
      } else {
        toast.error(`${file.name} is not a supported file type.`);
      }
    }

    setImages(newImages);
    setVideo(newVideo);
    onMediaChange({ images: newImages, video: newVideo });
  };

  const removeLocalImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    onMediaChange({ images: updated, video });
  };

  const removeImageFromS3 = (index: number) => {
    const updated = [...mediaPreview.images];
    updated.splice(index, 1);
    setMediaPriview({ images: updated, video: mediaPreview.video });
  };

  const removeLocalVideo = () => {
    setVideo(null);
    onMediaChange({ images, video: null });
  };

  const removeVideoFromS3 = () => {
    setMediaPriview({ images: mediaPreview.images, video: null });
  };

  return (
    <div className="space-y-2">
      {!disabled && (
        <>
          <label className={cn(labelStyle, "mb-1")}>Upload Media</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-10 bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              capture={false} 
              onChange={handleUpload}
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
              <p className="text-lg mb-1 mt-2">
                Upload your content magic ✨ — click or drag files here
              </p>
              <span className="text-base text-gray-400">
                🎥 MP4 Video (Max 20MB) | 🖼️ JPG/PNG Images (Max 5MB each)
              </span>
            </div>
          </div>
        </>
      )}

      {videoTypeComponent && videoTypeComponent()}

      <div className="flex gap-3 mt-2 flex-wrap">
        {mediaPreview.images.map((src, i) => (
          <PreviewCard
            key={`s3-image-${i}`}
            src={src}
            type="image"
            onRemove={() => removeImageFromS3(i)}
            disabled={disabled}
          />
        ))}

        {imagePreviewUrls.map((url, i) => (
          <PreviewCard
            key={`local-image-${i}`}
            src={url}
            type="image"
            onRemove={() => removeLocalImage(i)}
            disabled={disabled}
          />
        ))}

        {mediaPreview.video && (
          <PreviewCard
            src={mediaPreview.video}
            type="video"
            onRemove={removeVideoFromS3}
            disabled={disabled}
          />
        )}

        {videoPreviewUrl && (
          <PreviewCard
            src={videoPreviewUrl}
            type="video"
            onRemove={removeLocalVideo}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

const PreviewCard = ({
  src,
  type,
  onRemove,
  disabled,
}: {
  src: string;
  type: "image" | "video";
  onRemove: () => void;
  disabled: boolean;
}) => {
  return (
    <div className="relative w-32 h-32 rounded overflow-hidden hover:bg-gray-100 cursor-pointer">
      {type === "image" ? (
        <img
          src={src}
          alt="preview"
          className="w-full h-full object-cover rounded product-img"
        />
      ) : (
        <video
          src={src}
          className="w-full h-full object-cover rounded"
          controls
        />
      )}
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default CreatorMaterial;

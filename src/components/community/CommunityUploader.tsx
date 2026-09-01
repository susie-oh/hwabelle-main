import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Video as VideoIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SelectedMediaFile {
  id: string;
  file: File;
  previewUrl: string;
  type: "image" | "video";
  size: number;
  uploadProgress?: number; // 0-100
  uploadStatus?: "idle" | "uploading" | "success" | "error";
  errorMessage?: string;
}

interface CommunityUploaderProps {
  files: SelectedMediaFile[];
  onChange: (files: SelectedMediaFile[]) => void;
  disabled?: boolean;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4"];

export const CommunityUploader: React.FC<CommunityUploaderProps> = ({
  files,
  onChange,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasVideo = files.some((f) => f.type === "video");
  const hasImages = files.some((f) => f.type === "image");

  const validateAndAddFiles = (newFilesList: FileList | File[]) => {
    setErrorMsg(null);
    const addedFiles = Array.from(newFilesList);

    if (addedFiles.length === 0) return;

    let updated = [...files];

    for (const file of addedFiles) {
      const isImg = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVid = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImg && !isVid) {
        setErrorMsg(`"${file.name}" has an unsupported format. Please upload JPEG, PNG, WebP or MP4.`);
        return;
      }

      // Check mixing
      if (isVid && (hasImages || updated.some((f) => f.type === "image"))) {
        setErrorMsg("You can submit up to 5 images OR 1 video, but not both.");
        return;
      }

      if (isImg && (hasVideo || updated.some((f) => f.type === "video"))) {
        setErrorMsg("You can submit up to 5 images OR 1 video, but not both.");
        return;
      }

      // Check video limits
      if (isVid) {
        if (updated.length > 0) {
          setErrorMsg("Only 1 short video can be submitted.");
          return;
        }
        if (file.size > MAX_VIDEO_BYTES) {
          setErrorMsg(`Video "${file.name}" exceeds the 100MB maximum file size.`);
          return;
        }
      }

      // Check image limits
      if (isImg) {
        if (updated.length >= MAX_IMAGES) {
          setErrorMsg(`Maximum of ${MAX_IMAGES} images allowed.`);
          return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          setErrorMsg(`Image "${file.name}" exceeds the 10MB maximum file size.`);
          return;
        }
      }

      const previewUrl = URL.createObjectURL(file);
      updated.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        file,
        previewUrl,
        type: isVid ? "video" : "image",
        size: file.size,
        uploadStatus: "idle",
      });
    }

    onChange(updated);
  };

  const handleRemove = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl);
    }
    setErrorMsg(null);
    onChange(files.filter((f) => f.id !== id));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    // reset input so selecting the same file triggers change
    if (inputRef.current) inputRef.current.value = "";
  };

  const canAddMore =
    !hasVideo && files.length < MAX_IMAGES && (files.length === 0 || hasImages);

  return (
    <div className="space-y-4">
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        multiple={!hasVideo && files.length < MAX_IMAGES}
        accept="image/jpeg,image/png,image/webp,video/mp4"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
        aria-label="Upload project media"
      />

      {/* Upload Zone */}
      {files.length === 0 || canAddMore ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-primary bg-secondary/50 scale-[0.99]"
              : "border-border/80 hover:border-primary/60 hover:bg-secondary/20"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground">
              <Upload className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Up to 5 photos (JPEG, PNG, WebP · max 10MB each) or 1 video (MP4 · max 100MB)
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Error message */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {files.map((file, idx) => (
            <div
              key={file.id}
              className="group relative aspect-square rounded-lg border border-border overflow-hidden bg-secondary shadow-sm"
            >
              {file.type === "image" ? (
                <img
                  src={file.previewUrl}
                  alt={`Upload preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 text-white p-2">
                  <VideoIcon className="w-8 h-8 text-primary-foreground mb-1" />
                  <span className="text-[10px] truncate max-w-full text-zinc-300">
                    {file.file.name}
                  </span>
                </div>
              )}

              {/* Top badges */}
              <div className="absolute top-1.5 left-1.5">
                <span className="bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium px-2 py-0.5 rounded">
                  {idx === 0 ? "Cover" : `#${idx + 1}`}
                </span>
              </div>

              {/* Progress bar overlay during upload */}
              {file.uploadStatus === "uploading" && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-3">
                  <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${file.uploadProgress || 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white mt-1">
                    {file.uploadProgress || 0}%
                  </span>
                </div>
              )}

              {file.uploadStatus === "success" && (
                <div className="absolute top-1.5 right-8 bg-emerald-600 text-white rounded-full p-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Remove button */}
              {!disabled && file.uploadStatus !== "uploading" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file.id);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                  aria-label={`Remove file ${idx + 1}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

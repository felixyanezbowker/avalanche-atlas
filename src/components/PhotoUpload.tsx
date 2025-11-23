"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface PhotoUploadProps {
  onPhotosChange: (photos: File[]) => void;
  existingPhotoUrl?: string | null;
}

export default function PhotoUpload({ onPhotosChange, existingPhotoUrl }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPreviews(newPreviews);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Photos (optional)
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {existingPhotoUrl && (
          <div className="relative">
            <Image
              src={existingPhotoUrl}
              alt="Existing photo"
              width={200}
              height={200}
              className="rounded-md object-cover"
            />
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Existing
            </span>
          </div>
        )}
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            <Image
              src={preview}
              alt={`Preview ${index + 1}`}
              width={200}
              height={200}
              className="rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


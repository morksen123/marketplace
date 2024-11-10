// components/PhotoUpload/PhotoUpload.tsx
import { Button } from '@/components/ui/button';
import { handleErrorApi } from '@/lib/api-client';
import { uploadMultipleFilesToS3 } from '@/lib/aws';
import { Camera, Loader2, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ReviewPhotoUploadProps {
  photoUrls: string[];
  onPhotosChange: (urls: string[]) => void;
  maxPhotos?: number;
}

export const ReviewPhotoUpload = ({
  photoUrls,
  onPhotosChange,
  maxPhotos = 4,
}: ReviewPhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (photoUrls.length + acceptedFiles.length > maxPhotos) {
        handleErrorApi(
          'Upload limit reached',
          `Maximum ${maxPhotos} photos allowed`,
        );
        return;
      }

      try {
        setIsUploading(true);
        const uploadedUrls = await uploadMultipleFilesToS3(acceptedFiles);
        onPhotosChange([...photoUrls, ...uploadedUrls]);
      } catch (error) {
        console.error(error);
        handleErrorApi('Error uploading photos:', 'Please try again');
      } finally {
        setIsUploading(false);
      }
    },
    [photoUrls, onPhotosChange, maxPhotos],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop,
    multiple: true,
    disabled: isUploading || photoUrls.length >= maxPhotos,
  });

  const handleRemovePhoto = (indexToRemove: number) => {
    const updatedUrls = photoUrls.filter((_, index) => index !== indexToRemove);
    onPhotosChange(updatedUrls);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg transition-colors
          ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'}
          ${
            isUploading || photoUrls.length >= maxPhotos
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:border-gray-400'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="p-6 text-center">
          {isUploading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : isDragActive ? (
            <p className="text-green-600">Drop the files here...</p>
          ) : (
            <div className="space-y-2">
              <Button
                type="button"
                disabled={isUploading || photoUrls.length >= maxPhotos}
              >
                <Camera className="h-5 w-5 mr-2" />
                Upload Photos
              </Button>
              <p className="text-sm text-gray-500">
                or drag and drop images here
              </p>
              {photoUrls.length >= maxPhotos && (
                <p className="text-sm text-red-500">
                  Maximum {maxPhotos} photos allowed
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Photo Preview Grid */}
      {photoUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {photoUrls.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Review photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md
                  opacity-0 group-hover:opacity-100 transition-opacity
                  hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

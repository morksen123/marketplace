import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileIcon, UploadIcon } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  label: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.jpg', '.jpeg', '.png'],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  label,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-gray-300 hover:border-primary',
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        {acceptedFiles.length > 0 ? (
          <>
            <FileIcon className="h-10 w-10 text-primary" />
            <p className="text-sm text-gray-600">{acceptedFiles[0].name}</p>
          </>
        ) : (
          <>
            <UploadIcon className="h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600">{label}</p>
          </>
        )}
      </div>
      <Button type="button" variant="outline" className="mt-4">
        Select File
      </Button>
    </div>
  );
};

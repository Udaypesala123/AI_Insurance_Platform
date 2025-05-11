'use client';

import React, { useCallback, useState } from 'react';

export type FileStatus = 'uploaded' | 'processing' | 'done' | 'error';

export type FileWithStatus = {
  file: File;
  status: FileStatus;
};

type DropzoneProps = {
  onFilesSelected: (files: File[]) => void;
};

export default function Dropzone({ onFilesSelected }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<FileWithStatus[]>([]);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);

      const droppedFiles = Array.from(event.dataTransfer.files);
      const wrapped = droppedFiles.map(file => ({ file, status: 'uploaded' as const }));
      setFiles(prev => [...prev, ...wrapped]);
      onFilesSelected(droppedFiles);
    },
    [onFilesSelected]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const wrapped = selectedFiles.map(file => ({ file, status: 'uploaded' as const }));
    setFiles(prev => [...prev, ...wrapped]);
    onFilesSelected(selectedFiles);
  };

  return (
    <div
      onDragOver={e => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragging ? 'bg-blue-100 border-blue-400' : 'border-gray-300'
      }`}
    >
      <p className="text-gray-600">Drag and drop PDF, DOCX, or TXT files here</p>
      <p className="text-sm text-gray-400 mt-2">or click to select files</p>

      <input
        type="file"
        multiple
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {files.length > 0 && (
        <div className="mt-4 text-left">
          <h3 className="font-semibold text-sm mb-1">Uploaded Files:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {files.map(({ file, status }, index) => (
              <li key={index}>
                {file.name} — <span className="italic text-gray-500">{status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
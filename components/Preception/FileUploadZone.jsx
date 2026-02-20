import React, { useState, useCallback } from 'react';

const FileUploadZone = ({ onFilesUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesUploaded(files);
      }
    },
    [onFilesUploaded]
  );

  const handleFileSelect = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        onFilesUploaded(files);
      }
    },
    [onFilesUploaded]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative rounded-xl p-8 md:p-12
        border-2 border-dashed transition-all duration-300
        ${isDragging
          ? 'border-rose-400 bg-rose-50 scale-[1.02]'
          : 'border-gray-300 bg-gray-50 hover:border-rose-300 hover:bg-rose-50/50'
        }
      `}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-3xl">📄</span>
        </div>

        {/* Text */}
        <div>
          <p className="font-medium text-gray-700 mb-1">
            Drag & Drop Here
          </p>
          <p className="text-sm text-gray-500">
            just upload Document and generate prescription.
          </p>
        </div>

        {/* Browse Button */}
        <label className="cursor-pointer relative z-10">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          <span className="inline-block px-4 py-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-200 font-semibold hover:bg-rose-100 transition-colors shadow-sm">
            Browse to upload
          </span>
        </label>
      </div>

      {/* Drag Overlay Effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-rose-100/50 rounded-xl pointer-events-none" />
      )}
    </div>
  );
};

export default FileUploadZone;
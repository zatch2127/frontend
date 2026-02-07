import React from 'react';
import { useDashboard } from '../context/Dashboardcontext';
import FileUploadZone from '../FileUploadZone';
import Button from '../UI/Button';

const PrescriptionForm = () => {
  const { uploadedFiles, setUploadedFiles } = useDashboard();

  const handleFilesUploaded = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (indexToRemove) => {
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleGenerate = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload documents first');
      return;
    }
    alert(`Generating prescription with ${uploadedFiles.length} file(s)...`);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ================= Header ================= */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl">🩺</span>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Add Report & Get AI
          </h3>
          <p className="text-gray-600 text-sm">
            Upload reports (Images / PDF) and let AI generate prescription
          </p>
        </div>
      </div>

      {/* ================= Features ================= */}
      <div className="space-y-2">
        <FeatureItem text="Auto-analysis of past history" />
        <FeatureItem text="AI-generated medicine & tests" />
        <FeatureItem text="Instant risk scoring" />
      </div>

      {/* ================= Upload Zone ================= */}
      <FileUploadZone
        onFilesUploaded={handleFilesUploaded}
        accept="image/*,.pdf"
        multiple
      />

      {/* ================= Uploaded Files Preview ================= */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">

          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 border rounded-xl bg-gray-50"
            >
              {/* Preview */}
              <div className="w-16 h-16 rounded-lg bg-white border flex items-center justify-center overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-red-600">
                    <span className="text-xl">📄</span>
                    <span className="text-xs font-medium">PDF</span>
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= Generate Button ================= */}
      <Button
        variant="primary"
        size="lg"
        onClick={handleGenerate}
        className="w-full md:w-auto min-w-[240px]"
      >
        Generate with AI
      </Button>
    </div>
  );
};

/* ================= Feature Item ================= */

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-2">
    <span className="text-rose-500 text-sm">✓</span>
    <span className="text-gray-700 text-sm">{text}</span>
  </div>
);

export default PrescriptionForm;

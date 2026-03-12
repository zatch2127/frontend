import React, { useState, useRef } from 'react';
import { useDashboard } from '../context/Dashboardcontext';
import FileUploadZone from '../FileUploadZone';
import Button from '../UI/Button';

const EMOJI_LIST = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '🎉', '💊', '💉', '🩺', '🏥', '🚑', '🧪', '🦠'];

const PrescriptionForm = () => {
  const { uploadedFiles, setUploadedFiles } = useDashboard();
  const [chatMessage, setChatMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    setChatMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  }

  const handleChatFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // just simulating upload for chat
      alert(`Selected ${files.length} file(s) for chat: ${files.map(f => f.name).join(', ')}`);
    }
  }

  const handleFilesUploaded = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleGenerate = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload documents first');
      return;
    }
    alert(`Generating prescription with ${uploadedFiles.length} file(s)...`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">

      {/* ================= LEFT COLUMN: Add Report ================= */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="bg-rose-50/50 rounded-3xl p-8 flex flex-col items-center text-center h-full border border-rose-100/50 relative overflow-y-auto custom-scrollbar">

          {/* Brain/AI Icon */}
          <div className="mb-6">
            <span className="text-4xl">🧠</span>
            {/* You can replace this with an actual image/icon if available */}
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Add Report & Get AI
          </h3>

          <p className="text-gray-500 mb-8 max-w-sm">
            Upload reports or sync from Medilocker and let AI create a suggested
          </p>

          <div className="space-y-2 mb-8 text-left">
            <div className="font-semibold text-gray-700">Auto-analysis of past history</div>
            <div className="font-semibold text-gray-700">AI-generated medicine + test</div>
            <div className="font-semibold text-gray-700">instant risk scoring</div>
          </div>

          {/* Upload Area */}
          <div className="w-full max-w-md">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-rose-400 transition-colors cursor-pointer relative">
              <FileUploadZone
                onFilesUploaded={handleFilesUploaded}
                accept="image/*,.pdf"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                {uploadedFiles.length > 0 ? (
                  uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 bg-w hite p-3 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group shrink-0 z-20 pointer-events-auto">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 absolute left-2"></div>

                      {/* Preview / Icon */}
                      <div className="w-10 h-10 ml-3 rounded-lg border border-rose-200 flex items-center justify-center bg-rose-50 text-rose-500 shrink-0 overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>📄</span>
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-medium text-gray-800 text-sm truncate">{file.name}</div>
                        <div className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB - 100% Uploaded</div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove file"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="text-2xl text-gray-400">⬆️</div>
                    <div className="font-medium text-gray-600">Drag & Drop Here</div>
                    <div className="text-sm text-gray-400 underline">Browse</div>
                    <div className="text-xs text-gray-300 mt-1">just upload Document and generate precription</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 w-full max-w-md">
            <Button
              className="w-full bg-rose-300 hover:bg-rose-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-rose-200 transition-all border-none"
              onClick={handleGenerate}
            >
              Generate with AI
            </Button>
          </div>

        </div>
      </div>

      {/* ================= RIGHT COLUMN: Talk with DrBuddy ================= */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col relative w-full max-w-md mx-auto">
          {/* Header */}
          <div className="bg-rose-400 p-4 text-white">
            <h3 className="font-bold text-lg">DrBuddy</h3>
            <p className="text-sm opacity-90">Ask me anything</p>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6 bg-white flex flex-col gap-4 overflow-y-auto">
            {/* Bot Message */}
            <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-sm self-start max-w-[80%] text-sm font-medium shadow-sm">
              Hey ! How can I help you ?
            </div>

            {/* Spacer to push content down if needed, or just empty space */}
            <div className="flex-1"></div>

            {/* Suggestion Chip */}
            <div className="self-end">
              <button className="bg-rose-400 text-white text-xs py-2 px-4 rounded-full hover:bg-rose-500 transition-colors shadow-sm">
                Help me with this Patient
              </button>
            </div>

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-4 left-4 right-4 bg-white border border-gray-200 shadow-xl rounded-xl p-3 z-20 grid grid-cols-8 gap-2 animate-in slide-in-from-bottom-2">
                {EMOJI_LIST.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-xl hover:bg-rose-50 rounded p-1 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="col-span-8 text-xs text-rose-500 mt-2 font-medium hover:underline"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              {/* <span>...</span> */}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="type and press[enter]"
                className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <div className="flex items-center gap-3 text-gray-400">
                {/* Emoji Trigger */}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`hover:text-rose-400 transition-colors ${showEmojiPicker ? 'text-rose-500' : ''}`}
                  title="Add Emoji"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </button>

                {/* Attachment Trigger (Paperclip) */}
                <button
                  onClick={handleCameraClick}
                  className="hover:text-rose-400 transition-colors transform rotate-45"
                  title="Attach File"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                </button>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleChatFileUpload}
                />

                <button className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200 transition-transform active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PrescriptionForm;

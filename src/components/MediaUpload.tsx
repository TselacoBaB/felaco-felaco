import React, { useRef } from "react";

interface MediaUploadProps {
  onUpload: (file: File) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <>
      <button
        type="button"
        className="bg-gray-100 rounded-full p-2 hover:bg-gray-200"
        onClick={() => fileInputRef.current?.click()}
        title="Attach image or video"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
};

export default MediaUpload;

import React, { useState } from 'react';

const PhotoUpload = ({ onPhotoSelect }) => {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      onPhotoSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Candidate Photo
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-testio-blue bg-blue-50'
            : 'border-gray-300 hover:border-testio-teal'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
      >
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-testio-teal"
            />
            <button
              type="button"
              onClick={() => { setPreview(null); onPhotoSelect(null); }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove Photo
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl text-gray-400">📷</div>
            <div className="text-gray-600">
              <p>Drop a photo here or click to select</p>
              <p className="text-xs text-gray-500">JPEG, PNG up to 5MB</p>
            </div>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={!preview}
        />
      </div>
    </div>
  );
};

export default PhotoUpload;
import React, { useState } from 'react';
import { authFetch } from '../../utils/authFetch';
import { SUPPORTED_AUDIO_CATEGORIES } from "../../../config/constants";


const AudioUploader = ({ refreshFiles }: { refreshFiles: () => Promise<void> }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput('');
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const filteredTags = SUPPORTED_AUDIO_CATEGORIES.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setUploading(true);
    try {
      // Get presigned URL
      const { presignedUrl, key } = await authFetch('/audio_files/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: uploadedFile.name,
          fileType: uploadedFile.type
        })
      });

      // Upload file to S3
      await fetch(presignedUrl, {
        method: 'PUT',
        body: uploadedFile,
        headers: {
          'Content-Type': uploadedFile.type
        }
      });

      // Create audio file record
      await authFetch('/audio_files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          key,
          tags: selectedTags
        })
      });

      setUploadedFile(null);
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      refreshFiles();
      alert('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  if (uploadedFile) {
    return <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{uploadedFile.name}</h3>
          <button
            onClick={() => setUploadedFile(null)}
            className="text-sm text-rose-700 hover:text-rose-900"
          >
            Remove
          </button>
        </div>

        <audio
          controls
          className="w-full"
          src={uploadedFile ? URL.createObjectURL(uploadedFile) : ''}
        />

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            maxLength={20}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter description"
          />
        </div>

        {/* Tags Input */}
        <div className="relative">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="mt-1 flex flex-wrap gap-2 p-2 border rounded-md">
            {selectedTags.map(tag => (
              <span 
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 inline-flex text-indigo-400 hover:text-indigo-600"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowTagDropdown(true);
              }}
              onFocus={() => setShowTagDropdown(true)}
              className="border-0 outline-none flex-grow min-w-[100px]"
              placeholder="Add tags..."
            />
          </div>
          
          {showTagDropdown && (tagInput || filteredTags.length > 0) && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border">
              <div className="flex justify-between items-center px-3 py-2 border-b">
                <span className="text-sm text-gray-600">Available Tags</span>
                <button
                  onClick={() => setShowTagDropdown(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <ul className="max-h-60 overflow-auto py-1">
                {filteredTags.map(tag => (
                  <li
                    key={tag}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  }

  return (
    <div
    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
    onDragOver={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    onDrop={(e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        setUploadedFile(files[0]);
      }
    }}
  >
    <div className="space-y-2">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none" 
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round" 
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
      <div className="text-gray-600">
        <label htmlFor="file-upload" className="relative cursor-pointer">
          <span className="text-indigo-500 hover:text-indigo-600">Upload a file</span>
          <input 
            id="file-upload" 
            name="file-upload" 
            type="file"
            accept="audio/*"
            className="sr-only"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('audio/')) {
                  setUploadedFile(file);
                } else {
                  alert('Please select an audio file');
                }
              }
            }}
          />
        </label>
        <p className="pl-1">or drag and drop</p>
      </div>
      <p className="text-xs text-gray-500">Audio files only</p>
    </div>
  </div>
  );
};

export default AudioUploader;

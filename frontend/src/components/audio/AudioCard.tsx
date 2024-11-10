import { AudioFile } from "../../types/audio";
import { useState } from "react";
import { authFetch } from "../../utils/authFetch";
import { SUPPORTED_AUDIO_CATEGORIES } from "../../../config/constants";

interface AudioCardProps {
  file: AudioFile;
  playing: string | null;
  onPlay: (audioFile: AudioFile) => void;
  onDelete: (audioFileId: string) => void;
}

const AudioCard = ({ file, playing, onPlay, onDelete }: AudioCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(file.title);
  const [editDescription, setEditDescription] = useState(file.description);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(file.metadata.tags);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [localFile, setLocalFile] = useState(file);

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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(file.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await authFetch(`/audio_files/${file.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          tags: selectedTags
        })
      });

      setLocalFile({
        ...localFile,
        title: editTitle,
        description: editDescription,
        metadata: {
          ...localFile.metadata,
          tags: selectedTags
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating audio file:', error);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setEditTitle(localFile.title);
    setEditDescription(localFile.description);
    setSelectedTags(localFile.metadata.tags);
    setTagInput('');
    setIsEditing(false);
  };

  return (
    <div 
      className="bg-white rounded-xl border border-slate-200 p-6 h-auto flex flex-col relative"
    >
      <div className="flex flex-col gap-4 flex-1">
        <div className="text-xs text-gray-500">
          {new Date(localFile.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-start justify-between flex-nowrap">
          <div className="flex-1 overflow-visible">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-2 py-1 text-md border rounded"
                  placeholder="Title"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded"
                  rows={2}
                  placeholder="Description"
                />
                <div className="relative">
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
                    <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border">
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
              </div>
            ) : (
              <>
                <h3 className="text-md font-medium text-gray-900 truncate">
                  {localFile.title}
                </h3>
                <p className="text-sm font-medium text-gray-400 line-clamp-2">
                  {localFile.description}
                </p>
              </>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {localFile.metadata.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onPlay(localFile)}
            className={`
              flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
              ${playing === localFile.id 
                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'}
              transition-colors duration-200
            `}
          >
            {playing === localFile.id ? '❚❚' : '▶'}
          </button>
        </div>
      </div>

      <div className="flex justify-start gap-2 mt-auto pt-4">
        {showDeleteConfirm ? (
          <div className="flex gap-2">
            <button
              onClick={confirmDelete}
              className="px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Confirm
            </button>
            <button
              onClick={cancelDelete}
              className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleDelete}
              className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
            >
              Delete
            </button>
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AudioCard;
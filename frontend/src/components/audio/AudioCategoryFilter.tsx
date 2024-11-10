import { useState } from 'react';
import { SUPPORTED_AUDIO_CATEGORIES } from '../../../config/constants';

interface AudioCategoryFilterProps {
  onCategoryChange: (categories: string[]) => void;
}

const AudioCategoryFilter = ({ onCategoryChange }: AudioCategoryFilterProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onCategoryChange(newCategories);
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {SUPPORTED_AUDIO_CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryToggle(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategories.includes(category)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AudioCategoryFilter;

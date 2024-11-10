import { useState, useEffect } from 'react';
import AudioUploader from '../components/audio/AudioUploader';
import Navbar from '../components/layout/Navbar';
import AudioList from '../components/audio/AudioList';
import { authFetch } from '../utils/authFetch';
import { AudioFile } from '../types/audio';
import AudioCategoryFilter from '../components/audio/AudioCategoryFilter';
import { SearchBar } from '../components/audio/AudioSearchBar';
import { Paginator } from '../components/shared/Paginator';

const FilesPage = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio] = useState(new Audio());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchAudioFiles(currentPage);
  }, [currentPage, debouncedSearchQuery, selectedCategories]);

  const fetchAudioFiles = async (page: number) => {
    try {
      setIsLoading(true);
      const categoriesParam = selectedCategories.length > 0 
        ? `&tags=${selectedCategories.join(',')}`
        : '';
      const response = await authFetch(
        `/audio_files?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearchQuery)}${categoriesParam}`
      );
      setAudioFiles(response.audioFiles);
      setTotalPages(response.pagination.totalPages);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async (audioFile: AudioFile) => {
    if (playing === audioFile.id) {
      audio.pause();
      setPlaying(null);
    } else {
      const { presignedUrl } = await authFetch(
        `/audio_files/${audioFile.id}/presigned-url`
      );
      audio.src = presignedUrl;
      await audio.play();
      setPlaying(audioFile.id);
    }
  };

  const handleDelete = async (audioFileId: string) => {
    await authFetch(`/audio_files/${audioFileId}`, {
      method: 'DELETE'
    });
    fetchAudioFiles(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-8 flex flex-col-reverse md:flex-row gap-4 px-4 md:px-0 pb-[50vh]">
        <div className="flex-grow">
          <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
          <AudioCategoryFilter onCategoryChange={handleCategoryChange} />
          {!isLoading && totalPages > 0 && (
            <Paginator
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          <AudioList 
            isLoading={isLoading}
            audioFiles={audioFiles}
            playing={playing}
            onPlay={handlePlay}
            onDelete={handleDelete}
          />
        </div>

        <div className="w-full md:min-w-72 md:max-w-72">
          <AudioUploader refreshFiles={()=>fetchAudioFiles(currentPage)} />
        </div>
      </div>
    </>
  );
};

export default FilesPage;

import { AudioFile } from '../../types/audio';
import AudioCard from './AudioCard';

interface AudioListProps {
  audioFiles: AudioFile[];
  playing: string | null;
  isLoading: boolean;
  onDelete: (audioFileId: string) => void;
  onPlay: (audioFile: AudioFile) => void;
}

const AudioList = ({ audioFiles, isLoading, playing, onPlay, onDelete }: AudioListProps) => {
  if (!isLoading && audioFiles.length === 0) {
    return <div>
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">Your uploaded audio files will display here</p>
      </div>
    </div>;
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {audioFiles.map((file) => (
          <AudioCard
            key={file.id}
            file={file}
            playing={playing}
            onPlay={onPlay}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioList;
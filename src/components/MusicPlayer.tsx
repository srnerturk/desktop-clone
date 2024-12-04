import { useState } from 'react';
import { FolderItem } from '@/types/folder';
import WindowControls from './WindowControls';

interface MusicPlayerProps {
  song: FolderItem;
  onClose: () => void;
}

const MusicPlayer = ({ song, onClose }: MusicPlayerProps) => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg shadow-lg w-[800px] overflow-hidden">
        <div className="bg-blue-600 text-white p-2 flex justify-between items-center">
          <span>{song.name}</span>
          <WindowControls
            isMaximized={isMaximized}
            onMinimize={() => {}}
            onMaximize={() => setIsMaximized(!isMaximized)}
            onClose={onClose}
          />
        </div>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`}
            title={song.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 
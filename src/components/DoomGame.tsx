import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import WindowControls from './WindowControls';

interface DoomGameProps {
  onClose: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
}

const DoomGame = ({ onClose, onMinimize }: DoomGameProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const x = (window.innerWidth - 800) / 2;
    const y = (window.innerHeight - 600) / 2;
    setPosition({ x, y });
  }, []);

  return (
    <Draggable
      disabled={isMaximized}
      handle=".window-header"
      position={isMaximized ? { x: 0, y: 0 } : position}
      onStop={(_, data) => !isMaximized && setPosition({ x: data.x, y: data.y })}
      bounds="parent"
    >
      <div
        className={`absolute bg-black rounded-lg shadow-lg overflow-hidden`}
        style={{
          width: isMaximized ? '100%' : 800,
          height: isMaximized ? '100%' : 600,
          ...(isMaximized ? { top: 0, left: 0 } : {}),
          zIndex: 1000,
        }}
      >
        <div className="window-header bg-[#2D2D2D] text-white p-2 flex justify-between items-center">
          <span>DOOM</span>
          <WindowControls
            isMaximized={isMaximized}
            onMinimize={onMinimize}
            onMaximize={() => setIsMaximized(!isMaximized)}
            onClose={onClose}
          />
        </div>

        <div className="aspect-video w-full h-[calc(100%-40px)]">
          <iframe
            src="https://js-dos.com/games/doom.exe.html"
            className="w-full h-full"
            title="DOOM"
            allowFullScreen
          />
        </div>
      </div>
    </Draggable>
  );
};

export default DoomGame; 
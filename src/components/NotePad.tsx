import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import WindowControls from './WindowControls';

interface NotePadProps {
  onClose: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
}

const DEFAULT_WINDOW_SIZE = {
  width: 600,
  height: 400
};

const NotePad = ({ onClose, isMinimized, onMinimize }: NotePadProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [content, setContent] = useState('');

  useEffect(() => {
    const x = (window.innerWidth - DEFAULT_WINDOW_SIZE.width) / 2;
    const y = (window.innerHeight - DEFAULT_WINDOW_SIZE.height) / 2;
    setPosition({ x, y });
  }, []);

  if (isMinimized) return null;

  return (
    <Draggable
      disabled={isMaximized}
      handle=".window-header"
      position={isMaximized ? { x: 0, y: 0 } : position}
      onStop={(e, data) => !isMaximized && setPosition({ x: data.x, y: data.y })}
      bounds="parent"
    >
      <div
        className={`absolute bg-white rounded-lg shadow-lg overflow-hidden`}
        style={{
          width: isMaximized ? '100%' : DEFAULT_WINDOW_SIZE.width,
          height: isMaximized ? '100%' : DEFAULT_WINDOW_SIZE.height,
          ...(isMaximized ? { top: 0, left: 0 } : {}),
          zIndex: 1000,
        }}
      >
        <div className="window-header bg-[#2D2D2D] text-white p-2 flex justify-between items-center">
          <span>Not Defteri</span>
          <WindowControls
            isMaximized={isMaximized}
            onMinimize={onMinimize}
            onMaximize={() => setIsMaximized(!isMaximized)}
            onClose={onClose}
          />
        </div>

        <div className="p-2 flex flex-col h-[calc(100%-40px)]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none p-2 outline-none font-mono text-sm"
            placeholder="Buraya yazın..."
          />
        </div>
      </div>
    </Draggable>
  );
};

export default NotePad; 
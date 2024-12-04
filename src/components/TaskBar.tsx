import { useState, useEffect } from 'react';
import StartMenu from './StartMenu';
import Calendar from './Calendar';

interface TaskBarProps {
  openWindows: {
    id: string;
    title: string;
    isMinimized: boolean;
  }[];
  onWindowClick: (id: string) => void;
}

const TaskBar = ({ openWindows, onWindowClick }: TaskBarProps) => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-[#202020] flex items-center px-2 z-50">
      <button
        onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        className={`flex items-center px-4 h-8 rounded hover:bg-white/10 transition-colors
          ${isStartMenuOpen ? 'bg-white/20' : ''}`}
      >
        <img src="/windows.svg" alt="Start" className="w-4 h-4 mr-2" />
        <span className="text-white text-sm">Start</span>
      </button>

      {/* Açık Pencereler */}
      <div className="flex-1 flex items-center px-2 gap-1">
        {openWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => onWindowClick(window.id)}
            className={`h-8 px-3 flex items-center text-white text-sm hover:bg-white/10 rounded
              ${window.isMinimized ? 'opacity-50' : 'bg-white/20'}`}
          >
            {window.title}
          </button>
        ))}
      </div>

      <button
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="text-white text-sm px-3 hover:bg-white/10 h-full flex items-center"
      >
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </button>

      {isStartMenuOpen && <StartMenu onClose={() => setIsStartMenuOpen(false)} />}
      {isCalendarOpen && (
        <Calendar 
          onClose={() => setIsCalendarOpen(false)}
          initialPosition={{ 
            x: window.innerWidth - 320, 
            y: window.innerHeight - 450 
          }}
        />
      )}
    </div>
  );
};

export default TaskBar; 
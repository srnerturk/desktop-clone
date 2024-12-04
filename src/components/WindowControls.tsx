import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMinimize, faWindowMaximize, faWindowRestore, faXmark } from '@fortawesome/free-solid-svg-icons';

interface WindowControlsProps {
  isMaximized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

const WindowControls = ({ isMaximized, onMinimize, onMaximize, onClose }: WindowControlsProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onMinimize}
        className="px-2 hover:bg-white/10 rounded"
      >
        <FontAwesomeIcon icon={faWindowMinimize} className="text-sm" />
      </button>
      <button
        onClick={onMaximize}
        className="px-2 hover:bg-white/10 rounded"
      >
        <FontAwesomeIcon 
          icon={isMaximized ? faWindowRestore : faWindowMaximize} 
          className="text-sm" 
        />
      </button>
      <button
        onClick={onClose}
        className="px-2 hover:bg-red-500 rounded"
      >
        <FontAwesomeIcon icon={faXmark} className="text-sm" />
      </button>
    </div>
  );
};

export default WindowControls; 
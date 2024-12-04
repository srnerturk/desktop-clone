import { useState } from 'react';
import Draggable from 'react-draggable';

interface DesktopIconProps {
  icon: string;
  label: string;
  onClick: () => void;
  initialPosition: { x: number; y: number };
  isSelected: boolean;
  onSelect: () => void;
}

const DesktopIcon = ({ 
  icon, 
  label, 
  onClick, 
  initialPosition,
  isSelected,
  onSelect 
}: DesktopIconProps) => {
  const [position, setPosition] = useState(initialPosition);

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect();
  };

  return (
    <Draggable
      position={position}
      onStop={handleDragStop}
      bounds="parent"
      grid={[36, 36]}
    >
      <div 
        className={`desktop-icon ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{ position: 'absolute' }}
      >
        <img src={icon} alt={label} draggable="false" />
        <span>{label}</span>
      </div>
    </Draggable>
  );
};

export default DesktopIcon; 
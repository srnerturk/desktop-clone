import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh?: () => void;
  onChangeWallpaper?: () => void;
}

const ContextMenu = ({ x, y, onClose, onRefresh, onChangeWallpaper }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white shadow-lg rounded-md py-1 w-64 z-[1000]"
      style={{
        left: x,
        top: y,
      }}
    >
      <MenuItem onClick={onRefresh} icon={faArrowsRotate}>Yenile</MenuItem>
      <div className="border-t border-gray-200 my-1" />
      <MenuItem onClick={onChangeWallpaper} icon={faImage}>Duvar Kağıdını Değiştir</MenuItem>
      <div className="border-t border-gray-200 my-1" />
      <MenuItem icon="⚙️">Görünüm</MenuItem>
      <MenuItem icon="⚡">Özellikler</MenuItem>
    </div>
  );
};

interface MenuItemProps {
  children: React.ReactNode;
  icon?: any;  // FontAwesome ikonu veya string olabilir
  onClick?: () => void;
}

const MenuItem = ({ children, icon, onClick }: MenuItemProps) => (
  <button
    onClick={onClick}
    className="w-full px-3 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white flex items-center"
  >
    {icon && (
      <span className="w-6 text-center mr-2">
        {typeof icon === 'string' ? icon : <FontAwesomeIcon icon={icon} />}
      </span>
    )}
    {children}
  </button>
);

export default ContextMenu; 
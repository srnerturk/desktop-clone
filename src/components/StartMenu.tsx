import { useEffect, useRef } from 'react';

interface StartMenuProps {
  onClose: () => void;
}

const StartMenu = ({ onClose }: StartMenuProps) => {
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
      className="absolute bottom-10 left-0 w-80 bg-[#202020] text-white rounded-t-lg shadow-lg overflow-hidden"
    >
      {/* Kullanıcı Profili */}
      <div className="p-4 border-b border-white/10 flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-lg">U</span>
        </div>
        <span className="ml-3">User</span>
      </div>

      {/* Menü Öğeleri */}
      <div className="py-2">
        <MenuItem icon="⚙️" label="Ayarlar" />
        <MenuItem icon="❓" label="Yardım" />
        <div className="border-t border-white/10 my-2" />
        <MenuItem icon="⭕" label="Kapat" />
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label }: { icon: string; label: string }) => (
  <button className="w-full px-4 py-2 flex items-center hover:bg-white/10 transition-colors">
    <span className="w-6 text-center">{icon}</span>
    <span className="ml-3">{label}</span>
  </button>
);

export default StartMenu; 
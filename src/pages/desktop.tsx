import { useState, useCallback, useEffect } from 'react'
import DesktopIcon from '@/components/DesktopIcon'
import Folder from '@/components/Folder'
import TaskBar from '@/components/TaskBar'
import ContextMenu from '@/components/ContextMenu'
import Terminal from '@/components/Terminal'
import DoomGame from '@/components/DoomGame'
import NotePad from '@/components/NotePad'

import pc from '@/assets/icons/pc.webp'
import user from '@/assets/icons/user.webp'
import music from '@/assets/icons/music.webp'
import terminal from '@/assets/icons/xterm.webp'
import doom from '@/assets/icons/doom.webp'
import notepad from '@/assets/icons/notepad.webp'
import { ACTIVE_CONTENTS, createNewFolder } from '@/data/folderContents'

interface FolderWindow {
  id: string;
  title: string;
  isOpen: boolean;
}

interface IconPosition {
  x: number;
  y: number;
}

interface ContextMenuPosition {
  x: number;
  y: number;
}

const INITIAL_POSITIONS: { [key: string]: IconPosition } = {
  computer: { x: 0, y: 0 },
  documents: { x: 0, y: 72 },
  terminal: { x: 0, y: 144 },
  doom: { x: 0, y: 216 },
  notepad: { x: 0, y: 288 }
};

const WALLPAPERS = [
  'https://cdn.wallpaperhub.app/cloudcache/9/8/1/e/8/e/981e8e91f90c93bf5e715527e1922724645f1214.jpg',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e',
  'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
];

const Desktop = () => {
  const [openFolders, setOpenFolders] = useState<(FolderWindow & { isMinimized: boolean })[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [isDoomOpen, setIsDoomOpen] = useState(false);
  const [isDoomMinimized, setIsDoomMinimized] = useState(false);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [isNotepadMinimized, setIsNotepadMinimized] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  const handleOpenFolder = (title: string, id: string) => {
    if (!ACTIVE_CONTENTS[id]) {
      ACTIVE_CONTENTS[id] = {
        id,
        title,
        items: []
      };
    }

    const newFolder = {
      id,
      title,
      isOpen: true,
      isMinimized: false
    };
    setOpenFolders([...openFolders, newFolder]);
  };

  const handleCloseFolder = (id: string) => {
    setOpenFolders(openFolders.filter(folder => folder.id !== id));
  };

  // Masaüstü boş alanına tıklandığında seçimi kaldır
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
    }
  };

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleNewFolder = useCallback(() => {
    const newFolder = createNewFolder('desktop');
    if (newFolder) {
      handleOpenFolder(newFolder.name, newFolder.id);
    }
    handleCloseContextMenu();
  }, []);

  const handleRefresh = useCallback(() => {
    // Yenileme işlemleri burada yapılabilir
    handleCloseContextMenu();
  }, []);

  const handleWindowClick = (id: string) => {
    // Klasörler için
    const folder = openFolders.find(f => f.id === id);
    if (folder) {
      setOpenFolders(openFolders.map(f => 
        f.id === id ? { ...f, isMinimized: !f.isMinimized } : f
      ));
      return;
    }

    // Terminal için
    if (id === 'terminal') {
      setIsTerminalMinimized(!isTerminalMinimized);
      return;
    }

    // Doom için
    if (id === 'doom') {
      setIsDoomMinimized(!isDoomMinimized);
    }

    // Not defteri için
    if (id === 'notepad') {
      setIsNotepadMinimized(!isNotepadMinimized);
    }
  };

  const getOpenWindows = () => {
    const windows = [
      ...openFolders.map(f => ({ id: f.id, title: f.title, isMinimized: f.isMinimized })),
    ];

    if (isTerminalOpen) {
      windows.push({ id: 'terminal', title: 'Terminal', isMinimized: isTerminalMinimized });
    }

    if (isDoomOpen) {
      windows.push({ id: 'doom', title: 'DOOM', isMinimized: isDoomMinimized });
    }

    if (isNotepadOpen) {
      windows.push({ id: 'notepad', title: 'Not Defteri', isMinimized: isNotepadMinimized });
    }

    return windows;
  };

  const handleChangeWallpaper = useCallback(() => {
    setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length);
    handleCloseContextMenu();
  }, []);

  useEffect(() => {
    const handleFolderOpen = (e: CustomEvent<{ title: string; id: string }>) => {
      handleOpenFolder(e.detail.title, e.detail.id);
    };

    window.addEventListener('openFolder', handleFolderOpen as EventListener);
    return () => {
      window.removeEventListener('openFolder', handleFolderOpen as EventListener);
    };
  }, []);

  return (
    <>
      <div 
        className="fixed inset-0 overflow-hidden" 
        onClick={handleDesktopClick}
        onContextMenu={handleContextMenu}
        style={{
          backgroundImage: `url(${WALLPAPERS[wallpaperIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* İkonlar için konteyner */}
        <div className="absolute inset-0 pb-10 p-4">
          <DesktopIcon
            icon={pc}
            label="Bilgisayarım"
            onClick={() => handleOpenFolder("Bilgisayarım", "computer")}
            initialPosition={INITIAL_POSITIONS.computer}
            isSelected={selectedIcon === "computer"}
            onSelect={() => setSelectedIcon("computer")}
          />
          <DesktopIcon
            icon={user}
            label="Belgelerim"
            onClick={() => handleOpenFolder("Belgelerim", "documents")}
            initialPosition={INITIAL_POSITIONS.documents}
            isSelected={selectedIcon === "documents"}
            onSelect={() => setSelectedIcon("documents")}
          />
          <DesktopIcon
            icon={terminal}
            label="Terminal"
            onClick={() => setIsTerminalOpen(true)}
            initialPosition={INITIAL_POSITIONS.terminal}
            isSelected={selectedIcon === "terminal"}
            onSelect={() => setSelectedIcon("terminal")}
          />
          <DesktopIcon
            icon={doom}
            label="DOOM"
            onClick={() => setIsDoomOpen(true)}
            initialPosition={INITIAL_POSITIONS.doom}
            isSelected={selectedIcon === "doom"}
            onSelect={() => setSelectedIcon("doom")}
          />
          <DesktopIcon
            icon={notepad}
            label="Not Defteri"
            onClick={() => setIsNotepadOpen(true)}
            initialPosition={INITIAL_POSITIONS.notepad}
            isSelected={selectedIcon === "notepad"}
            onSelect={() => setSelectedIcon("notepad")}
          />
        </div>

        {/* Açık Klasörler */}
        {openFolders.map((folder) => (
          <Folder
            key={folder.id}
            id={folder.id}
            title={folder.title}
            onClose={() => handleCloseFolder(folder.id)}
            isMinimized={folder.isMinimized}
            onMinimize={() => handleWindowClick(folder.id)}
          />
        ))}

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={handleCloseContextMenu}
            onRefresh={handleRefresh}
            onChangeWallpaper={handleChangeWallpaper}
          />
        )}

        {isTerminalOpen && (
          <Terminal 
            onClose={() => setIsTerminalOpen(false)}
            isMinimized={isTerminalMinimized}
            onMinimize={() => setIsTerminalMinimized(true)}
          />
        )}

        {isDoomOpen && (
          <DoomGame 
            onClose={() => setIsDoomOpen(false)}
            isMinimized={isDoomMinimized}
            onMinimize={() => setIsDoomMinimized(true)}
          />
        )}

        {isNotepadOpen && (
          <NotePad 
            onClose={() => setIsNotepadOpen(false)}
            isMinimized={isNotepadMinimized}
            onMinimize={() => setIsNotepadMinimized(true)}
          />
        )}
      </div>
      <TaskBar 
        openWindows={getOpenWindows()}
        onWindowClick={handleWindowClick}
      />
    </>
  );
};

export default Desktop;

import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { FolderItem } from '@/types/folder';
import { ACTIVE_CONTENTS, createNewFolder } from '@/data/folderContents';
import MusicPlayer from './MusicPlayer';
import WindowControls from './WindowControls';

interface FolderProps {
  id: string;
  title: string;
  onClose: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
}

const DEFAULT_WINDOW_SIZE = {
  width: 800,
  height: 500
};

interface NavigationHistory {
  id: string;
  title: string;
}

const Folder = ({ id: initialId, title: initialTitle, onClose, isMinimized, onMinimize }: FolderProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedMusic, setSelectedMusic] = useState<FolderItem | null>(null);
  const [history, setHistory] = useState<NavigationHistory[]>([{ id: initialId, title: initialTitle }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentFolder = history[currentIndex];
  const [folderContent, setFolderContent] = useState(ACTIVE_CONTENTS[currentFolder.id.toLowerCase()]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  console.log(folderContent);

  useEffect(() => {
    const x = (window.innerWidth - DEFAULT_WINDOW_SIZE.width) / 2;
    const y = (window.innerHeight - DEFAULT_WINDOW_SIZE.height) / 2;
    setPosition({ x, y });
  }, []);

  useEffect(() => {
    setFolderContent(ACTIVE_CONTENTS[currentFolder.id.toLowerCase()]);
  }, [currentFolder.id]);

  useEffect(() => {
    setEditingItemId(null);
    setEditingName('');
  }, [currentFolder.id]);

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const navigateToFolder = (item: FolderItem) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push({ id: item.id, title: item.name });
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const handleItemDoubleClick = (item: FolderItem) => {
    if (item.type === 'music') {
      setSelectedMusic(item);
    } else if (item.type === 'folder') {
      navigateToFolder(item);
    }
  };

  // Yeni klasör oluşturma
  const handleNewFolder = () => {
    const newFolder = createNewFolder(currentFolder.id.toLowerCase());
    if (newFolder) {
      setFolderContent(ACTIVE_CONTENTS[currentFolder.id.toLowerCase()]);
      setEditingItemId(newFolder.id);
      setEditingName(newFolder.name);
    }
  };

  // İsim değiştirme işlemi
  const handleNameChange = (itemId: string, newName: string, shouldFinishEditing: boolean = false) => {
    const item = folderContent.items.find(i => i.id === itemId);
    if (item) {
      if (shouldFinishEditing && newName.trim()) {
        item.name = newName.trim();
        if (ACTIVE_CONTENTS[item.id]) {
          ACTIVE_CONTENTS[item.id].title = newName.trim();
        }
        setFolderContent({ ...folderContent });
        setEditingItemId(null);
      } else {
        setEditingName(newName);
      }
    }
  };

  if (isMinimized) return null;

  return (
    <>
      <Draggable 
        disabled={isMaximized} 
        handle=".window-header"
        position={isMaximized ? { x: 0, y: 0 } : position}
        onStop={(_, data) => !isMaximized && setPosition({ x: data.x, y: data.y })}
        bounds="parent"
      >
        <div
          className={`absolute bg-white rounded-lg shadow-lg overflow-hidden`}
          style={{ 
            zIndex: 1000,
            width: isMaximized ? '100%' : DEFAULT_WINDOW_SIZE.width,
            height: isMaximized ? '100%' : DEFAULT_WINDOW_SIZE.height,
            ...(isMaximized ? { top: 0, left: 0 } : {})
          }}
        >
          <div className="window-header bg-blue-600 text-white p-2 flex justify-between items-center">
            <span>{currentFolder.title}</span>
            <WindowControls
              isMaximized={isMaximized}
              onMinimize={onMinimize}
              onMaximize={() => setIsMaximized(!isMaximized)}
              onClose={onClose}
            />
          </div>

          <div className="flex flex-col h-[calc(100%-2.5rem)]">
            {/* Toolbar */}
            <div className="bg-gray-100 border-b p-2 flex items-center gap-2">
              <button 
                className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                onClick={handleBack}
                disabled={currentIndex === 0}
              >
                <span className="text-lg">⬅️</span>
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                onClick={handleForward}
                disabled={currentIndex === history.length - 1}
              >
                <span className="text-lg">➡️</span>
              </button>
              <div className="h-4 border-l border-gray-300 mx-1" />
              <button
                onClick={handleNewFolder}
                className="px-2 py-1 hover:bg-gray-200 rounded flex items-center gap-1"
              >
                <span className="text-sm">📁</span>
                <span className="text-sm">Yeni Klasör</span>
              </button>
              <span className="text-sm text-gray-600">📂 {currentFolder.title}</span>
            </div>

            {/* Content */}
            <div className="flex-1 p-2 overflow-auto">
              {folderContent ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="p-2">Ad</th>
                      <th className="p-2">Boyut</th>
                      <th className="p-2">Değiştirilme Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {folderContent.items.map((item) => (
                      <FolderItemRow 
                        key={item.id} 
                        item={item}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        isEditing={editingItemId === item.id}
                        editingName={editingName}
                        onNameChange={(newName, shouldFinishEditing) => handleNameChange(item.id, newName, shouldFinishEditing)}
                        onStartEdit={() => {
                          setEditingItemId(item.id);
                          setEditingName(item.name);
                        }}
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4">Bu klasör boş</div>
              )}
            </div>
          </div>
        </div>
      </Draggable>
      {selectedMusic && (
        <MusicPlayer 
          song={selectedMusic} 
          onClose={() => setSelectedMusic(null)} 
        />
      )}
    </>
  );
};

const FolderItemRow = ({ 
  item, 
  onDoubleClick,
  isEditing,
  editingName,
  onNameChange,
  onStartEdit
}: { 
  item: FolderItem;
  onDoubleClick: () => void;
  isEditing: boolean;
  editingName: string;
  onNameChange: (newName: string, shouldFinishEditing?: boolean) => void;
  onStartEdit: () => void;
}) => (
  <tr 
    className="hover:bg-blue-50 cursor-pointer"
    onDoubleClick={isEditing ? undefined : onDoubleClick}
  >
    <td className="p-2 flex items-center">
      <img src={item.icon} alt={item.name} className="w-5 h-5 mr-2" />
      {isEditing ? (
        <input
          type="text"
          value={editingName}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={() => onNameChange(editingName, true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onNameChange(editingName, true);
            } else if (e.key === 'Escape') {
              onStartEdit();
            }
          }}
          className="bg-white border px-1 outline-none"
          autoFocus
        />
      ) : (
        <span onDoubleClick={onStartEdit}>{item.name}</span>
      )}
    </td>
    <td className="p-2">{item.size || '--'}</td>
    <td className="p-2">{item.modifiedDate}</td>
  </tr>
);

export default Folder; 
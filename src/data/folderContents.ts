import { FolderContent, FolderItem } from '@/types/folder';
import driveC from '@/assets/icons/folder.webp';
import driveD from '@/assets/icons/folder.webp';
import downloads from '@/assets/icons/folder.webp';
import pictures from '@/assets/icons/folder.webp';
import music from '@/assets/icons/audio.webp';
import folder from '@/assets/icons/folder.webp';

export const DEFAULT_CONTENTS: { [key: string]: FolderContent } = {
  desktop: {
    id: 'desktop',
    title: 'Masaüstü',
    items: []
  },
  computer: {
    id: 'computer',
    title: 'Bilgisayarim',
    items: [
      {
        id: 'c-drive',
        name: 'Windows (C:)',
        type: 'folder',
        icon: driveC,
        size: '237 GB',
        modifiedDate: '03.04.2024'
      },
      {
        id: 'd-drive',
        name: 'Veri (D:)',
        type: 'folder',
        icon: driveD,
        size: '455 GB',
        modifiedDate: '03.04.2024'
      }
    ]
  },
  documents: {
    id: 'documents',
    title: 'Belgelerim',
    items: [
      {
        id: 'downloads',
        name: 'İndirilenler',
        type: 'folder',
        icon: downloads,
        modifiedDate: '03.04.2024'
      },
      {
        id: 'resimlerim',
        name: 'Resimlerim',
        type: 'folder',
        icon: pictures,
        modifiedDate: '03.04.2024'
      },
      {
        id: 'music',
        name: 'Müziklerim',
        type: 'folder',
        icon: music,
        modifiedDate: '03.04.2024'
      }
    ]
  },
  music: {
    id: 'music',
    title: 'Müziklerim',
    items: [
      {
        id: 'song-1',
        name: 'Metallica - Nothing Else Matters',
        type: 'music',
        icon: music,
        artist: 'Metallica',
        youtubeId: 'tAGnKpE4NCI',
        modifiedDate: '03.04.2024'
      },
      {
        id: 'song-2',
        name: 'Queen - Bohemian Rhapsody',
        type: 'music',
        icon: music,
        artist: 'Queen',
        youtubeId: 'fJ9rUzIMcZQ',
        modifiedDate: '03.04.2024'
      },
      {
        id: 'song-3',
        name: 'The Beatles - Hey Jude',
        type: 'music',
        icon: music,
        artist: 'The Beatles',
        youtubeId: 'A_MjCqQoLLA',
        modifiedDate: '03.04.2024'
      }
    ]
  }
};

export let ACTIVE_CONTENTS: { [key: string]: FolderContent } = {
  ...DEFAULT_CONTENTS
};

export const createNewFolder = (parentId: string): FolderItem => {
  const parentContent = ACTIVE_CONTENTS[parentId] || ACTIVE_CONTENTS.desktop;

  let baseName = "Yeni Klasör";
  let counter = 1;
  let newName = baseName;

  while (parentContent.items.some(item => item.name === newName)) {
    counter++;
    newName = `${baseName} (${counter})`;
  }

  const newFolder: FolderItem = {
    id: `folder-${Date.now()}`,
    name: newName,
    type: 'folder',
    icon: folder,
    modifiedDate: new Date().toLocaleDateString()
  };

  parentContent.items.push(newFolder);

  ACTIVE_CONTENTS[newFolder.id] = {
    id: newFolder.id,
    title: newFolder.name,
    items: []
  };

  return newFolder;
}; 
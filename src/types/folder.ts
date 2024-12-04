export interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'drive' | 'file' | 'music';
  icon: string;
  size?: string;
  modifiedDate?: string;
  youtubeId?: string;
  artist?: string;
}

export interface FolderContent {
  id: string;
  title: string;
  items: FolderItem[];
} 
// @/components/Inbox/types/Message.ts

// Message interface
export interface Message {
  id: number;
  sender: string;
  project: string;
  content: string;
  // **** CHANGE: Use Date object ****
  timestamp: Date; // Changed from time: string
  hasAttachment: boolean;
  read: boolean;
  online: boolean;
  isStarred?: boolean;
  status?: 'inbox' | 'sent' | 'draft' | 'trash' | string;
  category?: string;
}

// Category interface
export interface Category {
  name: string;
  count: number; // This might need to be calculated dynamically later
  color: string;
}

// Chat interface
export interface Chat {
  id: number;
  name: string;
  online: boolean;
  unreadCount?: number;
}
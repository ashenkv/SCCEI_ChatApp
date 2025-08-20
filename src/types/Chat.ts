export interface Message {
  id: string;
  content: string;
  sender: 'teacher' | 'student';
  timestamp: Date;
  isRead: boolean;
}

export interface Student {
  id: string;
  name: string;
  messages: Message[];
  lastMessage?: Message;
  createdAt: Date;
}
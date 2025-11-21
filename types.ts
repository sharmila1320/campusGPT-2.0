export enum UserRole {
  GUEST = 'guest',
  MEMBER = 'member', // Students, Faculty with @institute.edu
  ADMIN = 'admin'
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
  suggestTicket?: boolean; // If true, UI shows "Raise Ticket" button
}

export enum PostVisibility {
  PUBLIC = 'public',
  INTERNAL = 'internal'
}

export interface Post {
  id: string;
  authorEmail: string;
  authorName: string;
  content: string;
  tags: string[]; // e.g., "Event", "Class", "News"
  visibility: PostVisibility;
  timestamp: number;
  likes: number;
}

export interface Ticket {
  id: string;
  question: string;
  status: 'open' | 'resolved';
  raisedByEmail: string;
  answers: Array<{
    authorEmail: string;
    content: string;
    timestamp: number;
  }>;
  timestamp: number;
}

export interface KnowledgeItem {
  id: string;
  content: string;
  keywords: string[];
  source: 'post' | 'ticket_resolution';
  visibility: PostVisibility;
}
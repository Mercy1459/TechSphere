export type PostStatus = 'published' | 'draft' | 'scheduled';

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  twitter?: string;
  linkedin?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Structured content with markdown-style headers, paragraphs, callouts, code blocks, tables
  category: string; // Matches Category name
  tags: string[];
  author: Author;
  featuredImage: string;
  imageCaption?: string;
  status: PostStatus;
  isFeatured: boolean;
  isTrending?: boolean;
  publishedAt: string;
  scheduledFor?: string;
  readingTime: number; // in minutes
  views: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export interface TableOfContentItem {
  id: string;
  text: string;
  level: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}

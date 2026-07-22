export type JournalCategory =
  | '具身認知'       // Embodied Cognition
  | '迷走神經'       // Vagus Nerve
  | '情緒韌性'       // Emotional Resilience
  | '腦科學';       // Neuroscience

export interface JournalAuthor {
  name: string;
  avatar?: string;
  bio?: string;
}

export interface JournalArticle {
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  category: JournalCategory;
  author: JournalAuthor;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number; // minutes
  featured?: boolean;
  tags?: string[];
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

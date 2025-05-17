// types.ts - Types partagés
export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'text' | 'drawing' | 'audio';
  url?: string;
  color?: string;
  tags?: string[];
}

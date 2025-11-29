import { LucideIcon } from 'lucide-react';

export interface Leader {
  id?: string;
  name: string;
  role: string;
  period: string;
  image?: string;
  note?: string;
  tmLevel?: string;
  order?: number;
}

export interface Program {
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'Kaderisasi' | 'Profesionalitas' | 'Lingkungan';
}

export interface SwotItem {
  category: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat';
  points: string[];
  color: string;
  hoverStyling: string; // New property for interactive hover effects
}

export interface StatItem {
  value: string;
  label: string;
  subtext: string;
}

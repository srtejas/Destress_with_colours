/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Design {
  id: string;
  name: string;
  svgPath: string;
  viewBox: string;
}

export const DESIGNS: Design[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    viewBox: '0 0 400 400',
    svgPath: ''
  },
  {
    id: 'mandala',
    name: 'Geometric Mandala',
    viewBox: '0 0 400 400',
    svgPath: `
      <circle cx="200" cy="200" r="180" fill="none" stroke="black" stroke-width="2" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="black" stroke-width="2" />
      <circle cx="200" cy="200" r="100" fill="none" stroke="black" stroke-width="2" />
      <circle cx="200" cy="200" r="60" fill="none" stroke="black" stroke-width="2" />
      <circle cx="200" cy="200" r="20" fill="none" stroke="black" stroke-width="2" />
      
      <line x1="200" y1="20" x2="200" y2="380" stroke="black" stroke-width="2" />
      <line x1="20" y1="200" x2="380" y2="200" stroke="black" stroke-width="2" />
      
      <line x1="72.7" y1="72.7" x2="327.3" y2="327.3" stroke="black" stroke-width="2" />
      <line x1="72.7" y1="327.3" x2="327.3" y2="72.7" stroke="black" stroke-width="2" />
      
      <path d="M200 20 L240 100 L320 100 L260 160 L280 240 L200 200 L120 240 L140 160 L80 100 L160 100 Z" fill="none" stroke="black" stroke-width="2" />
      <path d="M200 60 L220 140 L300 140 L240 190 L260 270 L200 220 L140 270 L160 190 L100 140 L180 140 Z" fill="none" stroke="black" stroke-width="1" />
    `
  },
  {
    id: 'nature',
    name: 'Flower Garden',
    viewBox: '0 0 400 400',
    svgPath: `
      <circle cx="100" cy="100" r="30" fill="none" stroke="black" stroke-width="2" />
      <path d="M100 70 Q130 30 160 70 T160 130 T100 170 T40 130 T40 70 T100 70" fill="none" stroke="black" stroke-width="2" />
      
      <circle cx="300" cy="250" r="40" fill="none" stroke="black" stroke-width="2" />
      <path d="M300 210 L340 170 L380 210 L340 250 L380 290 L340 330 L300 290 L260 330 L220 290 L260 250 L220 210 L260 170 Z" fill="none" stroke="black" stroke-width="2" />
      
      <path d="M0 350 Q200 300 400 350 L400 400 L0 400 Z" fill="none" stroke="black" stroke-width="2" />
      <path d="M100 170 L100 330" stroke="black" stroke-width="2" />
      <path d="M300 290 L300 340" stroke="black" stroke-width="2" />
    `
  },
  {
    id: 'ocean',
    name: 'Underwater Escape',
    viewBox: '0 0 400 400',
    svgPath: `
      <path d="M50 150 Q100 100 150 150 T250 150 T350 150" fill="none" stroke="black" stroke-width="2" />
      <circle cx="80" cy="100" r="10" fill="none" stroke="black" stroke-width="1" />
      <circle cx="120" cy="70" r="15" fill="none" stroke="black" stroke-width="1" />
      <path d="M300 100 L340 120 L300 140 Z" fill="none" stroke="black" stroke-width="2" />
      <ellipse cx="250" cy="120" rx="40" ry="20" fill="none" stroke="black" stroke-width="2" />
      <path d="M50 300 C 100 250, 300 350, 400 300" fill="none" stroke="black" stroke-width="2" />
      <rect x="200" y="320" width="20" height="60" fill="none" stroke="black" stroke-width="2" />
      <rect x="240" y="340" width="15" height="40" fill="none" stroke="black" stroke-width="2" />
    `
  },
  {
    id: 'abstract',
    name: 'Abstract Shapes',
    viewBox: '0 0 400 400',
    svgPath: `
      <rect x="50" y="50" width="100" height="100" fill="none" stroke="black" stroke-width="2" transform="rotate(15 100 100)" />
      <rect x="200" y="50" width="150" height="150" rx="20" fill="none" stroke="black" stroke-width="2" />
      <path d="M50 250 L150 250 L100 350 Z" fill="none" stroke="black" stroke-width="2" />
      <circle cx="275" cy="275" r="75" fill="none" stroke="black" stroke-width="2" />
      <circle cx="275" cy="275" r="40" fill="none" stroke="black" stroke-width="2" />
      <line x1="0" y1="0" x2="400" y2="400" stroke="black" stroke-width="2" />
      <line x1="400" y1="0" x2="0" y2="400" stroke="black" stroke-width="2" />
    `
  }
];

export interface AppColor {
  hex: string;
  name: string;
  meaning: string;
}

export const COLORS: AppColor[] = [
  { hex: '#FF595E', name: 'Coral Red', meaning: 'Energy, passion, and excitement.' },
  { hex: '#FFCA3A', name: 'Sunglow Yellow', meaning: 'Happiness, optimism, and creativity.' },
  { hex: '#8AC926', name: 'Yellow Green', meaning: 'Growth, harmony, and freshness.' },
  { hex: '#1982C4', name: 'Royal Blue', meaning: 'Tranquility, stability, and trust.' },
  { hex: '#6A4C93', name: 'Royal Purple', meaning: 'Wisdom, luxury, and spiritual awareness.' },
  { hex: '#FF924C', name: 'Deep Orange', meaning: 'Warmth, enthusiasm, and vitality.' },
  { hex: '#5CF4FF', name: 'Electric Cyan', meaning: 'Clarity, calm, and modern thinking.' },
  { hex: '#FF71CE', name: 'Neon Pink', meaning: 'Compassion, playfulness, and romance.' },
  { hex: '#000000', name: 'Deep Black', meaning: 'Power, elegance, and mystery.' },
  { hex: '#FFFFFF', name: 'Pure White', meaning: 'Peace, cleanliness, and simplicity.' },
  { hex: '#4ECDC4', name: 'Medium Turquoise', meaning: 'Renewal, energy, and balance.' },
  { hex: '#F1A7F1', name: 'Soft Lavender', meaning: 'Grace, calm, and femininity.' },
];

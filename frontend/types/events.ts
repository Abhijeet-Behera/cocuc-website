export interface Wing {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string; // Lucide icon name
  accentColor: string; // Hex or CSS color
  secondaryColor?: string;
  gradient: string;
  bgGlow: string;
  badge?: string;
  order: number;
}

export interface EventItem {
  id: string;
  title: string;
  wingId: string;
  wingName: string;
  description: string;
  wordCount: number;
  folderUrl: string;
  folderId: string;
  images: string[];
  coverImage?: string;
  eventDate?: string;
  location?: string;
  authorName?: string;
  createdAt: string;
  updatedAt?: string;
  isFeatured?: boolean;
}

export interface DriveImageFile {
  id: string;
  name: string;
  mimeType: string;
  directUrl: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  size?: number;
}

export interface FetchDriveImagesResponse {
  success: boolean;
  folderId: string;
  images: string[];
  files?: DriveImageFile[];
  count: number;
  message?: string;
  error?: string;
}

export interface EventsApiResponse {
  success: boolean;
  data: EventItem[];
  count: number;
  error?: string;
}

export interface CreateEventPayload {
  title: string;
  wingId: string;
  wingName?: string;
  description: string;
  folderUrl: string;
  folderId?: string;
  images?: string[];
  coverImage?: string;
  eventDate?: string;
  location?: string;
  authorName?: string;
}

// Pre-configured church wings representing the active ministries/wings
export const DEFAULT_WINGS: Wing[] = [
  {
    id: 'youth-wing',
    name: 'Youth Wing',
    slug: 'youth-wing',
    tagline: 'Empowering the next generation in faith, leadership, and purpose',
    description: 'The Youth Fellowship nurtures vibrant spiritual growth, discipleship, and community engagement for teenagers, university students, and young adults.',
    icon: 'Sparkles',
    accentColor: '#3b82f6', // Blue
    secondaryColor: '#60a5fa',
    gradient: 'from-blue-600 via-indigo-600 to-sky-500',
    bgGlow: 'rgba(59, 130, 246, 0.15)',
    badge: 'Active & Dynamic',
    order: 1,
  },
  {
    id: 'cultural-wing',
    name: 'Cultural Wing',
    slug: 'cultural-wing',
    tagline: 'Celebrating our heritage through gospel arts, drama, and festive fellowship',
    description: 'Organizes vibrant cultural festivals, musical pageants, Christmas and Easter dramas, and creative expressions of worship celebrating our rich heritage.',
    icon: 'Palette',
    accentColor: '#ec4899', // Pink
    secondaryColor: '#f472b6',
    gradient: 'from-pink-600 via-rose-500 to-purple-600',
    bgGlow: 'rgba(236, 72, 153, 0.15)',
    badge: 'Creative Arts',
    order: 2,
  },
  {
    id: 'sports-wing',
    name: 'Sports Wing',
    slug: 'sports-wing',
    tagline: 'Building fellowship, discipline, and healthy camaraderie through sports',
    description: 'Hosts inter-church tournaments, youth marathons, cricket leagues, badminton cups, and fitness initiatives that foster brotherhood and discipline.',
    icon: 'Trophy',
    accentColor: '#10b981', // Emerald
    secondaryColor: '#34d399',
    gradient: 'from-emerald-600 via-teal-500 to-green-500',
    bgGlow: 'rgba(16, 185, 129, 0.15)',
    badge: 'Fitness & Unity',
    order: 3,
  },
  {
    id: 'technical-wing',
    name: 'Technical Wing',
    slug: 'technical-wing',
    tagline: 'Powering multi-media broadcast, sound engineering, and digital outreach',
    description: 'Manages state-of-the-art live broadcasts, multi-camera sanctuary production, acoustic engineering, web infrastructure, and digital discipleship platforms.',
    icon: 'Cpu',
    accentColor: '#8b5cf6', // Violet
    secondaryColor: '#a78bfa',
    gradient: 'from-purple-600 via-violet-600 to-indigo-600',
    bgGlow: 'rgba(139, 92, 246, 0.15)',
    badge: 'Media & Tech',
    order: 4,
  },
  {
    id: 'women-wing',
    name: 'Women’s Wing',
    slug: 'women-wing',
    tagline: 'Fostering intercession, maternal leadership, and compassionate outreach',
    description: 'Dedicated to encouraging women through weekly cottage prayer, fasting fellowships, charitable aid, marriage mentorship, and community charity work.',
    icon: 'HeartHandshake',
    accentColor: '#f59e0b', // Amber / Rose gold
    secondaryColor: '#fbbf24',
    gradient: 'from-amber-500 via-orange-500 to-rose-400',
    bgGlow: 'rgba(245, 158, 11, 0.15)',
    badge: 'Fellowship & Care',
    order: 5,
  },
  {
    id: 'sunday-school-wing',
    name: 'Sunday School Wing',
    slug: 'sunday-school-wing',
    tagline: 'Nurturing young hearts with scripture, love, songs, and godly values',
    description: 'Guides children from toddler age to high school with biblical curriculum, annual Vacation Bible School (VBS), scripture recitation, and joy-filled crafts.',
    icon: 'BookOpen',
    accentColor: '#06b6d4', // Cyan
    secondaryColor: '#22d3ee',
    gradient: 'from-cyan-600 via-sky-500 to-blue-500',
    bgGlow: 'rgba(6, 182, 212, 0.15)',
    badge: 'Children & VBS',
    order: 6,
  },
  {
    id: 'social-outreach-wing',
    name: 'Social Outreach Wing',
    slug: 'social-outreach-wing',
    tagline: 'Serving underprivileged communities through medical camps and relief',
    description: 'Extends Christ’s compassion through free medical camps, food distribution drives, disaster relief, blood donation camps, and educational support.',
    icon: 'Globe',
    accentColor: '#ef4444', // Red
    secondaryColor: '#f87171',
    gradient: 'from-red-600 via-rose-600 to-amber-600',
    bgGlow: 'rgba(239, 68, 68, 0.15)',
    badge: 'Compassion Ministry',
    order: 7,
  },
  {
    id: 'worship-music-wing',
    name: 'Worship & Music Wing',
    slug: 'worship-music-wing',
    tagline: 'Leading the congregation in transformative praise and choral harmony',
    description: 'Encompasses the Church Choir, modern praise bands, orchestral ensembles, and acoustic worship teams ministering every Sunday and at special conventions.',
    icon: 'Music',
    accentColor: '#800000', // Church Burgundy
    secondaryColor: '#a31f1f',
    gradient: 'from-red-900 via-rose-900 to-red-800',
    bgGlow: 'rgba(128, 0, 0, 0.18)',
    badge: 'Choir & Praise Band',
    order: 8,
  }
];

import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getSkillCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Frontend': 'bg-blue-100 text-blue-800',
    'Backend': 'bg-green-100 text-green-800',
    'Database': 'bg-purple-100 text-purple-800',
    'Tools': 'bg-orange-100 text-orange-800',
    'frontend': 'bg-blue-100 text-blue-800',
    'backend': 'bg-green-100 text-green-800',
    'database': 'bg-purple-100 text-purple-800',
    'tools': 'bg-orange-100 text-orange-800'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
}

export function getProficiencyColor(level: string): string {
  const colors: Record<string, string> = {
    'Expert': 'bg-green-500',
    'Advanced': 'bg-blue-500',
    'Intermediate': 'bg-yellow-500',
    'Beginner': 'bg-gray-400',
    'expert': 'bg-green-500',
    'advanced': 'bg-blue-500',
    'intermediate': 'bg-yellow-500',
    'beginner': 'bg-gray-400'
  };
  
  return colors[level] || 'bg-gray-400';
}

export function generateStarRating(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
}

export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
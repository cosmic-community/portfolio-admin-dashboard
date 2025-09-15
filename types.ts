export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

export interface Profile extends CosmicObject {
  type: 'profile';
  metadata: {
    full_name?: string;
    professional_title?: string;
    hero_heading?: string;
    hero_subtext?: string;
    profile_photo?: {
      url: string;
      imgix_url: string;
    };
    about_me?: string;
    resume_file?: {
      url: string;
      name: string;
    };
  };
}

export interface Project extends CosmicObject {
  type: 'projects';
  metadata: {
    project_name?: string;
    short_description?: string;
    detailed_description?: string;
    screenshot?: {
      url: string;
      imgix_url: string;
    };
    tech_stack?: string[];
    live_demo_url?: string;
    github_url?: string;
    featured?: boolean;
    order?: number;
  };
}

export interface Skill extends CosmicObject {
  type: 'skills';
  metadata: {
    skill_name?: string;
    category?: {
      key: string;
      value: string;
    };
    proficiency_level?: {
      key: string;
      value: string;
    };
    icon?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface Service extends CosmicObject {
  type: 'services';
  metadata: {
    service_name?: string;
    description?: string;
    icon?: string;
    price_range?: string;
  };
}

export interface Testimonial extends CosmicObject {
  type: 'testimonials';
  metadata: {
    client_name?: string;
    client_title?: string;
    company?: string;
    testimonial_text?: string;
    rating?: number;
    client_photo?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface ContactInfo extends CosmicObject {
  type: 'contact-info';
  metadata: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    github_url?: string;
    twitter_url?: string;
    portfolio_url?: string;
  };
}

export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Dashboard specific types
export interface DashboardStats {
  totalProjects: number;
  featuredProjects: number;
  totalSkills: number;
  totalTestimonials: number;
  averageRating: number;
}

export interface ChartData {
  name: string;
  value: number;
}

// Form types
export interface ProjectFormData {
  project_name: string;
  short_description: string;
  detailed_description?: string;
  tech_stack: string[];
  live_demo_url?: string;
  github_url?: string;
  featured: boolean;
  order?: number;
}

// Skill categories
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'tools';
export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Type guards
export function isProject(obj: CosmicObject): obj is Project {
  return obj.type === 'projects';
}

export function isSkill(obj: CosmicObject): obj is Skill {
  return obj.type === 'skills';
}

export function isService(obj: CosmicObject): obj is Service {
  return obj.type === 'services';
}

export function isTestimonial(obj: CosmicObject): obj is Testimonial {
  return obj.type === 'testimonials';
}

export function isProfile(obj: CosmicObject): obj is Profile {
  return obj.type === 'profile';
}

export function isContactInfo(obj: CosmicObject): obj is ContactInfo {
  return obj.type === 'contact-info';
}
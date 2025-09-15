import { createBucketClient } from '@cosmicjs/sdk';
import { Project, Skill, Testimonial } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Dashboard API functions
export async function getDashboardStats() {
  try {
    const [projectsRes, skillsRes, testimonialsRes] = await Promise.all([
      cosmic.objects.find({ type: 'projects' }).props(['id', 'metadata.featured']),
      cosmic.objects.find({ type: 'skills' }).props(['id']),
      cosmic.objects.find({ type: 'testimonials' }).props(['id', 'metadata.rating'])
    ]);

    const projects = projectsRes.objects as Project[];
    const skills = skillsRes.objects as Skill[];
    const testimonials = testimonialsRes.objects as Testimonial[];

    const featuredProjects = projects.filter((p: Project) => p.metadata?.featured === true).length;
    const totalRating = testimonials.reduce((sum: number, t: Testimonial) => sum + (t.metadata?.rating || 0), 0);
    const averageRating = testimonials.length > 0 ? totalRating / testimonials.length : 0;

    return {
      totalProjects: projects.length,
      featuredProjects,
      totalSkills: skills.length,
      totalTestimonials: testimonials.length,
      averageRating: Math.round(averageRating * 10) / 10
    };
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return {
        totalProjects: 0,
        featuredProjects: 0,
        totalSkills: 0,
        totalTestimonials: 0,
        averageRating: 0
      };
    }
    throw new Error('Failed to fetch dashboard stats');
  }
}

export async function getAllProjects() {
  try {
    const response = await cosmic.objects
      .find({ type: 'projects' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const projects = response.objects as Project[];
    return projects.sort((a: Project, b: Project) => {
      const orderA = a.metadata?.order || 0;
      const orderB = b.metadata?.order || 0;
      return orderA - orderB;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch projects');
  }
}

export async function getAllSkills() {
  try {
    const response = await cosmic.objects
      .find({ type: 'skills' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch skills');
  }
}

export async function getAllServices() {
  try {
    const response = await cosmic.objects
      .find({ type: 'services' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch services');
  }
}

export async function getAllTestimonials() {
  try {
    const response = await cosmic.objects
      .find({ type: 'testimonials' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch testimonials');
  }
}

export async function getProfile() {
  try {
    const response = await cosmic.objects
      .find({ type: 'profile' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects[0] || null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch profile');
  }
}

export async function getContactInfo() {
  try {
    const response = await cosmic.objects
      .find({ type: 'contact-info' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects[0] || null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch contact info');
  }
}

// CRUD Operations
export async function updateProject(id: string, updates: Record<string, any>) {
  try {
    await cosmic.objects.updateOne(id, {
      metadata: updates
    });
    return { success: true };
  } catch (error) {
    throw new Error('Failed to update project');
  }
}

export async function deleteProject(id: string) {
  try {
    await cosmic.objects.deleteOne(id);
    return { success: true };
  } catch (error) {
    throw new Error('Failed to delete project');
  }
}

export async function createProject(projectData: Record<string, any>) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'projects',
      title: projectData.project_name || 'New Project',
      metadata: projectData
    });
    return response.object;
  } catch (error) {
    throw new Error('Failed to create project');
  }
}

export async function updateSkill(id: string, updates: Record<string, any>) {
  try {
    await cosmic.objects.updateOne(id, {
      metadata: updates
    });
    return { success: true };
  } catch (error) {
    throw new Error('Failed to update skill');
  }
}

export async function deleteSkill(id: string) {
  try {
    await cosmic.objects.deleteOne(id);
    return { success: true };
  } catch (error) {
    throw new Error('Failed to delete skill');
  }
}
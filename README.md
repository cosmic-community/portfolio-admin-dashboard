# Portfolio Admin Dashboard

![Dashboard Preview](https://imgix.cosmicjs.com/88ab7900-a045-11ed-81f2-f50e185dd248-78A265wPiO4.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A comprehensive admin dashboard for managing your portfolio content with real-time data visualization, content management capabilities, and analytics insights. Built specifically for your existing Cosmic CMS portfolio structure.

## Features

- **📊 Dashboard Analytics** - Overview of your portfolio metrics with interactive charts
- **🎯 Project Management** - Complete CRUD operations for your projects
- **🛠️ Skills Management** - Organize and categorize your technical skills  
- **💼 Services Management** - Manage your service offerings and pricing
- **💬 Testimonials** - Display and manage client feedback
- **👤 Profile Management** - Update your professional profile and contact information
- **🔍 Advanced Search & Filters** - Find content quickly across all categories
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Updates** - Instant data synchronization with Cosmic CMS
- **🎨 Modern UI** - Clean, professional interface with dark theme

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68c7a72bfe0840663f64f477&clone_repository=68c7a9a7fe0840663f64f4af)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Build me a modern, professional portfolio website.

Style & Look:

Clean, minimal, modern design

Light theme with subtle shadows, rounded corners

Use my name "Mypati Deepthi" as the main heading

Responsive (works on desktop & mobile)

Sections Needed:

Hero Section:

Big heading: "Hi, I'm Deepthi – Full-Stack Web Developer"

Subtext: "I build modern web apps using Next.js, React, Spring Boot, and MySQL."

A professional photo placeholder (or avatar)

A Call-to-Action button ("Hire Me" → scroll to contact section)

About Me:

Short paragraph about my skills:
"I am a passionate full-stack web developer with experience in Next.js, React, Spring Boot, MySQL, Firebase, and Python. I create scalable, fast, and user-friendly web applications."

Skills Section (Grid Layout):

Frontend: Next.js, React, HTML, CSS, JS, TS

Backend: Spring Boot, Python (FastAPI)

Database: MySQL, Firebase

Tools: Git, Postman, Vercel, Docker (basic)

Projects Section:

Display 3–4 projects as cards

Each card should have: project name, screenshot placeholder, short description, tech stack used, buttons for Live Demo & GitHub

Services Section:

Full-Stack Web Development

Landing Pages & Company Websites

API Development & Integration

Database Design & Optimization

Firebase Projects

Bug Fixes / Feature Additions

Testimonials Section:

Placeholder for 2–3 reviews (I will add later)

Contact Section:

Simple contact form (Name, Email, Message)

Social links: LinkedIn, GitHub, Email button

Extra:

Smooth scrolling navigation

Sticky navbar with section highlights

Subtle animations (fade-in, hover effects)

SEO-friendly (proper headings, meta tags)"

### Code Generation Prompt

> Create a React dashboard that displays and manages my existing content

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **CMS**: Cosmic CMS with SDK v1.5+
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icons
- **Development**: Bun runtime and package manager

## Getting Started

### Prerequisites

- Bun runtime installed on your machine
- A Cosmic account with your portfolio bucket set up
- Node.js 18+ (for compatibility)

### Installation

1. Clone this repository
```bash
git clone <your-repo-url>
cd portfolio-admin-dashboard
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cosmic SDK Examples

### Fetching All Projects
```typescript
import { cosmic } from '@/lib/cosmic'

async function getProjects() {
  try {
    const response = await cosmic.objects
      .find({ type: 'projects' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}
```

### Updating Project Status
```typescript
async function updateProject(id: string, updates: any) {
  try {
    await cosmic.objects.updateOne(id, {
      metadata: updates
    })
    return { success: true }
  } catch (error) {
    throw error
  }
}
```

### Creating New Content
```typescript
async function createProject(projectData: any) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'projects',
      title: projectData.title,
      metadata: projectData
    })
    return response.object
  } catch (error) {
    throw error
  }
}
```

## Cosmic CMS Integration

This dashboard integrates with your existing Cosmic CMS portfolio structure:

- **Profile** - Personal information and professional details
- **Projects** - Portfolio projects with screenshots and tech stacks
- **Skills** - Technical skills organized by category  
- **Services** - Service offerings with pricing
- **Testimonials** - Client feedback and ratings
- **Contact Info** - Contact details and social links

All content is managed through the Cosmic SDK with full CRUD operations, real-time updates, and proper error handling.

## Deployment Options

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connect your GitHub repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy automatically on every push to main

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `out`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production

Set these environment variables in your hosting platform:

- `COSMIC_BUCKET_SLUG`: Your Cosmic bucket slug
- `COSMIC_READ_KEY`: Your Cosmic read key  
- `COSMIC_WRITE_KEY`: Your Cosmic write key

<!-- README_END -->
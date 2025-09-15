'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project } from '@/types';

interface ProjectsChartProps {
  projects: Project[];
}

export default function ProjectsChart({ projects }: ProjectsChartProps) {
  // Process projects to count tech stack usage
  const techStackCounts: Record<string, number> = {};
  
  projects.forEach(project => {
    const techStack = project.metadata?.tech_stack || [];
    techStack.forEach(tech => {
      techStackCounts[tech] = (techStackCounts[tech] || 0) + 1;
    });
  });

  const chartData = Object.entries(techStackCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 technologies

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No tech stack data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis />
        <Tooltip 
          formatter={(value) => [value, 'Projects']}
          labelStyle={{ color: '#374151' }}
        />
        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
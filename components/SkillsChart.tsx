'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skill } from '@/types';

interface SkillsChartProps {
  skills: Skill[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function SkillsChart({ skills }: SkillsChartProps) {
  // Process skills to count by category
  const categoryCounts: Record<string, number> = {};
  
  skills.forEach(skill => {
    const category = skill.metadata?.category?.value || 'Other';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const chartData = Object.entries(categoryCounts)
    .map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No skills data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
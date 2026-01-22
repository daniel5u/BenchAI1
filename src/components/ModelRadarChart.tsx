import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

interface Props {
  data: RadarDataPoint[];
  color?: string;
}

const ALL_CATEGORIES = [
  "Agent",
  "Coding",
  "Knowledge",
  "Long-Context",
  "Multimodal",
  "Reasoning";
];

export default function ModelRadarChart({ data, color = "#8884d8" }: Props) {
  const normalizedData = ALL_CATEGORIES.map(cat => {
    const existingPoint = data?.find(
      d => d.subject.toLowerCase() === cat.toLowerCase()
    );

    return {
      subject: cat,
      A: existingPoint ? existingPoint.A : 0,
      fullMark: 100
    };
  });

  if (!data) {
    return (
      <div className='flex h-64 items-center justify-center text-slate-400 bg-slate-50 rounded-xl'>
        <p>Lack of data for this model!</p>
      </div>
    );
  }

  return (
    <div className='w-full h-80'>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizedData}>
          {/** Grid line */}
          <PolarGrid stroke='#e2e8f0' />

          {/** Dimension tag */}
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
          />

          {/** Axis */}
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

          {/** Radar */}
          <Radar
            name="Score"
            dataKey="A"
            stroke={color}
            strokeWidth={3}
            fill={color}
            fillOpacity={0.2}
          />

          {/** Tooltip */}
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1' }}
            itemStyle={{ color: color, fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

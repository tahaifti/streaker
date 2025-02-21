import React from 'react';

interface HeatMapProps {
  data: { date: string; count: number }[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data = [] }) => {
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-400';
    if (count < 3) return 'bg-green-200';
    if (count < 5) return 'bg-green-400';
    return 'bg-green-600';
  };

  // Generate last 365 days
  const days = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    const found = data.find(d => d.date === formattedDate);
    return {
      date: formattedDate,
      count: found ? found.count : 0
    };
  }).reverse();

  return (
    <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
      {days.map((day) => (
        <div
          key={day.date}
          className={`w-3 h-3 rounded-sm ${getColor(day.count)}`}
          title={`${day.date}: ${day.count} activities`}
        />
      ))}
    </div>
  );
};

export default HeatMap;
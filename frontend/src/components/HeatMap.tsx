import React from 'react';

interface HeatMapProps {
  data: { date: string; count: number }[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data = [] }) => {
  // Color utility function remains the same
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-400';
    if (count < 3) return 'bg-green-200';
    if (count < 5) return 'bg-green-400';
    return 'bg-green-600';
  };

  // Generate days as before, but we'll organize them differently
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

  // Organize days into weeks (7 rows, each containing up to 53 days)
  const rows = Array.from({ length: 7 }, (_, rowIndex) =>
    days.filter((_, index) => index % 7 === rowIndex)
  );

  return (
    <div className="flex flex-col gap-1 w-full max-w-full overflow-x-auto ">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((day) => (
            <div
              key={day.date}
              className={`min-w-3 w-3 h-3 rounded-sm ${getColor(day.count)}`}
              title={`${day.date}: ${day.count} activities`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default HeatMap;

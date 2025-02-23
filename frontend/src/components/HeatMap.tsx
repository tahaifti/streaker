import React, { useEffect, useState } from 'react';

interface HeatMapProps {
  data: { date: string; count: number }[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data = [] }) => {
  const [daysToShow, setDaysToShow] = useState(365);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setDaysToShow(150);
      } else {
        setDaysToShow(365);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-500';
    if (count < 3) return 'bg-green-200';
    if (count < 5) return 'bg-green-400';
    return 'bg-green-600';
  };

  const days = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    const found = data.find(d => d.date === formattedDate);
    return {
      date: formattedDate,
      count: found ? found.count : 0
    };
  }).reverse();

  const rows = Array.from({ length: 7 }, (_, rowIndex) =>
    days.filter((_, index) => index % 7 === rowIndex)
  );

  return (
    <div className="flex flex-col gap-1 w-full overflow-x-auto py-2">
      <div className="flex flex-col gap-1">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((day) => (
              <div
                key={day.date}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${getColor(day.count)} transition-colors`}
                title={`${day.date}: ${day.count} activities`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatMap;

import React, { useEffect, useState } from 'react';

interface HeatMapProps {
  data: { date: string; count: number }[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data = [] }) => {
  const [daysToShow, setDaysToShow] = useState(365);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint for mobile
        setDaysToShow(150);
      }else if(window.innerWidth > 768 && window.innerWidth < 1024){
        setDaysToShow(230);
      } else {
        setDaysToShow(365);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-blue-100';
    if (count < 3) return 'bg-red-400 ';
    if (count < 5) return 'bg-red-600 ';
    return 'bg-red-800 ';
  };

  const days = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (daysToShow - 1 - i));
    const formattedDate = date.toISOString().split('T')[0];
    const found = data.find(d => d.date === formattedDate);
    return {
      date: formattedDate,
      count: found ? found.count : 0
    };
  });

  const rows = Array.from({ length: 7 }, (_, rowIndex) =>
    days.filter((_, index) => index % 7 === rowIndex)
  );

  return (
    <div className="flex flex-col gap-4">
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
      
      {/* Activity Level Legend */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-blue-100" />
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-red-400" />
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-red-600" />
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-red-800" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatMap;

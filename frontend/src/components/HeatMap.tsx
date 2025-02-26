import React, { useEffect, useState } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';

interface HeatMapProps {
    data: { date: string; count: number }[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
    const [monthsData, setMonthsData] = useState<{ month: string; days: Date[] }[]>([]);
    const [activityMap, setActivityMap] = useState<Map<string, number>>(new Map());
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Get the number of months to show based on screen size
        const getMonthsToShow = () => {
            if (windowWidth < 640) return 6; // Mobile
            if (windowWidth < 768) return 9; // Small tablet
            if (windowWidth < 1024) return 10; // Large tablet
            return 12; // Desktop
        };

        const endDate = new Date();
        const monthsToShow = getMonthsToShow();

        // Generate month data
        const newMonthsData: { month: string; days: Date[] }[] = [];

        for (let i = 0; i < monthsToShow; i++) {
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - i);

            const firstDayOfMonth = startOfMonth(currentDate);
            const lastDayOfMonth = endOfMonth(currentDate);

            const days = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
            const monthName = format(firstDayOfMonth, 'MMM');

            newMonthsData.unshift({ month: monthName, days });
        }

        setMonthsData(newMonthsData);

        // Create map of activity counts
        const newActivityMap = new Map();
        data.forEach(({ date, count }) => {
            newActivityMap.set(date, count);
        });
        setActivityMap(newActivityMap);
    }, [data, windowWidth]);

    const getColorClass = (count: number): string => {
        if (count === 0) return 'bg-gray-800';
        if (count <= 2) return 'bg-green-900';
        if (count <= 4) return 'bg-green-700';
        return 'bg-green-500';
    };

    // Fill each month matrix with empty spaces
    const getDayMatrix = (days: Date[]) => {
        // Create a 7x6 matrix (7 days of week × up to 6 weeks in a month)
        const matrix: (Date | null)[][] = Array(7).fill(null).map(() => Array(6).fill(null));

        days.forEach(day => {
            const dayOfWeek = getDay(day); // 0 for Sunday, 6 for Saturday
            const firstDayOfMonthWeekday = getDay(startOfMonth(day));
            const dayOfMonth = parseInt(format(day, 'd'));

            // Calculate which week of the month this day belongs to
            const weekInMonth = Math.floor((dayOfMonth - 1 + firstDayOfMonthWeekday) / 7);

            // Place the day in the correct position in the matrix
            matrix[dayOfWeek][weekInMonth] = day;
        });

        return matrix;
    };

    return (
        <div className="p-4 bg-gray-900 rounded-lg shadow-lg overflow-x-auto text-gray-300">
            <div className="flex min-w-fit">
                {/* Day of week labels */}
                <div className="flex flex-col mt-7 mr-2 text-xs space-y-2">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                </div>

                {/* Month columns */}
                <div className="flex space-x-4">
                    {monthsData.map((monthData, monthIdx) => {
                        const dayMatrix = getDayMatrix(monthData.days);
                        return (
                            <div key={monthIdx} className="flex flex-col">
                                {/* Month label */}
                                <div className="text-sm mb-2 text-center">{monthData.month}</div>

                                {/* Days display */}
                                <div>
                                    {Array(7).fill(0).map((_, rowIdx) => (
                                        <div key={rowIdx} className="flex mb-2">
                                            {Array(6).fill(0).map((_, colIdx) => {
                                                const day = dayMatrix[rowIdx][colIdx];

                                                if (!day) return (
                                                    <div
                                                        key={colIdx}
                                                        className="w-4 h-4 mr-1 opacity-0"
                                                    />
                                                );

                                                const dateStr = format(day, 'yyyy-MM-dd');
                                                const count = activityMap.get(dateStr) || 0;

                                                return (
                                                    <div
                                                        key={colIdx}
                                                        className={`w-4 h-4 mr-1 rounded-sm ${getColorClass(count)} transition-colors duration-200 hover:ring-1 hover:ring-gray-400`}
                                                        title={`${format(day, 'MMM d, yyyy')}: ${count} activities`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center text-xs text-gray-400 justify-end">
                <span className="mr-2">Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-800 rounded-sm" />
                    <div className="w-3 h-3 bg-green-900 rounded-sm" />
                    <div className="w-3 h-3 bg-green-700 rounded-sm" />
                    <div className="w-3 h-3 bg-green-500 rounded-sm" />
                </div>
                <span className="ml-2">More</span>
            </div>
        </div>
    );
};

export default HeatMap;
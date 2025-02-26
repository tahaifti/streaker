// import React, { useEffect, useState } from 'react';
// import { format, parseISO, eachDayOfInterval, subDays, startOfWeek, addDays, getDay } from 'date-fns';

// interface HeatMapProps {
//     data: { date: string; count: number }[];
// }

// const NewHeatMap: React.FC<HeatMapProps> = ({ data }) => {
//     const [weeks, setWeeks] = useState<Date[][]>([]);
//     const [activityMap, setActivityMap] = useState<Map<string, number>>(new Map());
//     const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//     useEffect(() => {
//         const handleResize = () => {
//             setWindowWidth(window.innerWidth);
//         };

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     useEffect(() => {
//         // Determine the number of days to show based on screen size
//         const getDaysToShow = () => {
//             if (windowWidth < 640) return 120; // Mobile: ~4 months
//             if (windowWidth < 768) return 180; // Small tablet: ~6 months
//             if (windowWidth < 1024) return 270; // Large tablet: ~9 months
//             return 365; // Desktop: full year
//         };

//         const endDate = new Date();
//         const daysToShow = getDaysToShow();
//         const startDate = subDays(endDate, daysToShow - 1);

//         // Adjust start date to previous Sunday
//         const adjustedStartDate = startOfWeek(startDate, { weekStartsOn: 0 });

//         // Generate all dates
//         const allDates = eachDayOfInterval({ start: adjustedStartDate, end: endDate });

//         // Group dates by weeks
//         const weekArrays: Date[][] = [];
//         let currentWeek: Date[] = [];
//         let currentMonth = format(allDates[0], 'MM');

//         // allDates.forEach((date) => {
//         //     if (getDay(date) === 0 && currentWeek.length > 0) {
//         //         weekArrays.push(currentWeek);
//         //         currentWeek = [];
//         //     }
//         //     currentWeek.push(date);
//         // });

//         // if (currentWeek.length > 0) {
//         //     weekArrays.push(currentWeek);
//         // }

//         // setWeeks(weekArrays);

//         allDates.forEach((date) => {
//             const month = format(date, 'MM');

//             // If the month changes, handle the transition
//             if (month !== currentMonth) {
//                 // Push the current week to weekArrays if it's not empty
//                 if (currentWeek.length > 0) {
//                     weekArrays.push(currentWeek);
//                 }
//                 // Start a new week for the new month
//                 currentWeek = [];
//                 currentMonth = month;
//             }

//             // If it's Sunday and the current week is not empty, start a new week
//             if (getDay(date) === 0 && currentWeek.length > 0) {
//                 weekArrays.push(currentWeek);
//                 currentWeek = [];
//             }

//             // Add the current date to the current week
//             currentWeek.push(date);
//         });

//         // Push the last week if it's not empty
//         if (currentWeek.length > 0) {
//             weekArrays.push(currentWeek);
//         }

//         setWeeks(weekArrays);


//         // Create map of activity counts
//         const newActivityMap = new Map();
//         data.forEach(({ date, count }) => {
//             newActivityMap.set(date, count);
//         });
//         setActivityMap(newActivityMap);
//     }, [data, windowWidth]);

//     const getColorClass = (count: number): string => {
//         if (count === 0) return 'bg-blue-100';
//         if (count <= 2) return 'bg-red-400';
//         if (count <= 4) return 'bg-red-600';
//         return 'bg-red-800';
//     };

//     // const getMonthLabels = () => {
//     //     const months = new Set();
//     //     weeks.flat().forEach(day => {
//     //         months.add(format(day, 'MMM'));
//     //     });
//     //     return Array.from(months) as string[];
//     // };

//     const getMonthLabels = () => {
//         if (visibleWeeks.length === 0) return [];

//         // Get first day of each week
//         const monthsWithDuplicates = visibleWeeks.map(week => {
//             // Get the first day of the week that has a different month than the previous week
//             const monthDay = week.find(day => {
//                 if (week === visibleWeeks[0]) return true;
//                 const prevWeekMonth = format(visibleWeeks[visibleWeeks.indexOf(week) - 1][0], 'M');
//                 return format(day, 'M') !== prevWeekMonth;
//             }) || week[0];
//             return {
//                 month: format(monthDay, 'MMM'),
//                 weekIndex: visibleWeeks.indexOf(week)
//             };
//         });

//         // Remove duplicate months while keeping the last occurrence of each month
//         const uniqueMonths = monthsWithDuplicates.reduce((acc, curr) => {
//             acc[curr.month] = curr.weekIndex;
//             return acc;
//         }, {} as Record<string, number>);

//         // Convert back to array and sort by week index
//         return Object.entries(uniqueMonths)
//             .sort((a, b) => a[1] - b[1])
//             .map(([month]) => month);
//     };

//     // Get number of weeks based on screen size
//     const getWeeksToShow = () => {
//         if (windowWidth < 640) return 17; // Mobile
//         if (windowWidth < 768) return 26; // Small tablet
//         if (windowWidth < 1024) return 39; // Large tablet
//         return 53; // Desktop
//     };

//     const visibleWeeks = weeks.slice(-getWeeksToShow());

//     return (
//         <div className="p-2 sm:p-4 bg-white rounded-lg shadow-lg overflow-x-auto">
//             <div className="flex min-w-fit">
//                 {/* Days of week labels */}
//                 <div className="flex flex-col mr-2 text-xs sm:text-sm text-gray-500 space-y-[3px] sm:space-y-1">
//                     <span>Sun</span>
//                     <span>Mon</span>
//                     <span>Tue</span>
//                     <span>Wed</span>
//                     <span>Thu</span>
//                     <span>Fri</span>
//                     <span>Sat</span>
//                 </div>

//                 <div className="min-w-fit">
//                     {/* Month labels */}
//                     <div className="flex mb-2 text-xs sm:text-sm text-gray-500">
//                         {getMonthLabels().map((month, idx) => (
//                             <span key={idx} className="flex-1 text-center">{month}</span>
//                         ))}
//                     </div>

//                     {/* Grid of activity squares */}
//                     <div className="flex gap-1">
//                         {visibleWeeks.map((week, weekIdx) => (
//                             <div key={weekIdx} className="flex flex-col gap-1">
//                                 {week.map((day, dayIdx) => {
//                                     const dateStr = format(day, 'yyyy-MM-dd');
//                                     const count = activityMap.get(dateStr) || 0;
//                                     return (
//                                         <div
//                                             key={`${weekIdx}-${dayIdx}`}
//                                             className={`w-2.5 h-2.5 sm:w-4 sm:h-5 rounded-sm ${getColorClass(count)} transition-colors duration-200 hover:ring-2 hover:ring-gray-300`}
//                                             title={`${format(day, 'MMM d, yyyy')}: ${count} activities`}
//                                         />
//                                     );
//                                 })}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Legend */}
//             <div className="mt-4 flex items-center text-xs sm:text-sm text-gray-600">
//                 <span className="mr-2">Less</span>
//                 <div className="flex gap-1">
//                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-100 rounded-sm" />
//                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-sm" />
//                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-600 rounded-sm" />
//                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-800 rounded-sm" />
//                 </div>
//                 <span className="ml-2">More</span>
//             </div>
//         </div>
//     );
// };

// export default NewHeatMap;

import React, { useEffect, useState } from 'react';
import { format, parseISO, eachDayOfInterval, subDays, startOfMonth, endOfMonth, getDaysInMonth, getDay } from 'date-fns';

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
            <div className="mt-4 flex items-center text-xs text-gray-400">
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
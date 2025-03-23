import { Calendar } from 'lucide-react';
import { LongestStreak, StreakCounter } from '.';
import HeatMap from './HeatMap';

interface ActivityHistoryCardProps {
  longestStreak: number;
  currentStreak: number;
  heatmapData: Array<{ date: string; count: number }>;
}

export const ActivityHistoryCard = ({ longestStreak, currentStreak, heatmapData }: ActivityHistoryCardProps) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
      <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
        Activity History
      </h2>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <LongestStreak count={longestStreak} />
        <div className="hidden sm:block w-px h-8 bg-gray-200" />
        <StreakCounter streak={currentStreak} />
      </div>
    </div>
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-fit px-4 sm:px-0">
        <HeatMap data={heatmapData} />
      </div>
    </div>
  </div>
);

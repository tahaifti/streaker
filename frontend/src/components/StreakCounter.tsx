import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-orange-600">
      <Flame size={24} className="text-orange-500" />
      <span>{streak} Day Streak!</span>
    </div>
  );
};

export default StreakCounter;
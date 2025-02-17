import React, { useState } from 'react';
import { Calendar, Trophy } from 'lucide-react';
import HeatMap from './components/HeatMap';
import StreakCounter from './components/StreakCounter';
import LongestStreak from './components/LongestStreak';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';

// Mock data - replace with real data from backend
const mockHeatmapData = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  count: Math.floor(Math.random() * 5)
}));

function App() {
  const [activities, setActivities] = useState<Array<{ id: number; text: string; timestamp: string }>>([]);
  const streak = 7; // Mock streak count - replace with real data
  const longestStreak = 15; // Mock longest streak - replace with real data

  const handleActivitySubmit = (text: string) => {
    setActivities([
      {
        id: Date.now(),
        text,
        timestamp: new Date().toISOString()
      },
      ...activities
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Streak Tracker</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar size={24} />
                Activity History
              </h2>
              <div className="flex items-center gap-6">
                <LongestStreak count={longestStreak} />
                <div className="w-px h-8 bg-gray-200" />
                <StreakCounter streak={streak} />
              </div>
            </div>
            <HeatMap data={mockHeatmapData} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Today's Activities</h2>
            <ActivityForm onSubmit={handleActivitySubmit} />
            <div className="mt-6">
              <ActivityList activities={activities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
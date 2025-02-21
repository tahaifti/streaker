import { useEffect, useMemo, useState } from 'react';
import { Calendar, Trophy } from 'lucide-react';
import HeatMap from './components/HeatMap';
import { StreakCounter, LongestStreak, ActivityForm, ActivityList } from './components';
import { useAuth } from './utils/auth';
import { addActivity, fetchActivities, fetchStreaks } from './utils/api';

function App() {
  const [activities, setActivities] = useState<Array<{ id: string; description: string; date: string }>>([]);
  const [streak, setStreak] = useState(0);
  const longestStreak = 15; // Mock longest streak - replace with real data
  const { authUser } = useAuth();

  // Fetch streaks on component mount
  useEffect(() => {
    if (authUser) {
      try {
        fetchStreaks(authUser.token).then((streaks) => {
          setStreak(streaks);
        });
        // console.log(`Streaks: ${streak}`);
      } catch (error) {
        console.error('Error fetching streaks:', error);
      }
    } else {
      console.error('User not authenticated - cannot fetch streaks');
    }
  }, [authUser]);

  // fetch activities on component mount
  useEffect(() => {
    if (authUser) {
      try {
        fetchActivities(authUser.token).then((fetchedActivities) => {
          setActivities(fetchedActivities || []);
        });
      } catch (error) {
        console.error('Error fetching activities:', error);
        setActivities([]); // Ensure activities is always an array
      }
    }
  }, [authUser]);

  // Transform activities data for HeatMap
  const heatmapData = useMemo(() => {
    // Group activities by date and count them
    const countsByDate = activities.reduce<{ [key: string]: number }>((acc, activity) => {
      // Format date to YYYY-MM-DD
      const date = activity.date.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format that HeatMap expects
    return Object.keys(countsByDate).map(date => ({
      date,
      count: countsByDate[date]
    }));
  }, [activities]);

  const handleActivitySubmit = async (description: string) => {
    if (authUser) {
      try {
        const response = await addActivity(authUser.token, description);
        const newActivity = {
          id: response.data.id,
          description: response.data.description,
          date: response.data.createdAt,
        };
        setActivities(currentActivities => [...(currentActivities || []), newActivity]);
      } catch (error) {
        console.error('Error submitting activity:', error);
      }
    } else {
      console.error('User not authenticated - cannot submit activity');
    }
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
            <HeatMap data={heatmapData} />
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
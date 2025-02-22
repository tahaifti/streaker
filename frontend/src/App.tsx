import { useEffect, useMemo, useState } from 'react';
import { Calendar, Trophy } from 'lucide-react';
import HeatMap from './components/HeatMap';
import { StreakCounter, LongestStreak, ActivityForm, ActivityList } from './components';
import { useAuth } from './utils/auth';
import { addActivity, fetchAllActivities, fetchLongestStreak, fetchStreaks } from './utils/api';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [activities, setActivities] = useState<Array<{ id: string; description: string; date: string, createdAt?: string }>>([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0); // Mock longest streak - replace with real data 
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

  // Fetch longest streak on component mount
  useEffect(() => {
    if (authUser) {
      try {
        fetchLongestStreak(authUser.token).then((streaks) => {
          setLongestStreak(streaks);
        });
        // console.log(`Longest streak: ${longestStreak}`);
      } catch (error) {
        console.error('Error fetching longest streak:', error);
      }
    } else {
      console.error('User not authenticated - cannot fetch longest streak');
    }
  }, [authUser]);

  // fetch activities on component mount
  useEffect(() => {
    if (authUser) {
      try {
        fetchAllActivities(authUser.token).then((fetchedActivities) => {
          setActivities(fetchedActivities || []);
          // console.log(fetchedActivities)
          localStorage.setItem('userActivities', JSON.stringify(fetchedActivities));
        });
      } catch (error) {
        console.error('Error fetching activities:', error);
        const cachedActivities = localStorage.getItem('userActivities');
        if (cachedActivities) {
          setActivities(JSON.parse(cachedActivities));
        }else {
          console.error('No cached activities found');
          setActivities([]); // Ensure activities is always an array
        }
      }
    } else {
      const cachedActivities = localStorage.getItem('userActivities');
      if (cachedActivities) {
        setActivities(JSON.parse(cachedActivities));
      }
    }
  }, [authUser]);

  // Transform activities data for HeatMap
  const heatmapData = useMemo(() => {
    // Group activities by date and sum the length of description arrays
    const countsByDate = activities.reduce<Record<string, number>>((acc, activity) => {
      // Handle different date formats safely
      const activityDate = activity.date || activity.createdAt;
      const date = typeof activityDate === 'string'
        ? activityDate.split('T')[0]  // ISO string format
        : activityDate 
          ? new Date(activityDate).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0]; // Default to current date

      // Count the length of the description array instead of incrementing by 1
      const activityCount = Array.isArray(activity.description) 
        ? activity.description.length 
        : 1; // Fallback to 1 if description is not an array

      acc[date] = (acc[date] || 0) + activityCount;
      return acc;
    }, {});

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
        const updatedActivities = [...(activities || []), newActivity];
        setActivities(updatedActivities);
        localStorage.setItem('userActivities', JSON.stringify(updatedActivities));

        fetchStreaks(authUser.token).then((streaks) => {
          setStreak(streaks);
        });
      } catch (error) {
        console.error('Error submitting activity:', error);
      }
    } else {
      console.error('User not authenticated - cannot submit activity');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

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
      <Footer/>
    </div>
  );
}

export default App;
import { useEffect, useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import HeatMap from './components/HeatMap';
import { StreakCounter, LongestStreak, ActivityForm, ActivityList } from './components';
import { useAuth } from './utils/auth';
import { addActivity, fetchAllActivities, fetchLongestStreak, fetchStreaks } from './utils/api';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [activities, setActivities] = useState<Array<{ id: string; description: string; date: string, createdAt?: string }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const { authUser } = useAuth();

  const activitiesPerPage = 3;

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
      const fetchedActivities = async () => {
        try {
          const data = await fetchAllActivities(authUser.token, currentPage, activitiesPerPage);
          // console.log(data);
          setActivities(data.activities);
          setTotalPages(data.totalPages);
          setLoading(false);
          // console.log(data);
          localStorage.setItem('userActivities', JSON.stringify(data.activities));
        } catch (error) {
          console.error('Error fetching activities:', error);
          const cachedActivities = localStorage.getItem('userActivities');
          if (cachedActivities) {
            setActivities(JSON.parse(cachedActivities));
          } else {
            console.error('No cached activities found');
            setActivities([]); // Ensure activities is always an array
          }
        }
      }
      fetchedActivities();
    } else {
      const cachedActivities = localStorage.getItem('userActivities');
      if (cachedActivities) {
        setActivities(JSON.parse(cachedActivities));
      }
    }
  }, [authUser, currentPage]);

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



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

  // if (loading) {
  //   return <div>Loading...</div>;
  // }


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
            {/* Pagination Controls */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
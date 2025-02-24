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
  const [allActivities, setAllActivities] = useState<Array<{ id: string; description: string; date: string, createdAt?: string }>>([]);
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
      } catch (error) {
        console.error('Error fetching longest streak:', error);
      }
    } else {
      console.error('User not authenticated - cannot fetch longest streak');
    }
  }, [authUser]);

  // Fetch activities on component mount
  useEffect(() => {
    if (authUser) {
      const fetchedActivities = async () => {
        try {
          const allData = await fetchAllActivities(authUser.token, 1, 0);
          const processedActivities = allData.activities.map(activity => ({
            ...activity,
            date: new Date(activity.date || activity.createdAt).toISOString().split('T')[0]
          }));
          setAllActivities(processedActivities);
          localStorage.setItem(
            `userActivities_${authUser.user.id}`, 
            JSON.stringify(processedActivities));
          
          const data = await fetchAllActivities(authUser.token, currentPage, activitiesPerPage);
          const processedPaginatedActivities = data.activities.map(activity => ({
            ...activity,
            date: new Date(activity.date || activity.createdAt).toISOString().split('T')[0]
          }));
          setActivities(processedPaginatedActivities);
          setTotalPages(data.totalPages);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching activities:', error);
          if(authUser.user.id){
            const cachedActivities = localStorage.getItem(`userActivities_${authUser.user.id}`);
            if (cachedActivities) {
              const parsed = JSON.parse(cachedActivities);
              setAllActivities(parsed);
              setActivities(parsed.slice((currentPage - 1) * activitiesPerPage, currentPage * activitiesPerPage));
            }
          } 
        }
      }
      fetchedActivities();
    } else {
      setLoading(false);
      setAllActivities([]);
      setActivities([]);
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
    const countsByDate = allActivities.reduce<Record<string, number>>((acc, activity) => {
      const activityDate = activity.date || activity.createdAt;
      const date = typeof activityDate === 'string'
        ? activityDate.split('T')[0]
        : activityDate
          ? new Date(activityDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

      const activityCount = Array.isArray(activity.description)
        ? activity.description.length
        : 1;

      acc[date] = (acc[date] || 0) + activityCount;
      return acc;
    }, {});

    return Object.keys(countsByDate).map(date => ({
      date,
      count: countsByDate[date]
    }));
  }, [allActivities]);

  const handleActivitySubmit = async (description: string) => {
    if (authUser) {
      try {
        const response = await addActivity(authUser.token, description);
        const newActivity = {
          id: response.data.id,
          description: response.data.description,
          date: new Date(response.data.createdAt).toISOString().split('T')[0],
        };
        const updatedActivities = [...allActivities, newActivity];
        setAllActivities(updatedActivities);
        setActivities(updatedActivities.slice((currentPage - 1) * activitiesPerPage, currentPage * activitiesPerPage));
        localStorage.setItem(
          `userActivities_${authUser.user.userId}`, 
          JSON.stringify(updatedActivities)
        );
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
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg text-gray-700">Loading your data...</span>
          </div>
        </div>
      ) : (
        <>
          {authUser?.user.name && (
              <div className="bg-green-500 p-4 w-96 mt-4 ml-4 rounded-xl shadow-sm text-xl font-semibold text-gray-800 sm:p-6 sm:ml-6 sm:w-96">
              Welcome back, {authUser.user.name}! 👋
            </div>
          )}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid gap-6 sm:gap-8">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                    <Calendar size={20} />
                    Activity History
                  </h2>
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <LongestStreak count={longestStreak} />
                    <div className="hidden sm:block w-px h-8 bg-gray-200" />
                    <StreakCounter streak={streak} />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <HeatMap data={heatmapData} />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Activities</h2>
                <ActivityForm onSubmit={handleActivitySubmit} />
                <div className="mt-4 sm:mt-6">
                  <ActivityList activities={activities} />
                </div>
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
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;

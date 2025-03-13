import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { StreakCounter, LongestStreak, ActivityForm, ActivityList } from './components';
import { useAuth } from './utils/auth';
import Header from './components/Header';
import Footer from './components/Footer';
import HeatMap from './components/HeatMap';
import InstallPrompt from './components/InstallPrompt';
import { useStreaks, useLongestStreak, useActivities, useAllActivities, useAddActivity } from './hooks/useQueries'
import { toast } from 'react-toastify';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 3;
  const { authUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: streak = 0, isLoading: streakLoading } = useStreaks(authUser?.token ?? '')
  const { data: longestStreak = 0, isLoading: longestStreakLoading } = useLongestStreak(authUser?.token ?? '')
  const {
    data: allActivitesData,
    isLoading: allActivitiesLoading
  } = useAllActivities(authUser?.token ?? '', 1, 0);
  const {
    data: activitiesData,
    isLoading: activitiesLoading
  } = useActivities(authUser?.token ?? '', currentPage, activitiesPerPage);


  const addActivityMutation = useAddActivity();

  const loading = streakLoading || longestStreakLoading || activitiesLoading || allActivitiesLoading;

  const allActivities = allActivitesData?.activities ?? [];
  const activities = activitiesData?.activities ?? [];
  const totalPages = activitiesData?.totalPages ?? 1;

  const handleActivitySubmit = async (description: string) => {
    if (authUser?.token) {
      try {
        setIsSubmitting(true);
        await addActivityMutation.mutateAsync({
          token: authUser.token,
          description
        });
        
        toast.success('Activity added successfully!');
      } catch (error) {
        console.error('Error submitting activity:', error);
        toast.error('An error occurred while adding the activity. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  // Transform activities data for HeatMap
  const heatmapData = useMemo(() => {
    if (!Array.isArray(allActivities) || allActivities.length === 0) {
      return [];
    }

    const countsByDate = allActivities.reduce<Record<string, number>>((acc, activity) => {
      if (!activity) return acc;

      try {
        const activityDate = activity.date || activity.createdAt;
        if (!activityDate) {
          return acc;
        }

        const date = typeof activityDate === 'string'
          ? activityDate.split('T')[0]
          : new Date(activityDate).toISOString().split('T')[0];

        const activityCount = Array.isArray(activity.description)
          ? activity.description.length
          : 1;

        acc[date] = (acc[date] || 0) + activityCount;
        return acc;
      } catch (error) {
        console.error('Error processing activity for heatmap:', error, activity);
        return acc;
      }
    }, {});

    return Object.keys(countsByDate).map(date => ({
      date,
      count: countsByDate[date]
    }));
  }, [allActivities]);


  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <InstallPrompt />
      {/* Welcome Message */}
      {authUser?.user.name && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
          <div className="bg-green-500 p-4 rounded-xl shadow-sm text-lg sm:text-xl font-semibold text-gray-800 max-w-md">
            Welcome back, {authUser.user.name}! 👋
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Activity History Card */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  Activity History
                </h2>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <LongestStreak count={longestStreak} />
                  <div className="hidden sm:block w-px h-8 bg-gray-200" />
                  <StreakCounter streak={streak} />
                </div>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-fit px-4 sm:px-0">
                  <HeatMap data={heatmapData} />
                </div>
              </div>
            </div>

            {/* Activities Card */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Activities</h2>
              <ActivityForm onSubmit={handleActivitySubmit} />
              <div className="mt-4 sm:mt-6">
                <ActivityList activities={activities} />
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 gap-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 text-sm sm:text-base"
                >
                  Previous
                </button>
                <span className="text-sm sm:text-base text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 text-sm sm:text-base"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-700">Adding activity...</span>
            <br />
            <span className="text-blue-600">⏳</span>
            <br />
            <span className="text-gray-400 text-sm">Please wait for a while </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

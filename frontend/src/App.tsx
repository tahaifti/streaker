import { useMemo, useState } from 'react';
import { useAuth } from './utils/auth';
import Header from './components/Header';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';
import { useStreaks, useLongestStreak, useActivities, useAllActivities, useAddActivity } from './hooks/useQueries';
import { toast } from 'react-toastify';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeMessage } from './components/WelcomeMessage';
import { ActivityHistoryCard } from './components/ActivityHistoryCard';
import { ActivitySection } from './components/ActivitySection';
import { LoadingOverlay } from './components/LoadingOverlay';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <InstallPrompt />
      
      {authUser?.user.name && <WelcomeMessage userName={authUser.user.name} />}

      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            <ActivityHistoryCard
              longestStreak={longestStreak}
              currentStreak={streak}
              heatmapData={heatmapData}
            />
            
            <ActivitySection
              activities={activities}
              currentPage={currentPage}
              totalPages={totalPages}
              onSubmit={handleActivitySubmit}
              onPreviousPage={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              onNextPage={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            />
          </div>
        )}
      </main>
      
      <Footer />
      {isSubmitting && <LoadingOverlay />}
    </div>
  );
}

export default App;

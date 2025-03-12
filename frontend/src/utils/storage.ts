export const STORAGE_KEYS = {
  ACTIVITIES: 'streaker_activities'
};

export const saveActivitiesToStorage = (activities: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (error) {
    console.error('Error saving activities to localStorage:', error);
  }
};

export const getActivitiesFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading activities from localStorage:', error);
    return [];
  }
};
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface ActivityFormProps {
  onSubmit: (activity: string) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit }) => {
  const [activity, setActivity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activity.trim()) {
      // console.log('Activity submitting:', activity);
      onSubmit(activity);
      // console.log('Activity submitted:', activity);
      setActivity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row md:flex-row">
      <input
        type="text"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        placeholder="What did you accomplish today?"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
      >
        <Plus size={20} />
        Add Activity
      </button>
    </form>
  );
};

export default ActivityForm;
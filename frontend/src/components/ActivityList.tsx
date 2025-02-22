import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
// import axios from 'axios';

interface Activity {
  id: string;
  description: string;
  date: string;
  createdAt?: string;
}

interface ActivityListProps {
  activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <div className=''>No activities found</div>;
  }
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
      <div
        key={activity.id}
        className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
      >
        <CheckCircle className="text-green-500" size={24} />
        <div className="flex-1">
        <div className="space-y-2">
          {Array.isArray(activity.description) ? (
          activity.description.map((desc, index) => (
            <p key={index} className="font-medium">
            • {desc}
            </p>
          ))
          ) : (
          <p className="font-medium">{activity.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
          <Clock size={14} />
          <span>{`${new Date(activity.date).toLocaleDateString()}`}</span>
        </div>
        </div>
      </div>
      ))}
    </div>
  );
};

export default ActivityList;
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface Activity {
  id: number;
  text: string;
  timestamp: string;
}

interface ActivityListProps {
  activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
        >
          <CheckCircle className="text-green-500" size={24} />
          <div className="flex-1">
            <p className="font-medium">{activity.text}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} />
              <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
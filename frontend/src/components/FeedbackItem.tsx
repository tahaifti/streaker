import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface FeedbackItemProps {
  type: string;
  message: string;
  email: string;
  createdAt: string;
  resolved: boolean;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ type, message, email, createdAt, resolved }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          type === 'bug' ? 'bg-red-100 text-red-800' :
          type === 'feature' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {type}
        </span>
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
      <p className="text-gray-700 mb-4">{message}</p>
      {email && (
        <div className="text-sm text-gray-500">
          Contact: {email}
        </div>
      )}
      <div className="mt-4 flex items-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {resolved ? 'Resolved' : 'Pending'}
        </span>
      </div>
    </div>
  );
};

export default FeedbackItem;
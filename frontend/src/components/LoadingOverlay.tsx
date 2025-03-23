import { LoadingSpinner } from './LoadingSpinner';

export const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
      <LoadingSpinner size={6} text="Adding activity..." />
      <span className="text-blue-600">⏳</span>
      <span className="text-gray-400 text-sm">Please wait for a while </span>
    </div>
  </div>
);

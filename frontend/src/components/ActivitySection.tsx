import { ActivityForm, ActivityList } from '.';

interface ActivitySectionProps {
  activities: any[];
  currentPage: number;
  totalPages: number;
  onSubmit: (description: string) => Promise<void>;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const ActivitySection = ({
  activities,
  currentPage,
  totalPages,
  onSubmit,
  onPreviousPage,
  onNextPage
}: ActivitySectionProps) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
    <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Activities</h2>
    <ActivityForm onSubmit={onSubmit} />
    <div className="mt-4 sm:mt-6">
      <ActivityList activities={activities} />
    </div>

    <div className="flex items-center justify-between mt-6 gap-4">
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className="px-3 sm:px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 text-sm sm:text-base"
      >
        Previous
      </button>
      <span className="text-sm sm:text-base text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="px-3 sm:px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 text-sm sm:text-base"
      >
        Next
      </button>
    </div>
  </div>
);

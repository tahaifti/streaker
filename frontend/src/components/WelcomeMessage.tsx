interface WelcomeMessageProps {
  userName: string;
}

export const WelcomeMessage = ({ userName }: WelcomeMessageProps) => (
  <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
    <div className="bg-green-500 p-4 rounded-xl shadow-sm text-lg sm:text-xl font-semibold text-gray-800 max-w-md">
      Welcome back, {userName}! 👋
    </div>
  </div>
);

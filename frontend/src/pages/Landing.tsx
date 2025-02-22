import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Target, Award, TrendingUp, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Landing: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                            Build Better Habits
                            <span className="block text-blue-600">One Day at a Time</span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                            Track your daily habits, build streaks, and stay motivated with beautiful visualizations of your progress.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-3 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                Start Your Journey
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-3 text-lg font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gray-50 opacity-50" />
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Everything you need to build lasting habits
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Target className="h-8 w-8 text-blue-600" />}
                            title="Set Your Goals"
                            description="Define your daily habits and track them effortlessly with our intuitive interface."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="h-8 w-8 text-green-600" />}
                            title="Track Progress"
                            description="Visualize your consistency with beautiful heatmaps and progress charts."
                        />
                        <FeatureCard
                            icon={<Flame className="h-8 w-8 text-orange-600" />}
                            title="Build Streaks"
                            description="Stay motivated by maintaining and breaking your personal streak records."
                        />
                        <FeatureCard
                            icon={<CheckCircle className="h-8 w-8 text-indigo-600" />}
                            title="Daily Check-ins"
                            description="Simple one-click check-ins to mark your daily progress."
                        />
                        <FeatureCard
                            icon={<Award className="h-8 w-8 text-purple-600" />}
                            title="Achievements"
                            description="Earn achievements and celebrate your milestones along the way."
                        />
                        <FeatureCard
                            icon={<Target className="h-8 w-8 text-red-600" />}
                            title="Stay Accountable"
                            description="Never break the chain with daily reminders and progress insights."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Ready to start your streak?
                    </h2>
                    <p className="mt-4 text-xl text-blue-100">
                        Join thousands of others who are building better habits with Streak Tracker.
                    </p>
                    <Link
                        to="/register"
                        className="mt-8 inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                    >
                        Get Started for Free
                    </Link>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
}> = ({ icon, title, description }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white shadow-sm mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default Landing;
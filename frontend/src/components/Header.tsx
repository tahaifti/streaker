import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, LogOut, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../utils/auth';
// import FeedbackForm from './FeedbackForm';

const Header: React.FC = () => {
    const { authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
                <div className="flex justify-between items-center ">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="flex items-center gap-2">
                            <Flame className="h-8 w-8 text-orange-500" />
                            <span className="hidden sm:inline text-xl font-bold text-gray-900">Streaker</span>
                        </Link>
                    </div>
                    <div className="flex items-center sm:space-x-4">
                        {/* Feedback Button */}
                        {/* <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span className="hidden sm:inline">Feedback</span>
                        </button> */}

                        {/* auth buttons */}
                        {authUser ? (
                            <>
                                <Link
                                    to="/user"
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900">
                                    <User className="h-5 w-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                                    onClick={() => {
                                        logout();
                                        navigate('/');
                                    }}
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-gray-900 px-4 py-2"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <FeedbackForm
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </header>
    );
};

export default Header;
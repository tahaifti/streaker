import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, LogOut, MessageCircle, User, Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../utils/auth';
import FeedbackForm from './FeedbackForm';

const Header: React.FC = () => {
    const { authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        toast.success('Logged out successfully!');
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="flex items-center gap-2">
                            <Flame className="h-8 w-8 text-orange-500" />
                            <span className="sm:inline text-xl font-bold text-gray-900">Streaker</span>
                        </Link>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {/* Feedback Button */}
                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span>Feedback</span>
                        </button>

                        {authUser ? (
                            <>
                                <Link
                                    to="/user"
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900">
                                    <User className="h-5 w-5" />
                                    <span>Profile</span>
                                </Link>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Sign Out</span>
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

                    {/* Mobile Menu Button */}
                    <div className="sm:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-700 hover:text-gray-900"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Panel */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden mt-4 py-2 border-t border-gray-200">
                        {authUser ? (
                            <div className="flex flex-col space-y-2">
                                <button
                                    onClick={() => {
                                        setIsFeedbackOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <span>Feedback</span>
                                </button>
                                <Link
                                    to="/user"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    <User className="h-5 w-5" />
                                    <span>Profile</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center mx-4"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <FeedbackForm
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </header>
    );
};

export default Header;
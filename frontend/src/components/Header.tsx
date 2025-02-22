import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, LogOut } from 'lucide-react';
import { useAuth } from '../utils/auth';

const Header: React.FC = () => {
    const { authUser, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <span className="text-xl font-bold text-gray-900">Streaker</span>
                </Link>

                <div className="flex items-center gap-4">
                    {authUser ? (
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Sign Out</span>
                        </button>
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
            </nav>
        </header>
    );
};

export default Header;
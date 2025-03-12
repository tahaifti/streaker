import React, { useState } from 'react';
import { User, Settings, Calendar, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../utils/auth';
import { useUser, useAllActivities, useUpdateUser, useChangePassword } from '../hooks/useQueries';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

interface Activity {
    id: string;
    description: string;
    date: string;
    createdAt: string;
}

const Profile: React.FC = () => {
    const { authUser } = useAuth();
    // console.log(authUser?.token);
    const { data: profileData, isLoading: profileLoading, error: profileError } = useUser(authUser?.token ?? '');
    // console.log(profileData);
    const { data: activities = [], isLoading: activitiesLoading } = useAllActivities(authUser?.token ?? '', 1, 0);
    // console.log(activities.activities);
    const updateUserMutation = useUpdateUser();
    const changePasswordMutation = useChangePassword();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'profile' | 'activities'>('profile');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    React.useEffect(() => {
        if (isEditing && profileData) {
            setFormData({
                name: profileData.name || '',
                username: profileData.username || '',
                email: profileData.email || '',
            });
        }
    }, [isEditing, profileData]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) return;

        try {
            setError('');
            setSuccessMessage('');

            await updateUserMutation.mutateAsync({
                token: authUser.token,
                profileData: formData
            })
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err : any) {
            setError(err.response?.data?.message || 'An error occurred while updating profile');
            toast.error(err.response?.data?.message || 'An error occurred while updating profile');
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        try {
            setError('');
            setSuccessMessage('');

            await changePasswordMutation.mutateAsync({
                token: authUser?.token || '',
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setShowPasswordModal(false);
            setSuccessMessage('Password changed successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err : any) {
            setError(err.response?.data?.message || 'An error occurred while changing password');
            toast.error(err.response?.data?.message || 'An error occurred while changing password');
        }
        setShowPasswordModal(false);
    };

    if (profileError) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                        <h2 className="text-lg font-medium mb-2">Error Loading Profile</h2>
                        <p>{profileError.message}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (profileLoading || activitiesLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            {/* <div>{profileData}</div> */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-6 sm:px-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <div className="bg-white rounded-full p-2 shadow-md">
                                <User size={64} className="text-blue-600" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-white">{profileData?.name}</h1>
                                <p className="text-blue-100">@{profileData?.username}</p>
                                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-4">
                                    <div className="bg-white/20 rounded-full px-3 py-1 text-sm text-white">
                                        <span className="font-semibold">{profileData?.current_streak}</span> Day Streak
                                    </div>
                                    <div className="bg-white/20 rounded-full px-3 py-1 text-sm text-white">
                                        <span className="font-semibold">{profileData?.longest_streak}</span> Best Streak
                                    </div>
                                    <div className="bg-white/20 rounded-full px-3 py-1 text-sm text-white">
                                        <span className="font-semibold">{activities.activities.length ?? 0}</span> Activities
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b">
                        <div className="flex">
                            <button
                                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'profile'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <Settings size={18} />
                                <span>Profile Settings</span>
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'activities'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('activities')}
                            >
                                <Calendar size={18} />
                                <span>Activity History</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 sm:p-6">
                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                                {successMessage}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {activeTab === 'profile' ? (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                            <span>Edit Profile</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    name: profileData?.name || '',
                                                    username: profileData?.username || '',
                                                    email: profileData?.email || '',
                                                });
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                                        >
                                            <X size={16} />
                                            <span>Cancel</span>
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                            >
                                                <Save size={18} />
                                                <span>Save Changes</span>
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                                            <p className="text-gray-900">{profileData?.name}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
                                            <p className="text-gray-900">@{profileData?.username}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                                            <p className="text-gray-900">{profileData?.email}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                                            <p className="text-gray-900">
                                                {profileData?.createdAt
                                                    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Statistics</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Current Streak</h3>
                                            <p className="text-2xl font-bold text-orange-500">{profileData?.current_streak} days</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Longest Streak</h3>
                                            <p className="text-2xl font-bold text-purple-600">{profileData?.longest_streak} days</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Activities</h3>
                                            <p className="text-2xl font-bold text-blue-600">{activities.activities.length ?? 0}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Completion Rate</h3>
                                            <p className="text-2xl font-bold text-green-600">
                                                {activities.activities.length > 0
                                                    ? Math.round(((profileData?.current_streak ?? 0) / activities.activities.length) * 100) + '%'
                                                    : '0%'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t">
                                    <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-red-800 mb-2">Change Password</h3>
                                        <p className="text-red-600 mb-4">Make sure to use a strong password that you haven't used before.</p>
                                        <button
                                            onClick={() => setShowPasswordModal(true)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </div>

                                {/* Password Change Modal */}
                                {showPasswordModal && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                                            <form onSubmit={handlePasswordChange}>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Current Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="currentPassword"
                                                            value={passwordData.currentPassword}
                                                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                            New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="newPassword"
                                                            value={passwordData.newPassword}
                                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Confirm New Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="confirmPassword"
                                                            value={passwordData.confirmPassword}
                                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-6 flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswordModal(false)}
                                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                    >
                                                        Change Password
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Activity History</h2>



                                {/* Activity List */}
                                <div className="space-y-4">
                                    {Array.isArray(activities.activities) && activities.activities.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500">No activities recorded yet.</p>
                                        </div>
                                    ) : (
                                        Array.isArray(activities.activities) && activities.activities.map((activity: Activity) => (
                                            <div key={activity.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <ul className="list-disc pl-4">
                                                            {Array.isArray(activity.description) &&  activity.description.map((desc: string, index: number) => (
                                                                <li key={index} className="text-gray-700">{desc}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(activity.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
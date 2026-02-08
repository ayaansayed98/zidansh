import { User, Mail, Phone, Calendar, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MyOrders from './MyOrders';

interface ProfileProps {
    user: any;
    userProfile: any;
    onSignOut?: () => void;
}

function Profile({ user, userProfile, onSignOut }: ProfileProps) {
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Signed In</h2>
                    <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
                    <a href="/" className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition">
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        if (onSignOut) onSignOut();
        window.location.href = '/';
    };

    return (
        <div className="w-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-pink-600 px-6 py-8 md:flex md:items-center md:justify-between">
                        <div className="flex items-center">
                            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-pink-600 text-3xl font-bold border-4 border-pink-200">
                                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-6">
                                <h1 className="text-2xl font-bold text-white">
                                    {user.user_metadata?.full_name || userProfile?.username || 'User Profile'}
                                </h1>
                                <p className="text-pink-100 flex items-center mt-1">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-0">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-pink-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-8">
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-6">Personal Information</h3>

                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Full Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                    {user.user_metadata?.full_name || 'Not provided'}
                                </dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Username
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                    @{userProfile?.username || 'Not set'}
                                </dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email Address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {user.email}
                                </dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Phone Number
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {userProfile?.phone_number || 'Not provided'}
                                </dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Member Since
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}
                                </dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Account Status
                                </dt>
                                <dd className="mt-1 text-sm text-green-600 font-semibold flex items-center">
                                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                    Active
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* My Orders Section */}
                <div className="mt-8">
                    <MyOrders user={user} />
                </div>
            </div>
        </div>
    );
}

export default Profile;

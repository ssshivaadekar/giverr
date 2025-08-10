import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Star, ArrowLeft, Calendar, Award, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import GratitudeCard from "@/components/GratitudeCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ImportFriendsModal from "@/components/ImportFriendsModal";

// Generate sample chart data for demonstration
const generateChartData = (currentUser: any) => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic progression data
    const baseReps = Math.max(0, (currentUser?.totalReps || 0) - Math.random() * 50);
    const baseStars = Math.max(0, (currentUser?.totalStars || 0) - Math.random() * 30);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      reps: Math.floor(baseReps + Math.random() * 10),
      stars: Math.floor(baseStars + Math.random() * 8),
    });
  }
  
  return data;
};

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');
  const [showImportModal, setShowImportModal] = useState(false);

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/users/stats', currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: gratitudeStories, isLoading: storiesLoading } = useQuery({
    queryKey: ['/api/gratitude-stories/user', currentUser?.id, activeTab],
    enabled: !!currentUser?.id,
  });

  if (!currentUser) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLocation('/')}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img 
                src="https://img1.wsimg.com/isteam/ip/e39f59ba-0d63-455a-9c4c-edc64d9436f5/Giverr_logo.jpg" 
                alt="GIVERR" 
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowImportModal(true)} className="px-3 py-2 text-sm font-medium rounded-md border border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                Import friends
              </button>
              <a href="/api/logout" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-8">
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <img 
                  src={currentUser.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128"} 
                  alt={`${currentUser.firstName}'s profile`} 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{currentUser.email}</p>
                
                {/* Join Date */}
                <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Joined {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>


              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600">{currentUser.totalReps || 0}</div>
                <div className="text-sm text-indigo-800 font-medium">Total Reps</div>
                <div className="text-xs text-gray-600 mt-1">Gratitude received</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                <div className="text-3xl font-bold text-pink-600">{currentUser.totalStars || 0}</div>
                <div className="text-sm text-pink-800 font-medium">Stars Given</div>
                <div className="text-xs text-gray-600 mt-1">Gratitude expressed</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-1" />
                  <div className="text-3xl font-bold text-green-600">+{currentUser.weeklyGrowth || 0}</div>
                </div>
                <div className="text-sm text-green-800 font-medium">This Week</div>
                <div className="text-xs text-gray-600 mt-1">New connections</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{currentUser.kindnessLevel || 1}</div>
                <div className="text-sm text-purple-800 font-medium">Community Score</div>
                <div className="text-xs text-gray-600 mt-1">Impact rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Your Kindness Journey
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateChartData(currentUser)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="reps" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
                    name="Reps Earned"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stars" 
                    stroke="#ec4899" 
                    strokeWidth={3}
                    dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2 }}
                    name="Stars Given"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Track your growth over the last 30 days and see how your kindness impacts the community!
              </p>
            </div>
          </div>
        </div>

        {/* Gratitude History */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'received'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2" />
                Gratitude Received
              </div>
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'given'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                Gratitude Given
              </div>
            </button>
          </div>

          {/* Stories List */}
          <div className="space-y-6">
            {storiesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading stories...</p>
              </div>
            ) : gratitudeStories && gratitudeStories.length > 0 ? (
              gratitudeStories.map((story: any) => (
                <GratitudeCard key={story.id} story={story} currentUser={currentUser} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'received' ? (
                    <Heart className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Star className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'received' ? 'No gratitude received yet' : 'No gratitude given yet'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'received' 
                    ? 'When someone expresses gratitude for your kindness, it will appear here.'
                    : 'Start by expressing gratitude for someone who made a difference in your life.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ImportFriendsModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </div>
  );
}
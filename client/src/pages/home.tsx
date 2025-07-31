import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import GratitudeCard from "../components/GratitudeCard";
import ExpressGratitudeModal from "../components/ExpressGratitudeModal";
import ConfirmGratitudeModal from "../components/ConfirmGratitudeModal";
import type { GratitudeStoryWithUsers, User } from "@shared/schema";
import { Plus, Heart } from "lucide-react";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showExpressModal, setShowExpressModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStory, setPendingStory] = useState<GratitudeStoryWithUsers | null>(null);

  // Type the user to avoid property access errors
  const currentUser = user as User;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  // Fetch gratitude stories
  const { data: stories = [] as GratitudeStoryWithUsers[], isLoading: storiesLoading } = useQuery({
    queryKey: ["/api/gratitude-stories"],
    enabled: !!user,
    retry: false,
  });

  // Fetch pending gratitude for current user
  const { data: pendingGratitude = [] as GratitudeStoryWithUsers[] } = useQuery({
    queryKey: ["/api/gratitude-stories/pending", user?.id],
    enabled: !!user,
    retry: false,
  });

  const handleExpressGratitude = async (data: { receiverId: string; content: string }) => {
    try {
      await apiRequest("/api/gratitude-stories", {
        method: "POST",
        body: JSON.stringify({
          receiverId: data.receiverId,
          content: data.content,
        }),
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/gratitude-stories"] });
      setShowExpressModal(false);
      
      toast({
        title: "Gratitude Expressed!",
        description: "Your gratitude story has been sent and is waiting for confirmation.",
      });
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to express gratitude",
        variant: "destructive",
      });
    }
  };

  const handleConfirmGratitude = async (data: { id: string; isConfirmed: boolean; confirmationNote?: string }) => {
    try {
      await apiRequest("/api/gratitude-stories/confirm", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/gratitude-stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gratitude-stories/pending", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setShowConfirmModal(false);
      setPendingStory(null);
      
      toast({
        title: data.isConfirmed ? "Gratitude Confirmed!" : "Story Declined",
        description: data.isConfirmed 
          ? "You've confirmed this gratitude story and earned reps!" 
          : "The story has been declined.",
      });
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to confirm gratitude",
        variant: "destructive",
      });
    }
  };

  const handleShowProfile = () => {
    toast({
      title: "Coming Soon",
      description: "User profile feature is coming soon!",
    });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">GIVERR</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Heart className="w-5 h-5" />
                {pendingGratitude.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full"></span>
                )}
              </button>
              <button onClick={handleShowProfile} className="flex items-center space-x-2">
                <img 
                  src={currentUser?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"} 
                  alt="Your profile" 
                  className="w-8 h-8 rounded-full" 
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
              </button>
              <a href="/api/logout" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 pb-20 md:pb-8">
        {/* User Stats Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{currentUser?.totalReps || 0}</div>
                <div className="text-sm text-gray-500">Total Reps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{currentUser?.totalStars || 0}</div>
                <div className="text-sm text-gray-500">Stars Given</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">+{currentUser?.weeklyGrowth || 0}</div>
                <div className="text-sm text-gray-500">This Week</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Heart className="w-4 h-4 mr-1" />
                  <span>{currentUser?.kindnessLevel || "High Trust"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gratitude Feed */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Welcome Message for New Users */}
            {stories.length === 0 && !storiesLoading && (
              <div className="bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-200 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Your Gratitude Journey! 🎉</h3>
                <p className="text-gray-600 mb-4">Start by expressing gratitude for someone who made a difference in your life. Every story matters!</p>
                <button 
                  onClick={() => setShowExpressModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Express Your First Gratitude
                </button>
              </div>
            )}

            {/* Pending Confirmations */}
            {pendingGratitude.length > 0 && (
              <div className="bg-white border border-indigo-200 border-l-4 border-l-indigo-500 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pending Confirmations ({pendingGratitude.length})
                </h3>
                <div className="space-y-3">
                  {pendingGratitude.slice(0, 3).map((story) => (
                    <div key={story.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 truncate">
                          {story.giver?.firstName} expressed gratitude: "{story.content?.substring(0, 50)}..."
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setPendingStory(story);
                          setShowConfirmModal(true);
                        }}
                        className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gratitude Stories */}
            {storiesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading stories...</p>
              </div>
            ) : (
              stories.map((story) => (
                <GratitudeCard key={story.id} story={story} currentUser={currentUser} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowExpressModal(true)}
        className="floating-btn gradient-bg text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      <ExpressGratitudeModal
        isOpen={showExpressModal}
        onClose={() => setShowExpressModal(false)}
        onSubmit={handleExpressGratitude}
        currentUser={currentUser}
      />

      {pendingStory && (
        <ConfirmGratitudeModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setPendingStory(null);
          }}
          onConfirm={handleConfirmGratitude}
          story={pendingStory}
        />
      )}
    </div>
  );
}
import type { GratitudeStoryWithUsers, User } from "@shared/schema";

interface GratitudeCardProps {
  story: GratitudeStoryWithUsers;
  currentUser: User;
}

export default function GratitudeCard({ story, currentUser }: GratitudeCardProps) {
  const formatTimeAgo = (date: string | Date | null) => {
    if (!date) return 'Unknown time';
    const now = new Date();
    const storyDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - storyDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const isCurrentUserGiver = story.giver.id === currentUser.id;
  const isCurrentUserReceiver = story.receiver.id === currentUser.id;

  return (
    <div className="story-card bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img 
              src={story.giver.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"} 
              alt={`${story.giver.firstName}'s profile`} 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div>
              <div className="font-medium text-gray-900">
                {isCurrentUserGiver ? 'You' : `${story.giver.firstName} ${story.giver.lastName}`}
              </div>
              <div className="text-sm text-gray-500">
                thanked{' '}
                <span className="font-medium text-indigo-600">
                  {isCurrentUserReceiver ? 'you' : `${story.receiver.firstName} ${story.receiver.lastName}`}
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {formatTimeAgo(story.createdAt)}
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed">
          {story.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-pink-500 transition-colors">
              <i className="fas fa-heart"></i>
              <span className="text-sm">{story.likes || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors">
              <i className="fas fa-comment"></i>
              <span className="text-sm">{story.comments || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors">
              <i className="fas fa-share"></i>
              <span className="text-sm">Share</span>
            </button>
          </div>
          
          {isCurrentUserGiver ? (
            <div className="star-badge px-3 py-1 rounded-full text-white text-xs font-medium">
              +{story.starsGiven || 0} Stars
            </div>
          ) : (
            <div className="rep-badge px-3 py-1 rounded-full text-white text-xs font-medium">
              +{story.repsEarned || 0} Reps
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

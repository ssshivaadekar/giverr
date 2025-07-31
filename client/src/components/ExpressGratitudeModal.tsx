import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface ExpressGratitudeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpressGratitudeModal({ isOpen, onClose }: ExpressGratitudeModalProps) {
  const [step, setStep] = useState<'search' | 'write'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [gratitudeStory, setGratitudeStory] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search users
  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ['/api/users/search', searchQuery],
    enabled: searchQuery.length > 0,
    retry: false,
  });

  // Submit gratitude story
  const submitGratitudeMutation = useMutation({
    mutationFn: async (data: { receiverId: string; content: string }) => {
      return await apiRequest('POST', '/api/gratitude-stories', data);
    },
    onSuccess: () => {
      toast({
        title: "Gratitude Sent! 🎉",
        description: `${selectedUser?.firstName} will receive a notification to confirm.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/gratitude-stories'] });
      handleClose();
    },
    onError: (error) => {
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
        description: "Failed to send gratitude. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setStep('search');
    setSearchQuery('');
    setSelectedUser(null);
    setGratitudeStory('');
    onClose();
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setStep('write');
  };

  const handleGoBack = () => {
    setStep('search');
    setSelectedUser(null);
  };

  const handleSubmit = () => {
    if (!selectedUser || gratitudeStory.length < 100) return;

    submitGratitudeMutation.mutate({
      receiverId: selectedUser.id,
      content: gratitudeStory.trim(),
    });
  };

  const getStoryStrength = (length: number) => {
    if (length < 50) return { text: 'Start writing...', color: 'text-gray-500' };
    if (length < 150) return { text: 'Good start!', color: 'text-yellow-600' };
    if (length < 300) return { text: 'Getting better!', color: 'text-orange-600' };
    return { text: 'Meaningful story!', color: 'text-green-600' };
  };

  const storyStrength = getStoryStrength(gratitudeStory.length);
  const progress = Math.min((gratitudeStory.length / 1000) * 100, 100);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Express Gratitude
          </DialogTitle>
        </DialogHeader>

        {step === 'search' && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Who do you want to thank?
              </Label>
              <div className="relative">
                <Input
                  id="search"
                  type="text"
                  placeholder="Search for someone by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
              </div>
            </div>

            {/* Search Results */}
            {searchQuery.length > 0 && (
              <div className="space-y-2">
                {searchLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                  </div>
                )}
                
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((user: User) => (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center">
                          <img 
                            src={user.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"} 
                            alt={`${user.firstName}'s profile`} 
                            className="w-10 h-10 rounded-full mr-3" 
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!searchLoading && searchResults.length === 0 && searchQuery.length > 2 && (
                  <div className="text-center py-4 text-gray-500">
                    No users found. Try a different search term.
                  </div>
                )}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Can't find them? Invite them to join GIVERR!</p>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                Send Invitation
              </button>
            </div>
          </div>
        )}

        {step === 'write' && selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <button onClick={handleGoBack} className="mr-3 text-gray-400 hover:text-gray-600">
                <i className="fas fa-arrow-left"></i>
              </button>
              <div className="flex items-center">
                <img 
                  src={selectedUser.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"} 
                  alt={`${selectedUser.firstName}'s profile`} 
                  className="w-8 h-8 rounded-full mr-2" 
                />
                <span>
                  Thanking <span className="font-medium text-indigo-600">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </span>
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <i className="fas fa-clock text-yellow-600 mr-2"></i>
                <span className="text-sm font-medium text-yellow-800">Cooldown Check</span>
              </div>
              <p className="text-sm text-yellow-700">
                You're ready to express gratitude for this person! ✅
              </p>
            </div>

            <div>
              <Label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-2">
                Share your gratitude story
              </Label>
              <Textarea
                id="story"
                placeholder={`Start telling us about the kindness you received from ${selectedUser.firstName}... What happened? How did they help?`}
                rows={6}
                value={gratitudeStory}
                onChange={(e) => setGratitudeStory(e.target.value)}
                maxLength={1000}
                className="w-full resize-none"
              />
              
              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span>Story Strength:</span>
                  <span className={`font-medium ${storyStrength.color}`}>
                    {storyStrength.text}
                  </span>
                </div>
                <span className="text-gray-400">{gratitudeStory.length}/1000</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {gratitudeStory.length > 20 && gratitudeStory.length < 200 && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <i className="fas fa-lightbulb text-blue-500 mr-2 mt-1"></i>
                    <div>
                      <p className="text-sm text-blue-800">
                        That's a great start! Can you tell us more about what happened? What was the situation?
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Daily Limit:</span> Share stories that matter
              </div>
              <Button
                onClick={handleSubmit}
                disabled={gratitudeStory.length < 100 || submitGratitudeMutation.isPending}
                className="gradient-bg text-white hover:opacity-90 disabled:opacity-50"
              >
                {submitGratitudeMutation.isPending ? 'Sending...' : 'Submit Gratitude'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

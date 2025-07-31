import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { GratitudeStoryWithUsers } from "@shared/schema";

interface ConfirmGratitudeModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: GratitudeStoryWithUsers;
}

export default function ConfirmGratitudeModal({ isOpen, onClose, story }: ConfirmGratitudeModalProps) {
  const [confirmationNote, setConfirmationNote] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const confirmMutation = useMutation({
    mutationFn: async (data: { isConfirmed: boolean; confirmationNote: string }) => {
      return await apiRequest('PATCH', `/api/gratitude-stories/${story.id}/confirm`, data);
    },
    onSuccess: (_, variables) => {
      if (variables.isConfirmed) {
        toast({
          title: "Gratitude Confirmed! 🎉",
          description: "You earned 20 Reps! Thank you for spreading kindness.",
        });
      } else {
        toast({
          title: "Story Marked as Inaccurate",
          description: "The story has been flagged for review.",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/gratitude-stories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gratitude-stories/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      onClose();
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
        description: "Failed to confirm gratitude. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConfirm = () => {
    confirmMutation.mutate({
      isConfirmed: true,
      confirmationNote: confirmationNote.trim(),
    });
  };

  const handleReject = () => {
    confirmMutation.mutate({
      isConfirmed: false,
      confirmationNote: "Story marked as inaccurate",
    });
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const storyDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - storyDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="text-center mb-6">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-heart text-white text-2xl"></i>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Someone thanked you!
            </DialogTitle>
            <p className="text-gray-600 mt-2">Please review and confirm this act of kindness.</p>
          </div>
        </DialogHeader>

        {/* Gratitude Story Review */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-3">
            <img 
              src={story.giver.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"} 
              alt={`${story.giver.firstName}'s profile`} 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div>
              <div className="font-medium text-gray-900">
                {story.giver.firstName} {story.giver.lastName}
              </div>
              <div className="text-sm text-gray-500">
                {formatTimeAgo(story.createdAt)}
              </div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {story.content}
          </p>
        </div>

        {/* Optional Giver's Note */}
        <div className="mb-6">
          <Label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Add a brief note (optional)
          </Label>
          <Textarea
            id="note"
            placeholder="Thank you for sharing this! It means a lot..."
            rows={3}
            value={confirmationNote}
            onChange={(e) => setConfirmationNote(e.target.value)}
            maxLength={200}
            className="w-full resize-none"
          />
          <div className="text-xs text-gray-400 mt-1">
            {confirmationNote.length}/200 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleReject}
            disabled={confirmMutation.isPending}
            variant="outline"
            className="flex-1"
          >
            Not Accurate
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={confirmMutation.isPending}
            className="flex-1 gradient-bg text-white hover:opacity-90"
          >
            {confirmMutation.isPending ? 'Confirming...' : 'Confirm & Earn Reps'}
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            This will earn you approximately <span className="font-medium text-indigo-600">+20 Reps</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

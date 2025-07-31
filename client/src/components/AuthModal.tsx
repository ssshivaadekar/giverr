import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSwitchMode: (mode: 'signin' | 'signup') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSocialLogin = () => {
    window.location.href = "/api/login";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For signup, redirect to main login which will create account
    window.location.href = "/api/login";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {mode === 'signup' ? 'Join GIVERR' : 'Welcome Back'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full"
            />
          </div>

          {mode === 'signin' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                />
                <Label htmlFor="rememberMe" className="text-sm text-gray-900">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-800">
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full gradient-bg text-white hover:opacity-90">
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={handleSocialLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <i className="fab fa-google text-red-500"></i>
            </button>
            <button
              onClick={handleSocialLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <i className="fab fa-facebook text-blue-600"></i>
            </button>
            <button
              onClick={handleSocialLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <i className="fab fa-linkedin text-blue-700"></i>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => onSwitchMode(mode === 'signup' ? 'signin' : 'signup')}
            className="font-medium text-indigo-600 hover:text-indigo-800"
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}

interface NavigationProps {
  onShowAuth: (mode: 'signin' | 'signup') => void;
}

export default function Navigation({ onShowAuth }: NavigationProps) {
  return (
    <nav className="glass-effect shadow-sm fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mr-3"></div>
              <h1 className="text-2xl font-bold gradient-text">GIVERR</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#problem" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">The Problem</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">How It Works</a>
              <a href="#features" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
              <a href="#ecosystem-value" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Value & Sustainability</a>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onShowAuth('signin')}
              className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => onShowAuth('signup')}
              className="gradient-bg text-white hover:opacity-90 px-6 py-2 rounded-full text-sm font-semibold shadow-md transition-all transform hover:scale-105"
            >
              Join the Movement
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

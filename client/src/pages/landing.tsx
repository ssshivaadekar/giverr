import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import Navigation from "@/components/Navigation";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleShowAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <Navigation onShowAuth={handleShowAuth} />

      {/* Hero Section */}
      <header className="bg-white pt-28 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Background gradient circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-12">
              <img 
                src="https://img1.wsimg.com/isteam/ip/e39f59ba-0d63-455a-9c4c-edc64d9436f5/Giverr_logo.jpg" 
                alt="GIVERR" 
                className="h-24 md:h-32 w-auto shadow-lg rounded-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              In a <span className="gradient-text">Me-First</span> World, <br className="hidden md:block" /> Be a <span className="gradient-text">GIVERR</span>.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
              Imagine a social network where connection is fueled by gratitude, communities are strengthened by giving back, and purpose is found in helping others. Welcome to GIVERR.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => handleShowAuth('signup')} className="gradient-bg text-white hover:opacity-90 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all transform hover:scale-105">
                Let's get started
              </button>
              <button onClick={() => scrollToSection('demo')} className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-3 rounded-full text-lg font-semibold transition-all">
                See Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">The Problem We're Solving</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Social Media That Lacks Social Good
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Current platforms are a stream of individual achievements and material possessions. GIVERR is different. We're a community built on the intrinsic value of giving, connecting people through acts of kindness, volunteering, and gratitude.
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-gray-700">Over <span className="text-pink-500">100 million</span> posts on Instagram are tagged with #gratitude.</p>
            <p className="mt-2 text-lg text-gray-600">People are searching for purpose. It's time they had a place to find it.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How GIVERR Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A Cycle of Giving and Gratitude
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              GIVERR flips the script. Instead of posting about yourself, you receive gratitude from others, creating a positive feedback loop of kindness.
            </p>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600 text-white mx-auto">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">1. Give Back</h3>
              <p className="mt-2 text-base text-gray-500">
                Perform acts of kindness in your community or network—like helping a colleague, mentoring a junior, assisting a senior, or referring someone to a job. Your positive actions kickstart the cycle.
              </p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-500 text-white mx-auto">
                <i className="fas fa-hands-praying"></i>
              </div>
              <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">2. Receive Gratitude</h3>
              <p className="mt-2 text-base text-gray-500">
                Others share your generosity, showing appreciation. These posts earn you "Reps" for your positive impact.
              </p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-500 text-white mx-auto">
                <i className="fas fa-star"></i>
              </div>
              <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">3. Acknowledge Others</h3>
              <p className="mt-2 text-base text-gray-500">
                Express thanks to others for their good deeds. You'll earn "Stars" for acknowledging their contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Experience GIVERR</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              See How Gratitude Comes to Life
            </p>
          </div>

          {/* Mobile App Preview */}
          <div className="flex justify-center mb-16">
            <div className="bg-white rounded-3xl shadow-2xl p-1 max-w-xs w-full">
              <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
                {/* Phone Status Bar */}
                <div className="flex justify-between items-center mb-4 text-xs">
                  <span>9:41 AM</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* App Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold gradient-text">GIVERR</h3>
                  <div className="relative">
                    <i className="fas fa-bell text-gray-300"></i>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rep-badge p-3 rounded-lg text-center">
                    <div className="text-lg font-bold">127</div>
                    <div className="text-xs">Reps Earned</div>
                  </div>
                  <div className="star-badge p-3 rounded-lg text-center">
                    <div className="text-lg font-bold">89</div>
                    <div className="text-xs">Stars Given</div>
                  </div>
                </div>

                {/* Gratitude Stories Preview */}
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">Sarah thanked you</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">"Alex helped me rehearse my presentation when I was stressed. Their support made all the difference!"</p>
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <i className="fas fa-heart mr-1"></i>
                      <span>+15 Reps earned</span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">You thanked Mike</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">"Mike spent his weekend helping elderly neighbors with groceries. True community spirit!"</p>
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <i className="fas fa-star mr-1"></i>
                      <span>+5 Stars given</span>
                    </div>
                  </div>
                </div>

                {/* Floating Action Button */}
                <div className="absolute bottom-4 right-4">
                  <button className="gradient-bg w-12 h-12 rounded-full shadow-lg flex items-center justify-center">
                    <i className="fas fa-plus text-white"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Core Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Tools for a Kinder World</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">We provide the features you need to find and spread good in the world.</p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "fas fa-heart", title: "Personalized Gratitude Feed", desc: "A curated feed tailored to your interests, highlighting relevant acts of kindness and gratitude.", color: "text-indigo-600" },
              { icon: "fas fa-trophy", title: "Community Challenges", desc: "Time-limited challenges encouraging specific acts of kindness or volunteer work.", color: "text-pink-500" },
              { icon: "fas fa-laptop-code", title: "Virtual Volunteering", desc: "Opportunities to participate in virtual volunteer activities, like online tutoring or remote crisis response.", color: "text-yellow-500" },
              { icon: "fas fa-user-friends", title: "Mentorship Program", desc: "Connect with mentors for guidance, support, and inspiration on your journey of giving.", color: "text-green-500" },
              { icon: "fas fa-gamepad", title: "Gamification Elements", desc: "Earn badges, level up, and climb leaderboards with your 'Reps' and 'Stars' to stay motivated and engaged.", color: "text-red-500" },
              { icon: "fas fa-shield-heart", title: "Trust & Safety", desc: "AI-powered authenticity checks and community moderation ensure genuine interactions.", color: "text-purple-500" }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className={`${feature.icon} text-3xl ${feature.color}`}></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem-value" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Building Our Ecosystem</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Value & Sustainability</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">Our model focuses on creating value and sustaining growth through community engagement and strategic partnerships, empowering genuine social impact.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Organizations</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-3 mt-1"></i>
                  <span>Premium features with custom recognition badges</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-3 mt-1"></i>
                  <span>Enhanced analytics on campaign impact</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-3 mt-1"></i>
                  <span>Direct access to highly-repped volunteers</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Businesses</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-3 mt-1"></i>
                  <span>API integration for employee recognition</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-3 mt-1"></i>
                  <span>Sponsored gratitude campaigns</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-3 mt-1"></i>
                  <span>Positive brand alignment opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold gradient-text mb-4">GIVERR</h3>
              <p className="text-gray-300">Changing the world, one act of kindness at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">For Individuals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Organizations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Businesses</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-300 mb-4">Drop us a line!</p>
              <div className="space-y-2">
                <input type="email" placeholder="Your email" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400" />
                <button className="w-full gradient-bg text-white py-2 rounded font-medium hover:opacity-90 transition-opacity">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GIVERR. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode} 
        onSwitchMode={setAuthMode}
      />

      {/* Font Awesome Icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}

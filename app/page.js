"use client"
import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, Heart, Users, Zap, Coffee, Star, Globe, TrendingUp, MessageCircle, Trophy, Sparkles } from 'lucide-react';

// Mock tweet data
const mockTweets = [
  { id: 1, user: '@sarah_creates', content: 'Just hit my first $1000 month on Buy Me a Chai! 🎉 The community support has been incredible!', likes: 234, time: '2h' },
  { id: 2, user: '@indie_dev_mike', content: 'Switched from other platforms to Chai and the difference is night and day. Finally making sustainable income! ☕️', likes: 156, time: '4h' },
  { id: 3, user: '@art_by_luna', content: 'My supporters on Chai are the most genuine people. They actually care about my art journey 💖', likes: 89, time: '6h' },
  { id: 4, user: '@music_maven', content: 'Released an exclusive track for my Chai supporters today. The feedback has been amazing! 🎵', likes: 312, time: '8h' },
  { id: 5, user: '@podcast_queen', content: 'The recurring support model on Chai lets me focus on content instead of constantly fundraising 🙌', likes: 445, time: '12h' },
];

// Intersection Observer Hook
function useInView(threshold = 0.1) {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, inView]);

  return <span>{count.toLocaleString()}{end >= 1000000 ? 'M' : end >= 1000 ? 'K' : ''}</span>;
}

// Tweet Component
function TweetCard({ tweet, delay = 0, inView }) {
  return (
    <div 
      className={`bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 transform ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ 
        transitionDelay: `${delay}ms`,
        animation: inView ? `float 6s ease-in-out infinite ${delay / 1000}s` : 'none'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {tweet.user[1].toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-300 font-semibold">{tweet.user}</span>
            <span className="text-gray-500 text-sm">• {tweet.time}</span>
          </div>
          <p className="text-gray-300 mb-3 leading-relaxed">{tweet.content}</p>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer">
              <Heart className="w-4 h-4" />
              <span>{tweet.likes}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              <span>{Math.floor(tweet.likes / 5)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [heroRef, heroInView] = useInView(0.2);
  const [featuresRef, featuresInView] = useInView(0.1);
  const [stepsRef, stepsInView] = useInView(0.1);
  const [tweetsRef, tweetsInView] = useInView(0.1);
  const [ctaRef, ctaInView] = useInView(0.2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Add floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-5px) rotate(0.5deg); }
          66% { transform: translateY(3px) rotate(-0.5deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Sparkles Background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400/30" />
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-pink-500/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot; /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Title */}
            <div 
              className={`flex items-center justify-center gap-4 mb-8 transition-all duration-1000 ${
                heroInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="p-3 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl hover:scale-110 transition-transform duration-300">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Buy Me a Chai
              </h1>
            </div>

            {/* Subtitle */}
            <div 
              className={`transition-all duration-1000 delay-300 ${
                heroInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
                The perfect platform for creators to build lasting relationships with their fans
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                Transform your passion into a sustainable income. Connect with supporters who believe in your work and want to see you thrive.
              </p>
            </div>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${
                heroInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:scale-105">
                <span className="flex items-center gap-2">
                  Start Creating Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-purple-400 text-purple-300 rounded-full font-semibold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300">
                Explore Creators
              </button>
            </div>

            {/* Stats */}
            <div 
              className={`flex flex-wrap justify-center gap-8 mt-16 text-center transition-all duration-1000 delay-700 ${
                heroInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter end={50} inView={heroInView} />K+
                </div>
                <div className="text-gray-400 group-hover:text-purple-300 transition-colors">Active Creators</div>
              </div>
              <div className="group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter end={2} inView={heroInView} />M+
                </div>
                <div className="text-gray-400 group-hover:text-purple-300 transition-colors">Supporters</div>
              </div>
              <div className="group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-white mb-1">
                  $<AnimatedCounter end={10} inView={heroInView} />M+
                </div>
                <div className="text-gray-400 group-hover:text-purple-300 transition-colors">Creator Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why creators love <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Chai</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We've built the ultimate platform for sustainable creator economy. Your fans want to support you—we make it easy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div 
              className={`group p-8 rounded-3xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 ${
                featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Build Your Community</h3>
              <p className="text-gray-300 leading-relaxed">
                Connect directly with your most passionate fans. Create exclusive content and build lasting relationships that go beyond one-time purchases.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              className={`group p-8 rounded-3xl bg-gradient-to-br from-orange-900/50 to-yellow-900/50 border border-orange-500/20 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-105 ${
                featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Predictable Income</h3>
              <p className="text-gray-300 leading-relaxed">
                Turn your passion into a sustainable business with recurring support. Know exactly what you'll earn each month and plan accordingly.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              className={`group p-8 rounded-3xl bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 hover:transform hover:scale-105 ${
                featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Creator-First Platform</h3>
              <p className="text-gray-300 leading-relaxed">
                We're built by creators, for creators. Enjoy fair fees, powerful tools, and a platform that actually understands your needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof - Tweets Section */}
      <div ref={tweetsRef} className="py-20 bg-gradient-to-r from-gray-900/30 to-purple-900/30">
        <div className="container mx-auto px-6">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              tweetsInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What creators are saying
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real stories from real creators who've transformed their passion into income
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {mockTweets.map((tweet, index) => (
              <TweetCard 
                key={tweet.id} 
                tweet={tweet} 
                delay={index * 150}
                inView={tweetsInView}
              />
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div ref={stepsRef} className="py-20">
        <div className="container mx-auto px-6">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple as 1, 2, 3
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Getting started is easier than brewing your morning chai
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div 
              className={`text-center transition-all duration-1000 ${
                stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold animate-bounce">1</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Create Your Page</h3>
              <p className="text-gray-300">
                Set up your creator profile in minutes. Tell your story, share your goals, and showcase what makes you special.
              </p>
            </div>

            {/* Step 2 */}
            <div 
              className={`text-center transition-all duration-1000 ${
                stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold animate-bounce" style={{ animationDelay: '0.5s' }}>2</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Share Your Work</h3>
              <p className="text-gray-300">
                Post exclusive content, behind-the-scenes updates, and connect with your community in meaningful ways.
              </p>
            </div>

            {/* Step 3 */}
            <div 
              className={`text-center transition-all duration-1000 ${
                stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold animate-bounce" style={{ animationDelay: '1s' }}>3</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Earn & Grow</h3>
              <p className="text-gray-300">
                Watch your community and income grow as more people discover and support your amazing work.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div ref={ctaRef} className="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div 
          className={`container mx-auto px-6 text-center transition-all duration-1000 ${
            ctaInView ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to turn your passion into income?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are already building sustainable businesses with their biggest fans.
          </p>
          <button className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-white font-bold text-xl transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:scale-105">
            <span className="flex items-center gap-3">
              Get Started for Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <p className="text-gray-400 mt-4">No setup fees • Cancel anytime • Keep what you earn</p>
        </div>
      </div>
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { Coffee, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const socialProviders = [
    {
      name: 'Google',
      action: () => signIn("google", { callbackUrl: "/dashboard" }),
      icon: 'https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/',
      bgColor: 'hover:bg-red-50 dark:hover:bg-red-900/20'
    },
    {
      name: 'GitHub',
      action: () => signIn("github", { callbackUrl: "/dashboard" }),
      icon: 'https://ucarecdn.com/be5b0ffd-85e8-4639-83a6-5162dfa15a16/',
      bgColor: 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
    },
    {
      name: 'LinkedIn',
      action: () => { },
      icon: 'https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'Twitter',
      action: () => { },
      icon: 'https://ucarecdn.com/82d7ca0a-c380-44c4-ba24-658723e2ab07/',
      bgColor: 'hover:bg-sky-50 dark:hover:bg-sky-900/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-pink-500/10 to-purple-600/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.02&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/&gt;%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                Buy Me a Chai
              </h1>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Welcome back!</h2>
            <p className="text-gray-300">Sign in to your creator account</p>
          </div>

          {/* Social Login */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {socialProviders.slice(0, 2).map((provider) => (
                <button
                  key={provider.name}
                  onClick={provider.action}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 ${provider.bgColor}`}
                >
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className={`w-5 h-5 ${provider.name === 'GitHub' ? 'filter dark:invert' : ''}`}
                  />
                  <span className="text-white text-sm font-medium">{provider.name}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {socialProviders.slice(2, 4).map((provider) => (
                <button
                  key={provider.name}
                  onClick={provider.action}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 ${provider.bgColor}`}
                >
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-5 h-5"
                  />
                  <span className="text-white text-sm font-medium">{provider.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-300 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <div className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors duration-200 hover:underline"
              >
                Forgot your password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={() =>
                signIn("credentials", {
                  email,
                  password,
                  callbackUrl: "/dashboard"
                })
              }
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-orange-400 hover:text-orange-300 transition-colors duration-200 font-medium hover:underline"
                
              >
                Sign up for free
              </a>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors hover:underline">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Join thousands of creators building sustainable income
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

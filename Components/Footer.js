import React from 'react'

const Footer = () => {
  return (
    <footer className='relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-2xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Animated Border */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse"></div>
      
      {/* Moving Dots Animation */}
      <div className="absolute top-2 left-0 w-full h-1 overflow-hidden">
        <div className="w-2 h-2 bg-amber-400 rounded-full absolute animate-ping" style={{
          animation: 'moveAcross 8s linear infinite'
        }}></div>
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full absolute animate-ping delay-2000" style={{
          animation: 'moveAcross 6s linear infinite 2s'
        }}></div>
        <div className="w-1 h-1 bg-pink-500 rounded-full absolute animate-ping delay-4000" style={{
          animation: 'moveAcross 10s linear infinite 4s'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row px-6 py-6 items-center justify-between gap-4">
        
        {/* Left Section - Brand */}
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <span className="text-white font-bold text-sm">☕</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-pulse"></div>
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Get me a Chai
          </span>
        </div>

        {/* Center Section - Copyright */}
        <div className="text-center">
          <p className="text-gray-300 font-medium tracking-wide group-hover:text-white transition-colors duration-300">
            Copyright &copy; Get me a Chai - 
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-semibold mx-1">
              Fund your Projects!
            </span> 
            All Rights Reserved
          </p>
          <div className="flex justify-center mt-2">
            <div className="h-0.5 w-0 bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 group-hover:w-32 rounded-full"></div>
          </div>
        </div>

        {/* Right Section - Social Links */}
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <button className="w-8 h-8 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            
            <button className="w-8 h-8 bg-gray-800 hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </button>
            
            <button className="w-8 h-8 bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
          </div>
          
          <div className="hidden md:block w-px h-6 bg-gray-600"></div>
          
          <div className="text-xs text-gray-400 hidden md:block">
            <span className="animate-pulse">❤️</span> Made with Love
          </div>
        </div>
      </div>

      {/* Bottom Wave Animation */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="w-full h-4" viewBox="0 0 400 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10C50 5 100 15 150 10C200 5 250 15 300 10C350 5 400 15 400 10V20H0V10Z" 
                fill="url(#gradient)" className="animate-pulse">
            <animate attributeName="d" 
                     values="M0 10C50 5 100 15 150 10C200 5 250 15 300 10C350 5 400 15 400 10V20H0V10Z;
                             M0 10C50 15 100 5 150 10C200 15 250 5 300 10C350 15 400 5 400 10V20H0V10Z;
                             M0 10C50 5 100 15 150 10C200 5 250 15 300 10C350 5 400 15 400 10V20H0V10Z" 
                     dur="4s" 
                     repeatCount="indefinite"/>
          </path>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(245, 158, 11)" stopOpacity="0.3"/>
              <stop offset="50%" stopColor="rgb(249, 115, 22)" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes moveAcross {
          0% {
            left: -10px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
        
        footer:hover .group-hover\\:w-32 {
          width: 8rem;
        }
      `}</style>
    </footer>
  )
}

export default Footer
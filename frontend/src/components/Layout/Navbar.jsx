import React from 'react'

const Navbar = ({ onRefresh }) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      window.location.reload()
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-slate-900 to-slate-800 shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title - responsive */}
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-bold text-white">
              Prediction Market
            </h1>
            <span className="hidden sm:inline ml-2 text-sm text-slate-300">
              • Matching Engine
            </span>
          </div>

          {/* Controls - responsive */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              </div>
              <span className="text-sm text-slate-300">Live</span>
            </div>
            
            {/* Divider */}
            <div className="hidden md:block h-6 w-px bg-slate-700"></div>
            
            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-200 text-sm md:text-base flex items-center space-x-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
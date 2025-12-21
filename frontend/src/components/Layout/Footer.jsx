import React from 'react'

const Footer = () => {
  return (
    <footer className="mt-12 pt-8 pb-6 bg-linear-to-b from-slate-900 to-slate-800 border-t border-slate-700 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-semibold text-lg">Prediction Market Matching Engine</p>
            <p className="text-sm text-slate-300 mt-2">In-memory order matching • Real-time trading</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">High Performance</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">Low Latency</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">Real-time</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60"></div>
              </div>
              <span className="text-sm font-medium text-slate-300">API Connected</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="text-sm">
                <span className="text-slate-400">Backend: </span>
                <span className="font-mono font-semibold text-white">localhost:8000</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="mt-6 pt-6 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Prediction Market Engine • Real-time financial simulations
          </p>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a>
            <span className="text-slate-600">•</span>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">API Docs</a>
            <span className="text-slate-600">•</span>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
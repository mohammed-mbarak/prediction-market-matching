import React from 'react'

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  className = '',
  variant = 'primary'
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
  
  const variants = {
    primary: disabled 
      ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:scale-[1.02] active:scale-[0.98]',
    secondary: disabled
      ? 'bg-slate-300 cursor-not-allowed text-slate-500'
      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700',
    outline: disabled
      ? 'bg-transparent border-2 border-slate-300 text-slate-400 cursor-not-allowed'
      : 'bg-transparent text-slate-700 border-2 border-emerald-500 hover:bg-emerald-50'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
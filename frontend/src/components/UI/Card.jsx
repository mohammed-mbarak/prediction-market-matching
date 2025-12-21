import React from 'react'

const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && (
        <div className="mb-6 pb-4 border-b border-gray-100">
          {typeof title === 'string' ? (
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          ) : (
            title
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
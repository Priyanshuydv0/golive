import React from 'react'

function Btn({ children, size = 'md', color = 'blue', className = '', ...props }) {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // Color classes
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300',
    green: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-300',
    red: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-300',
  }

  return (
    <button
      className={` cursor-pointer font-medium rounded-2xl ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Btn;
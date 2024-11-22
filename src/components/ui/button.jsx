import React from 'react';

export function Button({ children, variant = 'default', size = 'default', ...props }) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    ghost: 'bg-transparent hover:bg-gray-100',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizeClasses = {
    default: 'text-sm',
    icon: 'p-2',
  };

  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}


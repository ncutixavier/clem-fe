import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'medium', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-lg bg-white';
    
    const variantStyles = {
      default: '',
      bordered: 'border border-gray-200',
      elevated: 'shadow-md',
    };

    const paddingStyles = {
      none: '',
      small: 'p-3',
      medium: 'p-5',
      large: 'p-7',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card'; 
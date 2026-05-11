import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  hoverable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, className, children, ...props }, ref) => {
    const baseStyles = 'rounded-xl transition-all duration-200'

    const variants = {
      default: 'bg-white dark:bg-dark-800 shadow-soft',
      elevated: 'bg-white dark:bg-dark-800 shadow-lg',
      outlined: 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700',
    }

    const hoverStyles = hoverable ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''

    return (
      <div
        ref={ref}
        className={clsx(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card

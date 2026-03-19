import React from 'react';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'red' | 'blue' | 'green' | 'orange';
  showZero?: boolean;
}

export function NotificationBadge({ 
  count, 
  className = '', 
  size = 'medium',
  color = 'red',
  showZero = false
}: NotificationBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  const sizeClasses = {
    small: 'w-4 h-4 text-xs min-w-4',
    medium: 'w-5 h-5 text-xs min-w-5',
    large: 'w-6 h-6 text-sm min-w-6'
  };

  const colorClasses = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    orange: 'bg-orange-500 text-white'
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <div className={`
      ${sizeClasses[size]}
      ${colorClasses[color]}
      ${className}
      rounded-full flex items-center justify-center font-bold
      animate-pulse
    `}>
      {displayCount}
    </div>
  );
}

// Hook to use the notification badge in components
export function useNotificationBadge() {
  const [pulseKey, setPulseKey] = React.useState(0);

  const triggerPulse = React.useCallback(() => {
    setPulseKey(prev => prev + 1);
  }, []);

  return {
    pulseKey,
    triggerPulse,
    BadgeComponent: ({ count, ...props }: Omit<NotificationBadgeProps, 'className'>) => (
      <NotificationBadge 
        key={pulseKey}
        count={count}
        className="animate-bounce"
        {...props}
      />
    )
  };
}
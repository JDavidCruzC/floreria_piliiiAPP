
import React from 'react';

interface FloralIconProps {
  type: 'flower' | 'leaf' | 'heart' | 'cart' | 'chat';
  size?: number;
  className?: string;
}

const FloralIcon: React.FC<FloralIconProps> = ({ type, size = 24, className = "" }) => {
  const iconMap = {
    flower: "🌸",
    leaf: "🌿",
    heart: "💖",
    cart: "🛒",
    chat: "💬"
  };

  return (
    <span 
      className={`inline-block ${className}`} 
      style={{ fontSize: `${size}px` }}
    >
      {iconMap[type]}
    </span>
  );
};

export default FloralIcon;

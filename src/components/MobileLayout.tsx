
import React from 'react';
import { Link } from 'react-router-dom';
import FloralIcon from './FloralIcon';
import ChatFloatingButton from './ChatFloatingButton';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showCart?: boolean;
  cartCount?: number;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false, 
  backUrl = "/cliente", 
  showCart = false,
  cartCount = 0 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-floral-rose to-floral-cream w-full">
      {/* Container responsive */}
      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl relative">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-floral-rose-dark p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {showBackButton && (
              <Link to={backUrl} className="text-floral-pink hover:text-floral-pink-dark transition-colors">
                ← Volver
              </Link>
            )}
            
            {title && (
              <h1 className="text-lg lg:text-xl font-serif font-semibold text-gray-800 flex-1 text-center">
                {title}
              </h1>
            )}
            
            {!title && !showBackButton && (
              <div className="flex-1 text-center">
                <span className="text-2xl lg:text-3xl font-serif font-bold floral-text-gradient">
                  Florería Pili 🌸
                </span>
              </div>
            )}
            
            {showCart && (
              <Link to="/cliente/carrito" className="relative">
                <FloralIcon type="cart" size={24} className="text-floral-pink" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-floral-pink text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>

        {/* Content - Responsive container */}
        <div className="pb-20 lg:pb-8">
          <div className="lg:px-8 xl:px-12">
            {children}
          </div>
        </div>

        {/* Chat flotante con bot interno */}
        <ChatFloatingButton />
      </div>
    </div>
  );
};

export default MobileLayout;

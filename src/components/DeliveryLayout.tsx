
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DeliveryLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DeliveryLayout: React.FC<DeliveryLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-serif font-bold floral-text-gradient">
                🌸 Florería Pili - Delivery
              </h1>
              {title && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-600 font-medium">{title}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Carlos Mendez 👋
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/delivery")}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        Sistema de Delivery - Florería Pili © 2024
      </footer>
    </div>
  );
};

export default DeliveryLayout;

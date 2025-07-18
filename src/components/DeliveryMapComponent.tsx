
import React, { useEffect, useRef, useState } from 'react';

interface DeliveryMapComponentProps {
  destino: { lat: number; lng: number };
  ubicacionActual: { lat: number; lng: number } | null;
  viewOnly?: boolean;
}

const DeliveryMapComponent: React.FC<DeliveryMapComponentProps> = ({ 
  destino, 
  ubicacionActual,
  viewOnly = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapUrl, setMapUrl] = useState("");
  
  // Actualizar el mapa cuando cambia la ubicación
  useEffect(() => {
    if (ubicacionActual) {
      // Generar URL para mapa estático (simulado)
      // En una implementación real, usaríamos una biblioteca de mapas como Mapbox o Google Maps
      
      const zoom = 15;
      const width = 600;
      const height = 400;
      
      // Simulamos una URL de mapa usando un servicio de placeholder
      const baseUrl = "https://via.placeholder.com";
      
      // Crear un texto que simula información del mapa
      const mapInfo = `
        📍 Destino: ${destino.lat.toFixed(4)}, ${destino.lng.toFixed(4)}
        ${ubicacionActual ? `🚚 Ubicación actual: ${ubicacionActual.lat.toFixed(4)}, ${ubicacionActual.lng.toFixed(4)}` : ''}
        🔍 Zoom: ${zoom}
      `;
      
      // Color rosa para la florería
      const bgColor = "ffd6e6";
      const textColor = "333333";
      
      setMapUrl(`${baseUrl}/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(mapInfo)}`);
    }
  }, [destino, ubicacionActual]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
      {mapUrl ? (
        <>
          <img 
            src={mapUrl} 
            alt="Mapa de entrega" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 right-0 p-2 bg-white/80 text-sm text-center">
            Este es un mapa simulado. En una app real, aquí se mostraría un mapa interactivo.
          </div>
          {!viewOnly && (
            <div className="absolute bottom-4 right-4">
              <button className="bg-white p-2 rounded-full shadow-lg">
                <span className="block w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                  📍
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-4">
          <p className="text-gray-500">Cargando mapa...</p>
        </div>
      )}
      
      {/* Marcador de destino */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-floral-pink rounded-full flex items-center justify-center text-white animate-pulse">
          📍
        </div>
        <div className="text-xs bg-white px-2 py-0.5 rounded shadow-sm mt-1">
          Destino
        </div>
      </div>
      
      {/* Marcador de repartidor */}
      {ubicacionActual && (
        <div 
          className="absolute"
          style={{
            top: `${50 + (ubicacionActual.lat - destino.lat) * 1000}%`,
            left: `${50 + (ubicacionActual.lng - destino.lng) * 1000}%`,
          }}
        >
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
            🚚
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryMapComponent;

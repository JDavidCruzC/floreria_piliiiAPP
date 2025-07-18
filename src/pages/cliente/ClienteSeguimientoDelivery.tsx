
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/MobileLayout";
import DeliveryMapComponent from "@/components/DeliveryMapComponent";
import { MapPin, Phone, Clock, Truck } from "lucide-react";

// Datos simulados para la demostración
const pedidoInfo = {
  id: "FP-001234",
  direccion: "Av. Primavera 123, San Borja",
  repartidor: {
    nombre: "Carlos Mendez",
    telefono: "976543210",
    foto: "https://i.pravatar.cc/150?img=68"
  },
  estado: "en_camino", // en_preparacion, en_camino, entregado
  coordenadasDestino: { lat: -12.0942, lng: -77.0249 },
  coordenadasRepartidor: { lat: -12.0972, lng: -77.0279 }
};

const ClienteSeguimientoDelivery = () => {
  const [pedido] = useState(pedidoInfo);
  const [etaMinutos, setEtaMinutos] = useState(12);
  const [ubicacionRepartidor, setUbicacionRepartidor] = useState<{lat: number, lng: number}>(pedido.coordenadasRepartidor);

  // Simular el movimiento del repartidor
  useEffect(() => {
    if (pedido.estado === "en_camino") {
      const interval = setInterval(() => {
        setUbicacionRepartidor(prev => {
          // Calcular nueva posición acercándose al destino
          const newLat = prev.lat + (pedido.coordenadasDestino.lat - prev.lat) * 0.1;
          const newLng = prev.lng + (pedido.coordenadasDestino.lng - prev.lng) * 0.1;
          
          return { lat: newLat, lng: newLng };
        });

        setEtaMinutos(prev => Math.max(1, prev - 1));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [pedido.estado, pedido.coordenadasDestino]);

  const getEtaText = () => {
    if (pedido.estado === "en_preparacion") {
      return "Preparando tu pedido...";
    } else if (pedido.estado === "en_camino") {
      return `Llegará en aprox. ${etaMinutos} minutos`;
    } else {
      return "Pedido entregado";
    }
  };

  const getStatusStepClass = (step: string) => {
    const estados = ["en_preparacion", "en_camino", "entregado"];
    const currentIndex = estados.indexOf(pedido.estado);
    const stepIndex = estados.indexOf(step);
    
    if (stepIndex < currentIndex) {
      return "bg-floral-pink text-white";
    } else if (stepIndex === currentIndex) {
      return "bg-floral-pink text-white animate-pulse";
    } else {
      return "bg-gray-200 text-gray-400";
    }
  };

  return (
    <MobileLayout showBackButton title="Seguimiento de pedido">
      <div className="p-4 space-y-4">
        {/* Estado del pedido */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Pedido #{pedido.id}</span>
              <span className="text-sm font-medium text-floral-pink">{getEtaText()}</span>
            </div>
            
            {/* Timeline de estados */}
            <div className="relative flex justify-between items-center mb-4 px-2">
              <div className="absolute left-0 right-0 h-1 bg-gray-200 -z-10"></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${getStatusStepClass("en_preparacion")}`}>
                  <span className="text-xs">1</span>
                </div>
                <span className="text-xs text-gray-600">Preparación</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${getStatusStepClass("en_camino")}`}>
                  <span className="text-xs">2</span>
                </div>
                <span className="text-xs text-gray-600">En camino</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${getStatusStepClass("entregado")}`}>
                  <span className="text-xs">3</span>
                </div>
                <span className="text-xs text-gray-600">Entregado</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Mapa */}
        <div className="h-64 rounded-lg overflow-hidden shadow">
          <DeliveryMapComponent 
            destino={pedido.coordenadasDestino}
            ubicacionActual={ubicacionRepartidor}
            viewOnly
          />
        </div>
        
        {/* Información repartidor */}
        {pedido.estado === "en_camino" && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={pedido.repartidor.foto} alt="Repartidor" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{pedido.repartidor.nombre}</p>
                  <p className="text-sm text-gray-600">Tu repartidor</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${pedido.repartidor.telefono}`}>
                    <Phone size={16} className="mr-1" /> Llamar
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Detalles entrega */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start">
              <MapPin size={18} className="text-floral-pink mr-2 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Dirección de entrega</p>
                <p className="text-sm text-gray-600">{pedido.direccion}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock size={18} className="text-floral-pink mr-2 shrink-0" />
              <div>
                <p className="font-medium">Tiempo estimado</p>
                <p className="text-sm text-gray-600">{getEtaText()}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Truck size={18} className="text-floral-pink mr-2 shrink-0" />
              <div>
                <p className="font-medium">Método de entrega</p>
                <p className="text-sm text-gray-600">Delivery a domicilio</p>
              </div>
            </div>
            
            <div className="pt-2 mt-2 border-t border-gray-100">
              <Link to="/cliente/contacto">
                <Button variant="outline" className="w-full">
                  ¿Algún problema? Contáctanos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default ClienteSeguimientoDelivery;

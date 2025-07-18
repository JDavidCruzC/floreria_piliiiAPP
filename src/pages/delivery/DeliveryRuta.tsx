
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import DeliveryMapComponent from "@/components/DeliveryMapComponent";
import { MapPin, Phone, Navigation, CheckCircle, Clock, AlertTriangle } from "lucide-react";

// Datos de ejemplo para la demostración
const pedidoInfo = {
  id: "FP-001234",
  cliente: "María González",
  direccion: "Av. Primavera 123, San Borja",
  referencia: "Edificio gris, departamento 302",
  telefono: "987654321",
  items: "2x Ramo Rosas Rojas, 1x Caja Floral",
  coordenadas: { lat: -12.0942, lng: -77.0249 },
  hora: "15:30",
};

// Estados posibles del delivery
type EstadoEntrega = "en_ruta" | "llegada" | "entregado" | "problema";

const DeliveryRuta = () => {
  const { id } = useParams();
  const [estado, setEstado] = useState<EstadoEntrega>("en_ruta");
  const [ubicacionActual, setUbicacionActual] = useState<{ lat: number, lng: number } | null>(null);
  const [distanciaEstimada, setDistanciaEstimada] = useState("12 min");
  const [isWatchingLocation, setIsWatchingLocation] = useState(false);
  const [reasonSheetOpen, setReasonSheetOpen] = useState(false);
  const [problema, setProblema] = useState("");
  const [isMarking, setIsMarking] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Simulación de seguimiento de ubicación
  useEffect(() => {
    if (!isWatchingLocation) {
      // Simular ubicación inicial cercana al destino
      setUbicacionActual({ 
        lat: pedidoInfo.coordenadas.lat - 0.003,
        lng: pedidoInfo.coordenadas.lng - 0.002
      });
      setIsWatchingLocation(true);

      // Simular movimiento hacia el destino
      const interval = setInterval(() => {
        setUbicacionActual(prev => {
          if (!prev) return prev;
          
          // Calcular nueva posición acercándose al destino
          const newLat = prev.lat + (pedidoInfo.coordenadas.lat - prev.lat) * 0.1;
          const newLng = prev.lng + (pedidoInfo.coordenadas.lng - prev.lng) * 0.1;
          
          // Actualizar distancia estimada a medida que nos acercamos
          const distancia = Math.sqrt(
            Math.pow(pedidoInfo.coordenadas.lat - newLat, 2) + 
            Math.pow(pedidoInfo.coordenadas.lng - newLng, 2)
          ) * 111000; // Conversión aproximada a metros
          
          setDistanciaEstimada(`${Math.max(1, Math.round(distancia / 80))} min`);
          
          return { lat: newLat, lng: newLng };
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isWatchingLocation]);

  const marcarLlegada = () => {
    setIsMarking(true);
    setTimeout(() => {
      setEstado("llegada");
      toast({
        title: "✅ Llegada registrada",
        description: "Has llegado al punto de entrega",
      });
      setIsMarking(false);
    }, 1500);
  };

  const marcarEntregado = () => {
    setIsMarking(true);
    setTimeout(() => {
      setEstado("entregado");
      toast({
        title: "🎉 ¡Entrega exitosa!",
        description: "Has completado la entrega correctamente",
      });
      setIsMarking(false);
      
      // Redirigir después de un breve retraso
      setTimeout(() => navigate("/delivery/panel"), 2000);
    }, 1500);
  };

  const reportarProblema = (razon: string) => {
    setProblema(razon);
    setEstado("problema");
    setReasonSheetOpen(false);
    toast({
      title: "⚠️ Problema reportado",
      description: `Has reportado un problema: ${razon}`,
      variant: "destructive",
    });
  };

  const getEstadoBadge = () => {
    const config = {
      en_ruta: { color: "bg-blue-100 text-blue-800", text: "En Ruta" },
      llegada: { color: "bg-yellow-100 text-yellow-800", text: "En Punto de Entrega" },
      entregado: { color: "bg-green-100 text-green-800", text: "Entregado" },
      problema: { color: "bg-red-100 text-red-800", text: "Con Problema" },
    };
    
    return (
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${config[estado].color}`}>
        {config[estado].text}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <button 
            className="text-gray-600"
            onClick={() => navigate("/delivery/panel")}
          >
            ← Volver
          </button>
          <h1 className="font-serif font-semibold text-lg">
            Entrega en curso
          </h1>
          <div>{getEstadoBadge()}</div>
        </div>
      </header>
      
      {/* Map */}
      <div className="flex-1 relative">
        <DeliveryMapComponent 
          destino={pedidoInfo.coordenadas}
          ubicacionActual={ubicacionActual}
        />
      </div>
      
      {/* Panel de información */}
      <div className="bg-white border-t shadow-lg p-4">
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-md flex justify-between items-center">
              <span>Pedido {pedidoInfo.id}</span>
              <span className="text-floral-pink font-normal text-sm flex items-center">
                <Clock size={16} className="mr-1" /> ETA: {distanciaEstimada}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin size={18} className="text-floral-pink mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">{pedidoInfo.direccion}</p>
                  <p className="text-sm text-gray-600">{pedidoInfo.referencia}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone size={18} className="text-floral-pink mr-2" />
                <a href={`tel:${pedidoInfo.telefono}`} className="text-blue-600">
                  {pedidoInfo.telefono} ({pedidoInfo.cliente})
                </a>
              </div>
            </div>
            
            {estado === "en_ruta" && (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={marcarLlegada}
                disabled={isMarking}
              >
                <Navigation size={18} className="mr-2" />
                {isMarking ? "Registrando llegada..." : "He llegado al destino"}
              </Button>
            )}
            
            {estado === "llegada" && (
              <div className="space-y-2">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={marcarEntregado}
                  disabled={isMarking}
                >
                  <CheckCircle size={18} className="mr-2" />
                  {isMarking ? "Registrando entrega..." : "Confirmar entrega exitosa"}
                </Button>
                
                <Sheet open={reasonSheetOpen} onOpenChange={setReasonSheetOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <AlertTriangle size={18} className="mr-2" />
                      Reportar problema
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Reportar problema</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-2 mt-6">
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => reportarProblema("Cliente ausente")}
                      >
                        Cliente ausente
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => reportarProblema("Dirección incorrecta")}
                      >
                        Dirección incorrecta
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => reportarProblema("Producto dañado")}
                      >
                        Producto dañado
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => reportarProblema("Cliente rechaza pedido")}
                      >
                        Cliente rechaza pedido
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
            
            {estado === "problema" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-medium text-red-800">Problema reportado: {problema}</p>
                <p className="text-sm text-red-600 mt-1">
                  Un administrador revisará el caso y te contactará pronto.
                </p>
                <Button 
                  className="w-full mt-2 bg-red-600 hover:bg-red-700"
                  onClick={() => navigate("/delivery/panel")}
                >
                  Volver al panel
                </Button>
              </div>
            )}
            
            {estado === "entregado" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="font-medium text-green-800">¡Entrega exitosa!</p>
                <p className="text-sm text-green-600 mt-1">
                  Has completado esta entrega correctamente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryRuta;

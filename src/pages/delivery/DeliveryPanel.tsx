
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import DeliveryLayout from "@/components/DeliveryLayout";

// Datos de ejemplo de pedidos asignados al repartidor
const pedidosAsignados = [
  {
    id: "FP-001234",
    cliente: "María González",
    direccion: "Av. Primavera 123, San Borja",
    telefono: "987654321",
    items: "2x Ramo Rosas Rojas, 1x Caja Floral",
    estado: "en_camino",
    hora: "15:30",
    coordenadas: { lat: -12.0942, lng: -77.0249 }
  },
  {
    id: "FP-001237",
    cliente: "Luis Mendoza",
    direccion: "Calle Las Flores 789, Surco",
    telefono: "976543219",
    items: "1x Bouquet Primaveral",
    estado: "pendiente",
    hora: "16:15",
    coordenadas: { lat: -12.1135, lng: -76.9990 }
  },
  {
    id: "FP-001238",
    cliente: "Sofia Paz",
    direccion: "Av. Javier Prado 321, La Molina",
    telefono: "912345678",
    items: "1x Caja Girasoles, 1x Centro Mesa",
    estado: "pendiente",
    hora: "17:00",
    coordenadas: { lat: -12.0799, lng: -76.9517 }
  }
];

const DeliveryPanel = () => {
  const [pedidos, setPedidos] = useState(pedidosAsignados);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, { color: string, label: string }> = {
      pendiente: { color: "bg-yellow-100 text-yellow-800", label: "Pendiente" },
      en_camino: { color: "bg-blue-100 text-blue-800", label: "En Camino" },
      entregado: { color: "bg-green-100 text-green-800", label: "Entregado" },
      cancelado: { color: "bg-red-100 text-red-800", label: "Cancelado" }
    };
    
    return (
      <Badge className={config[estado]?.color || "bg-gray-100 text-gray-800"}>
        {config[estado]?.label || estado}
      </Badge>
    );
  };

  const iniciarRuta = (pedidoId: string) => {
    // Actualizar estado a "en_camino"
    setPedidos(prev => 
      prev.map(p => p.id === pedidoId ? { ...p, estado: "en_camino" } : p)
    );
    
    toast({
      title: "🚚 Ruta iniciada",
      description: `Has comenzado la entrega del pedido ${pedidoId}`,
    });
    
    // Navegar a la interfaz de ruta
    navigate(`/delivery/ruta/${pedidoId}`);
  };
  
  return (
    <DeliveryLayout title="Mis Entregas">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚚 Pedidos Asignados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-4">
              {pedidos.map((pedido) => (
                <Card key={pedido.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{pedido.cliente}</h3>
                        {getEstadoBadge(pedido.estado)}
                      </div>
                      
                      <div className="mt-2 text-sm space-y-1">
                        <p className="flex items-center gap-1">
                          <span className="text-floral-pink">📦</span>
                          <span className="font-mono">{pedido.id}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <span className="text-floral-pink">📍</span>
                          {pedido.direccion}
                        </p>
                        <p className="flex items-center gap-1">
                          <span className="text-floral-pink">📱</span>
                          {pedido.telefono}
                        </p>
                        <p className="flex items-center gap-1">
                          <span className="text-floral-pink">🕒</span>
                          Programado: {pedido.hora}
                        </p>
                      </div>
                      
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <p className="font-medium text-gray-700">Contenido:</p>
                        <p>{pedido.items}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 flex flex-col justify-center items-center md:w-40">
                      {pedido.estado === "pendiente" ? (
                        <Button 
                          className="bg-floral-pink hover:bg-floral-pink-dark w-full"
                          onClick={() => iniciarRuta(pedido.id)}
                        >
                          🚀 Iniciar Entrega
                        </Button>
                      ) : pedido.estado === "en_camino" ? (
                        <div className="text-center">
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 mb-2 w-full"
                            onClick={() => navigate(`/delivery/ruta/${pedido.id}`)}
                          >
                            🧭 Continuar
                          </Button>
                          <span className="text-xs text-blue-600">En proceso</span>
                        </div>
                      ) : (
                        <span className="text-green-600">✓ Completado</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {pedidos.length === 0 && (
                <div className="text-center p-6">
                  <div className="text-3xl mb-2">🎉</div>
                  <h3 className="text-lg font-medium text-gray-900">¡No tienes entregas pendientes!</h3>
                  <p className="text-gray-500">Todas las entregas han sido completadas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Estadísticas del día */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-2xl font-bold text-floral-pink">
                {pedidos.filter(p => p.estado === "entregado").length}
              </p>
              <p className="text-sm text-gray-600">Entregas Completadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🚚</div>
              <p className="text-2xl font-bold text-blue-600">
                {pedidos.filter(p => p.estado === "en_camino").length}
              </p>
              <p className="text-sm text-gray-600">En Camino</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">⏳</div>
              <p className="text-2xl font-bold text-yellow-600">
                {pedidos.filter(p => p.estado === "pendiente").length}
              </p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-2xl font-bold text-green-600">96%</p>
              <p className="text-sm text-gray-600">Satisfacción</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryPanel;

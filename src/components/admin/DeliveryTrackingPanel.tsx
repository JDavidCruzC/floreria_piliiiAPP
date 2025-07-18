
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

const DeliveryTrackingPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚚 Seguimiento de Delivery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Carlos Mendez</h3>
                  <p className="text-xs text-gray-600">Repartidor #001</p>
                </div>
              </div>
              <div className="text-sm space-y-1 mb-3">
                <p><span className="font-medium">Entregas hoy:</span> 3</p>
                <p><span className="font-medium">En ruta:</span> FP-001234</p>
                <p><span className="font-medium">Estado:</span> <span className="text-blue-600">Activo</span></p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">Ubicación</Button>
                <Button size="sm" variant="outline" className="flex-1">Llamar</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-2">📊</div>
              <p className="font-medium">Panel de Control de Repartidores</p>
              <Button className="mt-4 bg-floral-pink hover:bg-floral-pink-dark">
                Administrar Repartidores
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Estadísticas de Delivery</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tiempo promedio:</span>
                    <span className="font-medium">32 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Entregas a tiempo:</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Satisfacción:</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-floral-pink h-2.5 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTrackingPanel;

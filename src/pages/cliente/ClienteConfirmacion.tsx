
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MobileLayout from "@/components/MobileLayout";
import FloralIcon from "@/components/FloralIcon";

const ClienteConfirmacion = () => {
  const codigoPedido = "FP-" + Date.now().toString().slice(-6);
  const fechaEntrega = new Date();
  fechaEntrega.setDate(fechaEntrega.getDate() + 1);

  return (
    <MobileLayout title="¡Pedido Confirmado!">
      <div className="p-4 space-y-6">
        
        {/* Mensaje de éxito */}
        <div className="text-center space-y-4 animate-flower-bloom">
          <div className="text-8xl animate-gentle-sway">🌷</div>
          <h1 className="text-2xl font-serif font-bold floral-text-gradient">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-gray-600">
            Tu pedido ha sido confirmado y está siendo preparado con mucho amor.
          </p>
        </div>

        {/* Información del pedido */}
        <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-center flex items-center justify-center gap-2">
              <FloralIcon type="flower" size={24} />
              Pedido #{codigoPedido}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-floral-rose">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-floral-rose rounded-lg flex items-center justify-center">
                    <span className="text-xl">🌹</span>
                  </div>
                  <div>
                    <p className="font-semibold">2x Ramo de Rosas Rojas</p>
                    <p className="text-sm text-gray-600">S/. 45 c/u</p>
                  </div>
                </div>
                <span className="font-bold">S/. 90</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-floral-rose">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-floral-rose rounded-lg flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                  <div>
                    <p className="font-semibold">1x Caja Floral Elegante</p>
                    <p className="text-sm text-gray-600">S/. 65 c/u</p>
                  </div>
                </div>
                <span className="font-bold">S/. 65</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span>S/. 10</span>
              </div>
              
              <div className="border-t pt-3 flex justify-between font-bold text-xl">
                <span>Total Pagado:</span>
                <span className="text-floral-pink">S/. 165</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de entrega */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              🚚 Información de Entrega
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha estimada:</span>
                <span className="font-semibold">{fechaEntrega.toLocaleDateString('es-PE')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horario:</span>
                <span className="font-semibold">2:00 PM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dirección:</span>
                <span className="font-semibold text-right">Av. Primavera 123, San Borja</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado del pedido */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-3">📋 Estado del Pedido</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Pago confirmado ✅</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Pedido en preparación 🌸</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">En camino 🚚</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Entregado 🎉</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="space-y-3">
          <Link to="/cliente/catalogo">
            <Button className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white py-4 text-lg font-semibold rounded-xl">
              <FloralIcon type="flower" size={24} className="mr-2" />
              Seguir Comprando
            </Button>
          </Link>
          
          <Link to="/cliente">
            <Button variant="outline" className="w-full border-floral-green text-floral-green hover:bg-green-50 py-3">
              Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* Mensaje final */}
        <Card className="bg-gradient-to-r from-floral-rose to-floral-peach border-floral-rose-dark">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">💝</div>
            <p className="text-gray-800 font-medium mb-2">
              ¡Gracias por elegir Florería Pili!
            </p>
            <p className="text-sm text-gray-600">
              Tus flores están siendo preparadas con el cuidado y amor que se merecen.
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default ClienteConfirmacion;

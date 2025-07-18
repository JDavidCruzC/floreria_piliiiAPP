
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen floral-gradient">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-serif font-bold floral-text-gradient mb-4 animate-flower-bloom">
            🌸 Florería Pili
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema completo de gestión floral - Demo del proyecto académico
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="glass-effect hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-floral-pink flex items-center gap-2">
                📱 App para Clientes
              </CardTitle>
              <CardDescription>
                Experiencia móvil optimizada para realizar pedidos de manera rápida y sencilla
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Catálogo interactivo de productos</li>
                <li>• Carrito de compras intuitivo</li>
                <li>• Pago con QR y confirmación</li>
                <li>• Chat de ayuda integrado</li>
              </ul>
              <Link to="/cliente">
                <Button className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white">
                  Ver App Cliente 🌹
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-floral-green flex items-center gap-2">
                💻 Panel Administrativo
              </CardTitle>
              <CardDescription>
                Dashboard web completo para gestión de pedidos, productos e inventario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Gestión de pedidos en tiempo real</li>
                <li>• Control de inventario y productos</li>
                <li>• Reportes y estadísticas</li>
                <li>• Administración de usuarios</li>
              </ul>
              <Link to="/admin">
                <Button className="w-full bg-floral-green hover:bg-floral-green-light text-white">
                  Acceder al Panel 🌿
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-blue-600 flex items-center gap-2">
                🚚 App de Delivery
              </CardTitle>
              <CardDescription>
                Sistema móvil para repartidores con seguimiento GPS y gestión de rutas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Seguimiento GPS en tiempo real</li>
                <li>• Gestión optimizada de rutas</li>
                <li>• Confirmación de entregas</li>
                <li>• Comunicación con clientes</li>
              </ul>
              <Link to="/delivery">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  App Delivery 🚛
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 italic">
            "Haz florecer tus emociones con cada pedido" 🌸
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/MobileLayout";
import FloralIcon from "@/components/FloralIcon";

const ClienteInicio = () => {
  return (
    <MobileLayout>
      <div className="p-6 text-center space-y-8 lg:space-y-12">
        {/* Logo y bienvenida */}
        <div className="space-y-4 animate-flower-bloom">
          <div className="text-8xl lg:text-9xl animate-gentle-sway">🌸</div>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold floral-text-gradient">
            Florería Pili
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 font-medium">
            Haz florecer tus emociones 🌸
          </p>
        </div>

        {/* Imagen destacada */}
        <div className="rounded-2xl overflow-hidden shadow-lg animate-fade-in-up lg:max-w-2xl lg:mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop"
            alt="Flores hermosas"
            className="w-full h-48 lg:h-64 xl:h-80 object-cover"
          />
        </div>

        {/* Botones principales */}
        <div className="space-y-4 lg:space-y-6 lg:max-w-md lg:mx-auto">
          <Link to="/cliente/catalogo" className="block">
            <Button className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white py-4 lg:py-6 text-lg lg:text-xl font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <FloralIcon type="flower" size={24} className="mr-2" />
              Ver Productos
            </Button>
          </Link>
          
          <Link to="/cliente/carrito" className="block">
            <Button variant="outline" className="w-full border-floral-pink text-floral-pink hover:bg-floral-rose py-4 lg:py-6 text-lg lg:text-xl font-semibold rounded-xl">
              <FloralIcon type="cart" size={24} className="mr-2" />
              Mi Carrito
            </Button>
          </Link>
        </div>

        {/* Enlaces adicionales */}
        <div className="grid grid-cols-2 gap-4 mt-8 lg:max-w-md lg:mx-auto lg:gap-6">
          <Link to="/cliente/contacto">
            <Button variant="outline" className="w-full h-16 lg:h-20 flex flex-col items-center justify-center gap-1 border-floral-pink text-floral-pink hover:bg-floral-rose">
              <span className="text-xl lg:text-2xl">📞</span>
              <span className="text-sm lg:text-base">Contacto</span>
            </Button>
          </Link>
          
          <Link to="/cliente/reclamaciones">
            <Button variant="outline" className="w-full h-16 lg:h-20 flex flex-col items-center justify-center gap-1 border-floral-pink text-floral-pink hover:bg-floral-rose">
              <span className="text-xl lg:text-2xl">📋</span>
              <span className="text-sm lg:text-base">Reclamos</span>
            </Button>
          </Link>
        </div>

        {/* Características destacadas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 lg:max-w-4xl lg:mx-auto">
          <div className="bg-white/60 backdrop-blur-sm p-4 lg:p-6 rounded-xl text-center">
            <div className="text-2xl lg:text-3xl mb-2">🚚</div>
            <p className="text-sm lg:text-base font-medium text-gray-700">Delivery Rápido</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 lg:p-6 rounded-xl text-center">
            <div className="text-2xl lg:text-3xl mb-2">🎨</div>
            <p className="text-sm lg:text-base font-medium text-gray-700">Diseños Únicos</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 lg:p-6 rounded-xl text-center">
            <div className="text-2xl lg:text-3xl mb-2">🌱</div>
            <p className="text-sm lg:text-base font-medium text-gray-700">Flores Frescas</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 lg:p-6 rounded-xl text-center">
            <div className="text-2xl lg:text-3xl mb-2">💝</div>
            <p className="text-sm lg:text-base font-medium text-gray-700">Para Ocasiones Especiales</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ClienteInicio;

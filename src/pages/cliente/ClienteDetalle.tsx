
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MobileLayout from "@/components/MobileLayout";
import FloralIcon from "@/components/FloralIcon";
import { useToast } from "@/hooks/use-toast";

const productos = {
  "1": {
    id: 1,
    nombre: "Ramo de Rosas Rojas",
    precio: 45,
    descripcion: "Hermoso ramo de 12 rosas rojas frescas, perfectas para expresar amor y pasión. Incluye envoltorio elegante y tarjeta personalizada.",
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
    categoria: "ramos",
    disponible: true,
    personalizable: true
  },
  "2": {
    id: 2,
    nombre: "Ramo de Rosas Blancas",
    precio: 45,
    descripcion: "Elegante ramo de rosas blancas, símbolo de pureza y nuevos comienzos.",
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
    categoria: "ramos",
    disponible: true,
    personalizable: true
  },
  "3": {
    id: 3,
    nombre: "Amigurumi Personalizado",
    precio: 35,
    descripcion: "Adorable amigurumi tejido a mano, completamente personalizable en colores y diseño.",
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
    categoria: "amigurumis",
    disponible: true,
    personalizable: true
  }
};

const productosRelacionados = [
  {
    id: 2,
    nombre: "Ramo de Rosas Blancas",
    precio: 45,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop"
  },
  {
    id: 3,
    nombre: "Ramo Mixto",
    precio: 50,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop"
  }
];

const ClienteDetalle = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [cantidad, setCantidad] = useState(1);
  
  const producto = productos[id as keyof typeof productos];

  if (!producto) {
    return (
      <MobileLayout title="Producto no encontrado" showBackButton={true}>
        <div className="p-6 text-center">
          <div className="text-4xl mb-4">🌸</div>
          <p className="text-gray-600">El producto que buscas no existe</p>
          <Link to="/cliente/catalogo">
            <Button className="mt-4 bg-floral-pink hover:bg-floral-pink-dark text-white">
              Volver al Catálogo
            </Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  const handleAgregarCarrito = () => {
    toast({
      title: "¡Agregado al carrito! 🌸",
      description: `${cantidad} x ${producto.nombre}`,
    });
  };

  const aumentarCantidad = () => setCantidad(prev => prev + 1);
  const disminuirCantidad = () => setCantidad(prev => Math.max(1, prev - 1));

  return (
    <MobileLayout title={producto.nombre} showBackButton={true} backUrl="/cliente/catalogo" showCart={true} cartCount={2}>
      <div className="space-y-6">
        {/* Imagen principal */}
        <div className="aspect-square overflow-hidden">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Información del producto */}
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">
              {producto.nombre}
            </h1>
            <p className="text-3xl font-bold text-floral-pink mb-4">
              S/. {producto.precio}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {producto.descripcion}
            </p>
          </div>

          {/* Botón personalizar */}
          {producto.personalizable && (
            <Link to={`/cliente/personalizar/${producto.id}`}>
              <Button className="w-full bg-floral-green hover:bg-floral-green-light text-white mb-4 py-4 text-lg font-semibold rounded-xl shadow-lg">
                🎨 Personalizar este producto
              </Button>
            </Link>
          )}

          {/* Selector de cantidad */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-floral-rose-dark">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cantidad:
            </label>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={disminuirCantidad}
                className="w-10 h-10 rounded-full border-floral-pink text-floral-pink hover:bg-floral-rose"
              >
                -
              </Button>
              <span className="text-xl font-semibold w-12 text-center">
                {cantidad}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={aumentarCantidad}
                className="w-10 h-10 rounded-full border-floral-pink text-floral-pink hover:bg-floral-rose"
              >
                +
              </Button>
            </div>
          </div>

          {/* Botón agregar al carrito */}
          <Button
            onClick={handleAgregarCarrito}
            className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
            disabled={!producto.disponible}
          >
            <FloralIcon type="cart" size={24} className="mr-2" />
            {producto.disponible ? "Agregar al Carrito" : "No Disponible"}
          </Button>

          {/* Productos relacionados */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-gray-800 mb-4">
              También te podría gustar:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {productosRelacionados.map((item) => (
                <Card key={item.id} className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
                  <CardContent className="p-3">
                    <div className="aspect-square rounded-lg overflow-hidden mb-2">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                      {item.nombre}
                    </h4>
                    <p className="text-floral-pink font-bold text-sm">
                      S/. {item.precio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ClienteDetalle;

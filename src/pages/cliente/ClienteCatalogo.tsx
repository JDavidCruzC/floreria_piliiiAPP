
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MobileLayout from "@/components/MobileLayout";
import FloralIcon from "@/components/FloralIcon";

const productos = [
  {
    id: 1,
    nombre: "Ramo de Rosas Rojas",
    precio: 45,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    categoria: "ramos",
    personalizable: true
  },
  {
    id: 2,
    nombre: "Caja Floral Elegante",
    precio: 65,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    categoria: "cajas",
    personalizable: false
  },
  {
    id: 3,
    nombre: "Amigurumi Personalizado",
    precio: 35,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    categoria: "amigurumis",
    personalizable: true
  },
  {
    id: 4,
    nombre: "Bouquet Primaveral",
    precio: 35,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    categoria: "ramos",
    personalizable: true
  },
  {
    id: 5,
    nombre: "Caja de Girasoles",
    precio: 55,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    categoria: "cajas",
    personalizable: false
  },
  {
    id: 6,
    nombre: "Centro de Mesa",
    precio: 75,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    categoria: "personalizados",
    personalizable: true
  }
];

const categorias = [
  { id: "todos", nombre: "Todos", icon: "🌸" },
  { id: "ramos", nombre: "Ramos", icon: "💐" },
  { id: "cajas", nombre: "Cajas", icon: "📦" },
  { id: "amigurumis", nombre: "Amigurumis", icon: "🧸" },
  { id: "personalizados", nombre: "Personalizados", icon: "🎨" }
];

const ClienteCatalogo = () => {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = productos.filter(producto => {
    const cumpleCategoria = categoriaActiva === "todos" || producto.categoria === categoriaActiva;
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleCategoria && cumpleBusqueda;
  });

  return (
    <MobileLayout title="Nuestros Productos" showBackButton={true} showCart={true} cartCount={2}>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Banner de personalización */}
        <Link to="/cliente/personalizar-catalogo">
          <Card className="bg-gradient-to-r from-floral-pink to-floral-pink-dark text-white hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="text-3xl lg:text-4xl mb-2">✨🎨✨</div>
              <h3 className="font-serif font-bold text-lg lg:text-xl">¡Crea Algo Único!</h3>
              <p className="text-sm lg:text-base opacity-90">Personaliza ramos y amigurumis a tu gusto</p>
              <Button 
                variant="outline" 
                className="mt-3 bg-white text-floral-pink border-white hover:bg-gray-50"
                size="sm"
              >
                Personalizar Ahora
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Buscador */}
        <div className="relative lg:max-w-md lg:mx-auto">
          <Input
            placeholder="Buscar flores..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-floral-rose-dark rounded-xl text-base lg:text-lg py-3"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>

        {/* Filtros de categoría */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:justify-center lg:flex-wrap lg:overflow-visible">
          {categorias.map((categoria) => (
            <Button
              key={categoria.id}
              variant={categoriaActiva === categoria.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoriaActiva(categoria.id)}
              className={`whitespace-nowrap lg:text-base lg:px-6 lg:py-3 ${
                categoriaActiva === categoria.id
                  ? "bg-floral-pink text-white"
                  : "bg-white/80 text-gray-700 border-floral-rose-dark"
              }`}
            >
              {categoria.icon} {categoria.nombre}
            </Button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {productosFiltrados.map((producto) => (
            <Card key={producto.id} className="bg-white/80 backdrop-blur-sm border-floral-rose-dark hover:shadow-lg transition-all duration-300 animate-fade-in-up">
              <CardContent className="p-3 lg:p-4">
                <div className="aspect-square rounded-lg overflow-hidden mb-3 relative">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {producto.personalizable && (
                    <div className="absolute top-2 right-2 bg-floral-green text-white text-xs px-2 py-1 rounded-full">
                      🎨 Personalizable
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm lg:text-base text-gray-800 mb-2 line-clamp-2">
                  {producto.nombre}
                </h3>
                <p className="text-floral-pink font-bold text-lg lg:text-xl mb-3">
                  S/. {producto.precio}
                </p>
                <div className="space-y-2">
                  <Link to={`/cliente/producto/${producto.id}`} className="block">
                    <Button size="sm" className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white lg:text-base lg:py-2">
                      <FloralIcon type="flower" size={16} className="mr-1" />
                      Ver Detalles
                    </Button>
                  </Link>
                  {producto.personalizable && (
                    <Link to={`/cliente/personalizar-avanzado/${producto.categoria}`} className="block">
                      <Button size="sm" variant="outline" className="w-full border-floral-green text-floral-green hover:bg-floral-green hover:text-white lg:text-base lg:py-2">
                        🎨 Personalizar
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-8 lg:py-16">
            <div className="text-4xl lg:text-6xl mb-4">🌸</div>
            <p className="text-gray-600 lg:text-lg">No se encontraron productos</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default ClienteCatalogo;

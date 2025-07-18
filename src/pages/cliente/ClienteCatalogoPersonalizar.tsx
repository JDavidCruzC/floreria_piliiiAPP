
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MobileLayout from "@/components/MobileLayout";

const categoriasPersonalizacion = [
  {
    id: "ramos",
    nombre: "Ramos Personalizados",
    descripcion: "Crea tu ramo perfecto eligiendo flores, colores, tamaño y más",
    emoji: "🌸",
    color: "from-pink-100 to-rose-200",
    items: [
      "Más de 10 tipos de flores",
      "Colores personalizables", 
      "5 tamaños diferentes",
      "Materiales premium",
      "Cintas decorativas"
    ]
  },
  {
    id: "amigurumis", 
    nombre: "Amigurumis Únicos",
    descripcion: "Diseña tu amigurumi ideal con colores, tamaños y accesorios",
    emoji: "🧸",
    color: "from-blue-100 to-purple-200", 
    items: [
      "6+ tipos de animales",
      "8 colores disponibles",
      "5 tamaños diferentes", 
      "Accesorios decorativos",
      "Rellenos premium"
    ]
  }
];

const ClienteCatalogoPersonalizar = () => {
  return (
    <MobileLayout 
      title="Personaliza Tu Producto" 
      showBackButton={true} 
      backUrl="/cliente"
      showCart={true} 
      cartCount={2}
    >
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 bg-gradient-to-r from-floral-rose to-floral-cream rounded-xl p-6">
          <h1 className="text-2xl font-serif font-bold text-gray-800">
            ✨ Crea Algo Único ✨
          </h1>
          <p className="text-gray-600">
            Diseña productos totalmente personalizados según tus gustos
          </p>
        </div>

        {/* Categorías de personalización */}
        <div className="space-y-4">
          {categoriasPersonalizacion.map((categoria) => (
            <Card 
              key={categoria.id} 
              className={`bg-gradient-to-br ${categoria.color} border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Emoji grande */}
                  <div className="text-5xl">
                    {categoria.emoji}
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-gray-800">
                        {categoria.nombre}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {categoria.descripcion}
                      </p>
                    </div>
                    
                    {/* Lista de características */}
                    <div className="space-y-1">
                      {categoria.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-floral-green">✓</span>
                          {item}
                        </div>
                      ))}
                    </div>
                    
                    {/* Botón de acción */}
                    <Link to={`/cliente/personalizar-avanzado/${categoria.id}`}>
                      <Button 
                        className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        🎨 Personalizar {categoria.nombre.split(' ')[0]}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-lg font-serif font-semibold text-gray-800">
              💡 ¿Cómo funciona?
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="bg-floral-pink text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                <span>Elige el tipo de producto que quieres personalizar</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-floral-pink text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                <span>Selecciona colores, tamaños y características</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-floral-pink text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                <span>Ve una vista previa en tiempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-floral-pink text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                <span>Agrega al carrito y recibe tu producto único</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to action */}
        <div className="text-center space-y-3 pb-6">
          <p className="text-sm text-gray-600">
            🕐 Tiempo de elaboración: 3-15 días según personalización
          </p>
          <Link to="/cliente/catalogo">
            <Button variant="outline" className="border-floral-pink text-floral-pink hover:bg-floral-rose">
              Ver Catálogo Regular
            </Button>
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ClienteCatalogoPersonalizar;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import MobileLayout from "@/components/MobileLayout";
import FloralIcon from "@/components/FloralIcon";

const itemsCarrito = [
  {
    id: 1,
    nombre: "Ramo de Rosas Rojas",
    precio: 45,
    cantidad: 2,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    nombre: "Caja Floral Elegante",
    precio: 65,
    cantidad: 1,
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop"
  }
];

const ClienteCarrito = () => {
  const [items, setItems] = useState(itemsCarrito);
  const [direccion, setDireccion] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("delivery");

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, cantidad: Math.max(0, nuevaCantidad) }
        : item
    ).filter(item => item.cantidad > 0));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const delivery = tipoEntrega === "delivery" ? 10 : 0;
  const total = subtotal + delivery;

  return (
    <MobileLayout title="Mi Carrito" showBackButton={true} backUrl="/cliente/catalogo">
      <div className="p-4 lg:p-8 space-y-6">
        <div className="lg:max-w-2xl lg:mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-16 lg:py-24">
              <div className="text-6xl lg:text-8xl mb-4">🛒</div>
              <h3 className="text-xl lg:text-2xl font-serif font-semibold text-gray-800 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-600 lg:text-lg mb-6">
                ¡Agrega algunas flores hermosas!
              </p>
              <Link to="/cliente/catalogo">
                <Button className="bg-floral-pink hover:bg-floral-pink-dark text-white lg:text-lg lg:px-8 lg:py-4">
                  <FloralIcon type="flower" size={20} className="mr-2" />
                  Ver Productos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Items del carrito */}
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex gap-3 lg:gap-4">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-1 truncate lg:text-lg">
                            {item.nombre}
                          </h3>
                          <p className="text-floral-pink font-bold mb-2 lg:text-xl">
                            S/. {item.precio}
                          </p>
                          <div className="flex items-center gap-2 lg:gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-floral-pink text-floral-pink"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-semibold lg:text-lg">
                              {item.cantidad}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-floral-pink text-floral-pink"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 lg:text-lg">
                            S/. {item.precio * item.cantidad}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tipo de entrega */}
              <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
                <CardContent className="p-4 lg:p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 lg:text-lg">Tipo de Entrega:</h3>
                  <RadioGroup value={tipoEntrega} onValueChange={setTipoEntrega}>
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 lg:text-base">
                        🚚 Delivery (+S/. 10)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <RadioGroupItem value="retiro" id="retiro" />
                      <Label htmlFor="retiro" className="flex-1 lg:text-base">
                        🏪 Retiro en local (Gratis)
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Dirección si es delivery */}
              {tipoEntrega === "delivery" && (
                <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
                  <CardContent className="p-4 lg:p-6">
                    <Label htmlFor="direccion" className="block font-semibold text-gray-800 mb-2 lg:text-lg">
                      📍 Dirección de entrega:
                    </Label>
                    <Input
                      id="direccion"
                      placeholder="Ingresa tu dirección completa..."
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      className="bg-white border-floral-rose-dark lg:text-base lg:py-3"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Resumen de pedido */}
              <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
                <CardContent className="p-4 lg:p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 lg:text-lg">Resumen del Pedido:</h3>
                  <div className="space-y-2 lg:text-base">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>S/. {subtotal}</span>
                    </div>
                    {delivery > 0 && (
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span>S/. {delivery}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg lg:text-xl">
                      <span>Total:</span>
                      <span className="text-floral-pink">S/. {total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botón confirmar pedido */}
              <Link to="/cliente/pago">
                <Button 
                  className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white py-4 lg:py-6 text-lg lg:text-xl font-semibold rounded-xl shadow-lg"
                  disabled={tipoEntrega === "delivery" && !direccion.trim()}
                >
                  <FloralIcon type="heart" size={24} className="mr-2" />
                  Confirmar Pedido (S/. {total})
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default ClienteCarrito;

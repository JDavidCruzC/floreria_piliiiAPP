
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileLayout from "@/components/MobileLayout";
import { useToast } from "@/hooks/use-toast";

const opcionesPersonalizacion = {
  ramos: {
    flores: [
      { id: "rosas", nombre: "Rosas", precio: 0, colores: ["Rojas", "Blancas", "Rosadas", "Amarillas"], emoji: "🌹" },
      { id: "girasoles", nombre: "Girasoles", precio: 5, colores: ["Amarillo"], emoji: "🌻" },
      { id: "tulipanes", nombre: "Tulipanes", precio: 8, colores: ["Rojos", "Blancos", "Morados", "Amarillos"], emoji: "🌷" },
      { id: "lirios", nombre: "Lirios", precio: 10, colores: ["Blancos", "Rosados", "Naranjas"], emoji: "🏵️" }
    ],
    cintas: [
      { id: "satin", nombre: "Satín", precio: 0, colores: ["Dorado", "Plateado", "Rojo", "Blanco"], style: "solid" },
      { id: "organza", nombre: "Organza", precio: 3, colores: ["Transparente", "Dorado", "Plateado"], style: "dotted" },
      { id: "encaje", nombre: "Encaje", precio: 5, colores: ["Blanco", "Crema", "Dorado"], style: "dashed" }
    ],
    envoltorio: [
      { id: "papel", nombre: "Papel Kraft", precio: 0, color: "#D2B48C" },
      { id: "celofan", nombre: "Celofán", precio: 2, color: "#E6E6FA" },
      { id: "tela", nombre: "Tela Premium", precio: 8, color: "#F5F5DC" }
    ],
    tamaños: [
      { id: "pequeño", nombre: "Pequeño (6-8 flores)", precio: 0, cantidad: 6 },
      { id: "mediano", nombre: "Mediano (10-12 flores)", precio: 10, cantidad: 10 },
      { id: "grande", nombre: "Grande (15-18 flores)", precio: 20, cantidad: 15 }
    ]
  },
  amigurumis: {
    tipos: [
      { id: "oso", nombre: "Osito", precio: 0, emoji: "🧸" },
      { id: "conejo", nombre: "Conejito", precio: 0, emoji: "🐰" },
      { id: "gato", nombre: "Gatito", precio: 0, emoji: "🐱" },
      { id: "unicornio", nombre: "Unicornio", precio: 5, emoji: "🦄" }
    ],
    colores: [
      { id: "rosa", nombre: "Rosa", precio: 0, hex: "#FFB6C1" },
      { id: "azul", nombre: "Azul", precio: 0, hex: "#87CEEB" },
      { id: "blanco", nombre: "Blanco", precio: 0, hex: "#FFFFFF" },
      { id: "multicolor", nombre: "Multicolor", precio: 3, hex: "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A)" }
    ],
    tamaños: [
      { id: "mini", nombre: "Mini (10cm)", precio: 0, scale: 0.7 },
      { id: "mediano", nombre: "Mediano (20cm)", precio: 8, scale: 1 },
      { id: "grande", nombre: "Grande (30cm)", precio: 15, scale: 1.3 }
    ],
    accesorios: [
      { id: "lazos", nombre: "Lazos", precio: 2, emoji: "🎀" },
      { id: "sombrero", nombre: "Sombrerito", precio: 3, emoji: "🎩" },
      { id: "ropa", nombre: "Ropita", precio: 5, emoji: "👕" }
    ]
  }
};

const ClientePersonalizar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [personalizacion, setPersonalizacion] = useState({
    // Para ramos
    flor: "",
    colorFlor: "",
    cinta: "",
    colorCinta: "",
    envoltorio: "",
    tamaño: "",
    // Para amigurumis
    tipo: "",
    color: "",
    accesorios: [] as string[],
    // Común
    dedicatoria: "",
    mensaje: "",
    cantidad: 1
  });

  const [precioBase] = useState(45);
  const [precioAdicional, setPrecioAdicional] = useState(0);

  const categoria = id === "1" || id === "2" ? "ramos" : "amigurumis";

  // Simulador visual del ramo
  const SimuladorRamo = () => {
    const florSeleccionada = opcionesPersonalizacion.ramos.flores.find(f => f.id === personalizacion.flor);
    const tamañoSeleccionado = opcionesPersonalizacion.ramos.tamaños.find(t => t.id === personalizacion.tamaño);
    const envolturioSeleccionado = opcionesPersonalizacion.ramos.envoltorio.find(e => e.id === personalizacion.envoltorio);
    const cintaSeleccionada = opcionesPersonalizacion.ramos.cintas.find(c => c.id === personalizacion.cinta);

    const cantidadFlores = tamañoSeleccionado?.cantidad || 6;

    return (
      <div className="relative w-full h-64 flex items-end justify-center">
        {/* Envoltorio de fondo */}
        {envolturioSeleccionado && (
          <div 
            className="absolute bottom-0 w-32 h-20 rounded-t-3xl opacity-80"
            style={{ backgroundColor: envolturioSeleccionado.color }}
          />
        )}
        
        {/* Flores */}
        <div className="relative flex flex-wrap justify-center items-end gap-1 max-w-40">
          {Array.from({ length: cantidadFlores }).map((_, i) => (
            <div
              key={i}
              className="text-2xl transform"
              style={{
                transform: `rotate(${(i - cantidadFlores / 2) * 15}deg) translateY(${Math.random() * 10}px)`,
                zIndex: cantidadFlores - i
              }}
            >
              {florSeleccionada?.emoji || "🌸"}
            </div>
          ))}
        </div>

        {/* Cinta */}
        {cintaSeleccionada && (
          <div className="absolute bottom-6 w-24 h-1 bg-yellow-400 rounded" 
               style={{ 
                 backgroundColor: personalizacion.colorCinta === "Dorado" ? "#FFD700" :
                                 personalizacion.colorCinta === "Plateado" ? "#C0C0C0" :
                                 personalizacion.colorCinta === "Rojo" ? "#FF0000" : "#FFFFFF",
                 borderStyle: cintaSeleccionada.style 
               }}
          />
        )}

        {/* Dedicatoria flotante */}
        {personalizacion.dedicatoria && (
          <div className="absolute -top-8 text-xs bg-white/90 px-2 py-1 rounded shadow text-pink-600">
            Para: {personalizacion.dedicatoria}
          </div>
        )}
      </div>
    );
  };

  // Simulador visual del amigurumi
  const SimuladorAmigurumi = () => {
    const tipoSeleccionado = opcionesPersonalizacion.amigurumis.tipos.find(t => t.id === personalizacion.tipo);
    const colorSeleccionado = opcionesPersonalizacion.amigurumis.colores.find(c => c.id === personalizacion.color);
    const tamañoSeleccionado = opcionesPersonalizacion.amigurumis.tamaños.find(t => t.id === personalizacion.tamaño);

    return (
      <div className="relative w-full h-64 flex items-center justify-center">
        {/* Amigurumi principal */}
        <div 
          className="relative flex flex-col items-center"
          style={{ 
            transform: `scale(${tamañoSeleccionado?.scale || 1})`,
            filter: colorSeleccionado?.id === "multicolor" ? "hue-rotate(45deg)" : "none"
          }}
        >
          {/* Cuerpo del amigurumi */}
          <div 
            className="w-20 h-20 rounded-full border-4 border-gray-300 flex items-center justify-center text-4xl relative"
            style={{ 
              background: colorSeleccionado?.id === "multicolor" 
                ? colorSeleccionado.hex 
                : colorSeleccionado?.hex || "#FFB6C1"
            }}
          >
            {tipoSeleccionado?.emoji || "🧸"}
            
            {/* Accesorios */}
            <div className="absolute -top-2 -right-2 flex flex-col gap-1">
              {personalizacion.accesorios.map((accId) => {
                const accesorio = opcionesPersonalizacion.amigurumis.accesorios.find(a => a.id === accId);
                return (
                  <span key={accId} className="text-lg">
                    {accesorio?.emoji}
                  </span>
                );
              })}
            </div>
          </div>
          
          {/* Tamaño indicativo */}
          <div className="text-xs text-gray-500 mt-2">
            {tamañoSeleccionado?.nombre.split('(')[1]?.split(')')[0] || "Tamaño"}
          </div>
        </div>

        {/* Dedicatoria flotante */}
        {personalizacion.dedicatoria && (
          <div className="absolute top-4 text-xs bg-white/90 px-2 py-1 rounded shadow text-pink-600">
            Para: {personalizacion.dedicatoria}
          </div>
        )}
      </div>
    );
  };

  const calcularPrecio = () => {
    let adicional = 0;
    
    if (categoria === "ramos") {
      const flor = opcionesPersonalizacion.ramos.flores.find(f => f.id === personalizacion.flor);
      const cinta = opcionesPersonalizacion.ramos.cintas.find(c => c.id === personalizacion.cinta);
      const envoltorio = opcionesPersonalizacion.ramos.envoltorio.find(e => e.id === personalizacion.envoltorio);
      const tamaño = opcionesPersonalizacion.ramos.tamaños.find(t => t.id === personalizacion.tamaño);
      
      adicional += (flor?.precio || 0) + (cinta?.precio || 0) + (envoltorio?.precio || 0) + (tamaño?.precio || 0);
    } else {
      const tipo = opcionesPersonalizacion.amigurumis.tipos.find(t => t.id === personalizacion.tipo);
      const color = opcionesPersonalizacion.amigurumis.colores.find(c => c.id === personalizacion.color);
      const tamaño = opcionesPersonalizacion.amigurumis.tamaños.find(t => t.id === personalizacion.tamaño);
      
      adicional += (tipo?.precio || 0) + (color?.precio || 0) + (tamaño?.precio || 0);
      
      // Accesorios
      personalizacion.accesorios.forEach(accId => {
        const acc = opcionesPersonalizacion.amigurumis.accesorios.find(a => a.id === accId);
        adicional += acc?.precio || 0;
      });
    }
    
    setPrecioAdicional(adicional);
    return precioBase + adicional;
  };

  useEffect(() => {
    calcularPrecio();
  }, [personalizacion]);

  const handleAccesorioChange = (accId: string, checked: boolean) => {
    setPersonalizacion(prev => ({
      ...prev,
      accesorios: checked 
        ? [...prev.accesorios, accId]
        : prev.accesorios.filter(id => id !== accId)
    }));
  };

  const handleConfirmar = () => {
    toast({
      title: "¡Personalización guardada! 🎨",
      description: `Precio total: S/. ${calcularPrecio() * personalizacion.cantidad}`,
    });
    navigate("/cliente/carrito");
  };

  return (
    <MobileLayout 
      title="Personalizar Producto" 
      showBackButton={true} 
      backUrl={`/cliente/producto/${id}`}
      showCart={true} 
      cartCount={2}
    >
      <div className="p-4 space-y-6">
        {/* Vista previa MEJORADA del producto */}
        <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-serif text-floral-pink">
              🎨 Vista Previa en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-b from-sky-100 to-floral-rose rounded-lg mb-4 min-h-64">
              {categoria === "ramos" ? <SimuladorRamo /> : <SimuladorAmigurumi />}
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-floral-pink">
                S/. {calcularPrecio() * personalizacion.cantidad}
              </p>
              {precioAdicional > 0 && (
                <p className="text-sm text-gray-600">
                  (Base: S/. {precioBase} + Extras: S/. {precioAdicional})
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Opciones de personalización para Ramos */}
        {categoria === "ramos" && (
          <>
            {/* Tipo de flor */}
            <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base">Tipo de Flor 🌸</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.flor} 
                  onValueChange={(value) => {
                    setPersonalizacion(prev => ({ ...prev, flor: value, colorFlor: "" }));
                  }}
                >
                  {opcionesPersonalizacion.ramos.flores.map((flor) => (
                    <div key={flor.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={flor.id} id={flor.id} />
                      <Label htmlFor={flor.id} className="flex-1 flex items-center gap-2">
                        <span className="text-lg">{flor.emoji}</span>
                        {flor.nombre} {flor.precio > 0 && `(+S/. ${flor.precio})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Color de flor */}
            {personalizacion.flor && (
              <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
                <CardHeader>
                  <CardTitle className="text-base">Color de Flor 🎨</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={personalizacion.colorFlor} onValueChange={(value) => {
                    setPersonalizacion(prev => ({ ...prev, colorFlor: value }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un color" />
                    </SelectTrigger>
                    <SelectContent>
                      {opcionesPersonalizacion.ramos.flores
                        .find(f => f.id === personalizacion.flor)?.colores
                        .map((color) => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Tamaño */}
            <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base">Tamaño del Ramo 📏</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.tamaño} 
                  onValueChange={(value) => {
                    setPersonalizacion(prev => ({ ...prev, tamaño: value }));
                  }}
                >
                  {opcionesPersonalizacion.ramos.tamaños.map((tamaño) => (
                    <div key={tamaño.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={tamaño.id} id={tamaño.id} />
                      <Label htmlFor={tamaño.id} className="flex-1">
                        {tamaño.nombre} {tamaño.precio > 0 && `(+S/. ${tamaño.precio})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Tipo de cinta */}
            <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base">Cinta 🎀</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.cinta} 
                  onValueChange={(value) => {
                    setPersonalizacion(prev => ({ ...prev, cinta: value, colorCinta: "" }));
                  }}
                >
                  {opcionesPersonalizacion.ramos.cintas.map((cinta) => (
                    <div key={cinta.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={cinta.id} id={cinta.id} />
                      <Label htmlFor={cinta.id} className="flex-1">
                        {cinta.nombre} {cinta.precio > 0 && `(+S/. ${cinta.precio})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Color de cinta */}
            {personalizacion.cinta && (
              <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
                <CardHeader>
                  <CardTitle className="text-base">Color de Cinta</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={personalizacion.colorCinta} onValueChange={(value) => {
                    setPersonalizacion(prev => ({ ...prev, colorCinta: value }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un color" />
                    </SelectTrigger>
                    <SelectContent>
                      {opcionesPersonalizacion.ramos.cintas
                        .find(c => c.id === personalizacion.cinta)?.colores
                        .map((color) => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Envoltorio */}
            <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base">Envoltorio 📦</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.envoltorio} 
                  onValueChange={(value) => {
                    setPersonalizacion(prev => ({ ...prev, envoltorio: value }));
                  }}
                >
                  {opcionesPersonalizacion.ramos.envoltorio.map((env) => (
                    <div key={env.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={env.id} id={env.id} />
                      <Label htmlFor={env.id} className="flex-1">
                        {env.nombre} {env.precio > 0 && `(+S/. ${env.precio})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </>
        )}

        {/* Opciones de personalización para Amigurumis */}
        {categoria === "amigurumis" && (
          <>
            {/* Tipo de amigurumi */}
            <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base">Tipo de Amigurumi 🧸</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.tipo} 
                  onValueChange={(value) => {
                    setPersonalizacion(prev => ({ ...prev, tipo: value }));
                  }}
                >
                  {opcionesPersonalizacion.amigurumis.tipos.map((tipo) => (
                    <div key={tipo.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={tipo.id} id={tipo.id} />
                      <Label htmlFor={tipo.id} className="flex-1 flex items-center gap-2">
                        <span className="text-lg">{tipo.emoji}</span>
                        {tipo.nombre} {tipo.precio > 0 && `(+S/. ${tipo.precio})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Color principal */}
            <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base">Color Principal 🎨</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.color} 
                  onValueChange={(value) => {
                    setPersonalizacion(prev => ({ ...prev, color: value }));
                  }}
                >
                  {opcionesPersonalizacion.amigurumis.colores.map((color) => (
                    <div key={color.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.id} id={color.id} />
                      <Label htmlFor={color.id} className="flex-1 flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ background: color.hex }}
                        />
                        {color.nombre} {color.precio > 0 && `(+S/. ${color.precio})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Tamaño amigurumi */}
            <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base">Tamaño 📏</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.tamaño} 
                  onValueChange={(value) => {
                    setPersonalizacion(prev => ({ ...prev, tamaño: value }));
                  }}
                >
                  {opcionesPersonalizacion.amigurumis.tamaños.map((tamaño) => (
                    <div key={tamaño.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={tamaño.id} id={tamaño.id} />
                      <Label htmlFor={tamaño.id} className="flex-1">
                        {tamaño.nombre} {tamaño.precio > 0 && `(+S/. ${tamaño.precio})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Accesorios */}
            <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base">Accesorios (opcional) ✨</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {opcionesPersonalizacion.amigurumis.accesorios.map((acc) => (
                  <div key={acc.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={acc.id}
                      checked={personalizacion.accesorios.includes(acc.id)}
                      onChange={(e) => handleAccesorioChange(acc.id, e.target.checked)}
                      className="rounded border-floral-pink"
                    />
                    <Label htmlFor={acc.id} className="flex-1 flex items-center gap-2">
                      <span className="text-lg">{acc.emoji}</span>
                      {acc.nombre} (+S/. {acc.precio})
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Dedicatoria */}
        <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
          <CardHeader>
            <CardTitle className="text-base">Dedicatoria 💌</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dedicatoria">Para:</Label>
              <Input
                id="dedicatoria"
                placeholder="Nombre de la persona"
                value={personalizacion.dedicatoria}
                onChange={(e) => setPersonalizacion(prev => ({ ...prev, dedicatoria: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="mensaje">Mensaje:</Label>
              <Textarea
                id="mensaje"
                placeholder="Escribe tu mensaje personalizado..."
                value={personalizacion.mensaje}
                onChange={(e) => setPersonalizacion(prev => ({ ...prev, mensaje: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cantidad */}
        <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
          <CardHeader>
            <CardTitle className="text-base">Cantidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPersonalizacion(prev => ({ ...prev, cantidad: Math.max(1, prev.cantidad - 1) }))}
                className="w-10 h-10 rounded-full border-floral-pink text-floral-pink hover:bg-floral-rose"
              >
                -
              </Button>
              <span className="text-xl font-semibold w-12 text-center">
                {personalizacion.cantidad}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPersonalizacion(prev => ({ ...prev, cantidad: prev.cantidad + 1 }))}
                className="w-10 h-10 rounded-full border-floral-pink text-floral-pink hover:bg-floral-rose"
              >
                +
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="space-y-3 pb-6">
          <Button
            onClick={handleConfirmar}
            className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
          >
            Confirmar Personalización
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/cliente/producto/${id}`)}
            className="w-full border-floral-pink text-floral-pink hover:bg-floral-rose py-4 text-lg rounded-xl"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ClientePersonalizar;

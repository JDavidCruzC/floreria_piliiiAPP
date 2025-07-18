
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import MobileLayout from "@/components/MobileLayout";
import { useToast } from "@/hooks/use-toast";
import RamoSimulator from "@/components/RamoSimulator";
import AmigurumiSimulator from "@/components/AmigurumiSimulator";

const modelosProductos = {
  ramos: {
    tipos: [
      { id: "clasico", nombre: "Ramo Clásico", precio: 0, forma: "circular" },
      { id: "cascada", nombre: "Ramo Cascada", precio: 15, forma: "cascada" },
      { id: "compacto", nombre: "Ramo Compacto", precio: 5, forma: "compacto" },
      { id: "silvestre", nombre: "Ramo Silvestre", precio: 12, forma: "libre" }
    ],
    flores: [
      { id: "rosas", nombre: "Rosas", precio: 0, colores: ["#FF0000", "#FFFFFF", "#FFB6C1", "#FFFF00"], emoji: "🌹" },
      { id: "girasoles", nombre: "Girasoles", precio: 5, colores: ["#FFD700", "#FFA500"], emoji: "🌻" },
      { id: "tulipanes", nombre: "Tulipanes", precio: 8, colores: ["#FF0000", "#FFFFFF", "#8A2BE2", "#FFFF00"], emoji: "🌷" },
      { id: "lirios", nombre: "Lirios", precio: 10, colores: ["#FFFFFF", "#FFB6C1", "#FFA500"], emoji: "🏵️" },
      { id: "orquideas", nombre: "Orquídeas", precio: 20, colores: ["#8A2BE2", "#FFFFFF", "#FFB6C1"], emoji: "🌺" }
    ],
    hojas: [
      { id: "eucalipto", nombre: "Eucalipto", precio: 3, color: "#90EE90" },
      { id: "helecho", nombre: "Helecho", precio: 2, color: "#228B22" },
      { id: "aspidistra", nombre: "Aspidistra", precio: 4, color: "#006400" },
      { id: "sin_hojas", nombre: "Sin hojas", precio: 0, color: null }
    ],
    materiales: [
      { id: "papel_kraft", nombre: "Papel Kraft", precio: 0, textura: "rugosa", color: "#D2B48C" },
      { id: "celofan", nombre: "Celofán Transparente", precio: 3, textura: "lisa", color: "#E6E6FA" },
      { id: "tela_organza", nombre: "Tela Organza", precio: 8, textura: "suave", color: "#F5F5DC" },
      { id: "papel_seda", nombre: "Papel de Seda", precio: 5, textura: "delicada", color: "#FFE4E1" }
    ],
    cintas: [
      { id: "satin", nombre: "Satín", precio: 0, colores: ["#FFD700", "#C0C0C0", "#FF0000", "#FFFFFF"] },
      { id: "organza", nombre: "Organza", precio: 3, colores: ["transparent", "#FFD700", "#C0C0C0"] },
      { id: "encaje", nombre: "Encaje", precio: 5, colores: ["#FFFFFF", "#F5F5DC", "#FFD700"] },
      { id: "terciopelo", nombre: "Terciopelo", precio: 7, colores: ["#8B0000", "#000080", "#4B0082"] }
    ],
    tamaños: [
      { id: "mini", nombre: "Mini (3-5 flores)", precio: 0, flores: 4, escala: 0.6 },
      { id: "pequeño", nombre: "Pequeño (6-8 flores)", precio: 0, flores: 7, escala: 0.8 },
      { id: "mediano", nombre: "Mediano (10-15 flores)", precio: 15, flores: 12, escala: 1.0 },
      { id: "grande", nombre: "Grande (18-25 flores)", precio: 30, flores: 21, escala: 1.3 },
      { id: "xl", nombre: "Extra Grande (30+ flores)", precio: 50, flores: 35, escala: 1.6 }
    ]
  },
  amigurumis: {
    tipos: [
      { id: "oso", nombre: "Osito", precio: 0, emoji: "🧸", partes: ["cabeza", "cuerpo", "brazos", "piernas"] },
      { id: "conejo", nombre: "Conejito", precio: 3, emoji: "🐰", partes: ["cabeza", "cuerpo", "orejas", "cola"] },
      { id: "gato", nombre: "Gatito", precio: 2, emoji: "🐱", partes: ["cabeza", "cuerpo", "cola", "orejas"] },
      { id: "unicornio", nombre: "Unicornio", precio: 8, emoji: "🦄", partes: ["cabeza", "cuerpo", "cuerno", "crin"] },
      { id: "dragon", nombre: "Dragón", precio: 12, emoji: "🐉", partes: ["cabeza", "cuerpo", "alas", "cola"] }
    ],
    colores: [
      { id: "rosa", nombre: "Rosa", precio: 0, hex: "#FFB6C1", disponible: true },
      { id: "azul", nombre: "Azul", precio: 0, hex: "#87CEEB", disponible: true },
      { id: "blanco", nombre: "Blanco", precio: 0, hex: "#FFFFFF", disponible: true },
      { id: "amarillo", nombre: "Amarillo", precio: 2, hex: "#FFFF00", disponible: true },
      { id: "verde", nombre: "Verde", precio: 2, hex: "#90EE90", disponible: true },
      { id: "morado", nombre: "Morado", precio: 3, hex: "#DDA0DD", disponible: true },
      { id: "multicolor", nombre: "Multicolor", precio: 5, hex: "rainbow", disponible: false }
    ],
    tamaños: [
      { id: "mini", nombre: "Mini (8-12cm)", precio: 0, escala: 0.5, tiempo: "2-3 días" },
      { id: "pequeño", nombre: "Pequeño (15-20cm)", precio: 5, escala: 0.7, tiempo: "3-4 días" },
      { id: "mediano", nombre: "Mediano (25-30cm)", precio: 12, escala: 1.0, tiempo: "5-7 días" },
      { id: "grande", nombre: "Grande (35-40cm)", precio: 20, escala: 1.3, tiempo: "7-10 días" },
      { id: "gigante", nombre: "Gigante (50cm+)", precio: 35, escala: 1.8, tiempo: "10-15 días" }
    ],
    accesorios: [
      { id: "lazos", nombre: "Lazos decorativos", precio: 3, emoji: "🎀" },
      { id: "sombrero", nombre: "Sombrerito", precio: 5, emoji: "🎩" },
      { id: "bufanda", nombre: "Bufanda", precio: 4, emoji: "🧣" },
      { id: "corbata", nombre: "Corbata", precio: 3, emoji: "👔" },
      { id: "corona", nombre: "Corona", precio: 7, emoji: "👑" },
      { id: "gafas", nombre: "Gafas", precio: 4, emoji: "🤓" }
    ],
    rellenos: [
      { id: "algodon", nombre: "Algodón Premium", precio: 0, suavidad: "alta" },
      { id: "fibra", nombre: "Fibra Sintética", precio: 2, suavidad: "media" },
      { id: "memory", nombre: "Memory Foam", precio: 8, suavidad: "premium" }
    ]
  }
};

const ClientePersonalizarAvanzado = () => {
  const { categoria } = useParams<{ categoria: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [personalizacion, setPersonalizacion] = useState({
    // Ramos
    tipoRamo: "",
    flor: "",
    colorFlor: "",
    hojas: "",
    material: "",
    cinta: "",
    colorCinta: "",
    tamaño: "",
    intensidadColor: [50],
    
    // Amigurumis
    tipoAmigurumi: "",
    colorPrincipal: "",
    colorSecundario: "",
    relleno: "",
    accesorios: [] as string[],
    
    // Común
    dedicatoria: "",
    mensaje: "",
    fechaEntrega: "",
    cantidad: 1,
    urgente: false
  });

  const [precioBase] = useState(categoria === "ramos" ? 45 : 35);
  const [precioTotal, setPrecioTotal] = useState(precioBase);
  const [tiempoElaboracion, setTiempoElaboracion] = useState("3-5 días");

  const calcularPrecioYTiempo = () => {
    let precio = precioBase;
    let tiempo = "3-5 días";

    if (categoria === "ramos") {
      const tipo = modelosProductos.ramos.tipos.find(t => t.id === personalizacion.tipoRamo);
      const flor = modelosProductos.ramos.flores.find(f => f.id === personalizacion.flor);
      const hojas = modelosProductos.ramos.hojas.find(h => h.id === personalizacion.hojas);
      const material = modelosProductos.ramos.materiales.find(m => m.id === personalizacion.material);
      const cinta = modelosProductos.ramos.cintas.find(c => c.id === personalizacion.cinta);
      const tamaño = modelosProductos.ramos.tamaños.find(t => t.id === personalizacion.tamaño);
      
      precio += (tipo?.precio || 0) + (flor?.precio || 0) + (hojas?.precio || 0) + 
                (material?.precio || 0) + (cinta?.precio || 0) + (tamaño?.precio || 0);
      
      if (tamaño?.id === "xl") tiempo = "5-7 días";
      else if (tamaño?.id === "grande") tiempo = "4-6 días";
    } else {
      const tipo = modelosProductos.amigurumis.tipos.find(t => t.id === personalizacion.tipoAmigurumi);
      const colorP = modelosProductos.amigurumis.colores.find(c => c.id === personalizacion.colorPrincipal);
      const colorS = modelosProductos.amigurumis.colores.find(c => c.id === personalizacion.colorSecundario);
      const relleno = modelosProductos.amigurumis.rellenos.find(r => r.id === personalizacion.relleno);
      const tamaño = modelosProductos.amigurumis.tamaños.find(t => t.id === personalizacion.tamaño);
      
      precio += (tipo?.precio || 0) + (colorP?.precio || 0) + (colorS?.precio || 0) + 
                (relleno?.precio || 0) + (tamaño?.precio || 0);
      
      tiempo = tamaño?.tiempo || "3-5 días";
      
      // Accesorios
      personalizacion.accesorios.forEach(accId => {
        const acc = modelosProductos.amigurumis.accesorios.find(a => a.id === accId);
        precio += acc?.precio || 0;
      });
    }

    if (personalizacion.urgente) {
      precio += Math.round(precio * 0.3); // 30% extra por urgencia
      tiempo = "1-2 días";
    }

    setPrecioTotal(precio);
    setTiempoElaboracion(tiempo);
  };

  useEffect(() => {
    calcularPrecioYTiempo();
  }, [personalizacion, categoria]);

  const handleAccesorioChange = (accId: string, checked: boolean) => {
    setPersonalizacion(prev => ({
      ...prev,
      accesorios: checked 
        ? [...prev.accesorios, accId]
        : prev.accesorios.filter(id => id !== accId)
    }));
  };

  const handleConfirmar = () => {
    // Validaciones básicas
    if (categoria === "ramos" && !personalizacion.flor) {
      toast({
        title: "Faltan datos",
        description: "Por favor selecciona el tipo de flor",
        variant: "destructive"
      });
      return;
    }

    if (categoria === "amigurumis" && !personalizacion.tipoAmigurumi) {
      toast({
        title: "Faltan datos", 
        description: "Por favor selecciona el tipo de amigurumi",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "¡Personalización completada! 🎨",
      description: `Precio total: S/. ${precioTotal * personalizacion.cantidad}. Tiempo: ${tiempoElaboracion}`,
    });
    navigate("/cliente/carrito");
  };

  if (!categoria || !["ramos", "amigurumis"].includes(categoria)) {
    return (
      <MobileLayout title="Error" showBackButton={true}>
        <div className="p-4 text-center">
          <p>Categoría no válida</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout 
      title={`Personalizar ${categoria === "ramos" ? "Ramo" : "Amigurumi"}`}
      showBackButton={true} 
      backUrl="/cliente/catalogo"
      showCart={true} 
      cartCount={2}
    >
      <div className="p-4 space-y-6">
        {/* Vista previa mejorada */}
        <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg font-serif text-floral-pink flex items-center justify-center gap-2">
              ✨ Vista Previa en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-b from-sky-50 to-floral-rose/20 rounded-xl p-6 mb-4 min-h-80 flex items-center justify-center">
              {categoria === "ramos" ? (
                <RamoSimulator personalizacion={personalizacion} modelos={modelosProductos.ramos} />
              ) : (
                <AmigurumiSimulator personalizacion={personalizacion} modelos={modelosProductos.amigurumis} />
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-floral-pink">
                S/. {precioTotal * personalizacion.cantidad}
              </p>
              <p className="text-sm text-gray-600">
                Tiempo de elaboración: {tiempoElaboracion}
              </p>
              {personalizacion.urgente && (
                <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  ⚡ Pedido urgente (+30% del precio)
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Opciones específicas por categoría */}
        {categoria === "ramos" && (
          <>
            {/* Tipo de ramo */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  🌸 Tipo de Ramo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.tipoRamo} 
                  onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, tipoRamo: value }))}
                >
                  {modelosProductos.ramos.tipos.map((tipo) => (
                    <div key={tipo.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={tipo.id} id={tipo.id} />
                      <Label htmlFor={tipo.id} className="flex-1">
                        {tipo.nombre} {tipo.precio > 0 && `(+S/. ${tipo.precio})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Tipo de flor con colores */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  🌺 Flores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Tipo de Flor:</Label>
                  <RadioGroup 
                    value={personalizacion.flor} 
                    onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, flor: value, colorFlor: "" }))}
                  >
                    {modelosProductos.ramos.flores.map((flor) => (
                      <div key={flor.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={flor.id} id={flor.id} />
                        <Label htmlFor={flor.id} className="flex-1 flex items-center gap-2">
                          <span className="text-lg">{flor.emoji}</span>
                          {flor.nombre} {flor.precio > 0 && `(+S/. ${flor.precio})`}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {personalizacion.flor && (
                  <div>
                    <Label className="text-sm font-medium">Color de Flor:</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {modelosProductos.ramos.flores
                        .find(f => f.id === personalizacion.flor)?.colores
                        .map((color, index) => (
                          <button
                            key={index}
                            onClick={() => setPersonalizacion(prev => ({ ...prev, colorFlor: color }))}
                            className={`w-12 h-12 rounded-full border-2 ${
                              personalizacion.colorFlor === color ? 'border-floral-pink border-4' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {personalizacion.colorFlor && (
                  <div>
                    <Label className="text-sm font-medium">Intensidad del Color:</Label>
                    <Slider
                      value={personalizacion.intensidadColor}
                      onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, intensidadColor: value }))}
                      max={100}
                      min={20}
                      step={10}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {personalizacion.intensidadColor[0]}% de intensidad
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hojas/Follaje */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  🍃 Hojas y Follaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.hojas} 
                  onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, hojas: value }))}
                >
                  {modelosProductos.ramos.hojas.map((hoja) => (
                    <div key={hoja.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={hoja.id} id={hoja.id} />
                      <Label htmlFor={hoja.id} className="flex-1 flex items-center gap-2">
                        {hoja.color && (
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: hoja.color }}
                          />
                        )}
                        {hoja.nombre} {hoja.precio > 0 && `(+S/. ${hoja.precio})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Material de envoltorio */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  📦 Material de Envoltorio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.material} 
                  onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, material: value }))}
                >
                  {modelosProductos.ramos.materiales.map((material) => (
                    <div key={material.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={material.id} id={material.id} />
                      <Label htmlFor={material.id} className="flex-1 flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: material.color }}
                        />
                        {material.nombre} {material.precio > 0 && `(+S/. ${material.precio})`}
                        <span className="text-xs text-gray-500">({material.textura})</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Cinta */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  🎀 Cinta Decorativa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Tipo de Cinta:</Label>
                  <RadioGroup 
                    value={personalizacion.cinta} 
                    onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, cinta: value, colorCinta: "" }))}
                  >
                    {modelosProductos.ramos.cintas.map((cinta) => (
                      <div key={cinta.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={cinta.id} id={cinta.id} />
                        <Label htmlFor={cinta.id} className="flex-1">
                          {cinta.nombre} {cinta.precio > 0 && `(+S/. ${cinta.precio})`}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {personalizacion.cinta && (
                  <div>
                    <Label className="text-sm font-medium">Color de Cinta:</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {modelosProductos.ramos.cintas
                        .find(c => c.id === personalizacion.cinta)?.colores
                        .map((color, index) => (
                          <button
                            key={index}
                            onClick={() => setPersonalizacion(prev => ({ ...prev, colorCinta: color }))}
                            className={`w-12 h-12 rounded-full border-2 ${
                              personalizacion.colorCinta === color ? 'border-floral-pink border-4' : 'border-gray-300'
                            }`}
                            style={{ 
                              backgroundColor: color === "transparent" ? "transparent" : color,
                              border: color === "transparent" ? "2px dashed #ccc" : undefined
                            }}
                            title={color}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tamaño */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  📏 Tamaño del Ramo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.tamaño} 
                  onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, tamaño: value }))}
                >
                  {modelosProductos.ramos.tamaños.map((tamaño) => (
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
          </>
        )}

        {/* Opciones para Amigurumis */}
        {categoria === "amigurumis" && (
          <>
            {/* Tipo de amigurumi */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  🧸 Tipo de Amigurumi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.tipoAmigurumi} 
                  onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, tipoAmigurumi: value }))}
                >
                  {modelosProductos.amigurumis.tipos.map((tipo) => (
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

            {/* Colores */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  🎨 Colores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Color Principal:</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {modelosProductos.amigurumis.colores.filter(c => c.disponible).map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setPersonalizacion(prev => ({ ...prev, colorPrincipal: color.id }))}
                        className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                          personalizacion.colorPrincipal === color.id ? 'border-floral-pink bg-floral-rose' : 'border-gray-300'
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm">{color.nombre}</span>
                        {color.precio > 0 && <span className="text-xs text-gray-500">+{color.precio}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Color Secundario (opcional):</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {modelosProductos.amigurumis.colores.filter(c => c.disponible).map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setPersonalizacion(prev => ({ 
                          ...prev, 
                          colorSecundario: prev.colorSecundario === color.id ? "" : color.id 
                        }))}
                        className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                          personalizacion.colorSecundario === color.id ? 'border-floral-green bg-floral-mint' : 'border-gray-300'
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm">{color.nombre}</span>
                        {color.precio > 0 && <span className="text-xs text-gray-500">+{color.precio}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tamaño amigurumi */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  📏 Tamaño
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.tamaño} 
                  onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, tamaño: value }))}
                >
                  {modelosProductos.amigurumis.tamaños.map((tamaño) => (
                    <div key={tamaño.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={tamaño.id} id={tamaño.id} />
                      <Label htmlFor={tamaño.id} className="flex-1">
                        {tamaño.nombre} {tamaño.precio > 0 && `(+S/. ${tamaño.precio})`}
                        <span className="text-xs text-gray-500 ml-2">({tamaño.tiempo})</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Relleno */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  🧶 Tipo de Relleno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={personalizacion.relleno} 
                  onValueChange={(value) => setPersonalizacion(prev => ({ ...prev, relleno: value }))}
                >
                  {modelosProductos.amigurumis.rellenos.map((relleno) => (
                    <div key={relleno.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={relleno.id} id={relleno.id} />
                      <Label htmlFor={relleno.id} className="flex-1">
                        {relleno.nombre} {relleno.precio > 0 && `(+S/. ${relleno.precio})`}
                        <span className="text-xs text-gray-500 ml-2">(Suavidad {relleno.suavidad})</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Accesorios */}
            <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  ✨ Accesorios (opcional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modelosProductos.amigurumis.accesorios.map((acc) => (
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

        {/* Opciones comunes */}
        
        {/* Urgencia */}
        <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              ⚡ Opciones de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="urgente"
                checked={personalizacion.urgente}
                onChange={(e) => setPersonalizacion(prev => ({ ...prev, urgente: e.target.checked }))}
                className="rounded border-floral-pink"
              />
              <Label htmlFor="urgente" className="flex-1">
                Pedido urgente (+30% del precio) - Entrega en 1-2 días
              </Label>
            </div>
            
            <div>
              <Label htmlFor="fechaEntrega">Fecha preferida de entrega:</Label>
              <Input
                id="fechaEntrega"
                type="date"
                value={personalizacion.fechaEntrega}
                onChange={(e) => setPersonalizacion(prev => ({ ...prev, fechaEntrega: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dedicatoria */}
        <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              💌 Dedicatoria
            </CardTitle>
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
              <Label htmlFor="mensaje">Mensaje personalizado:</Label>
              <Textarea
                id="mensaje"
                placeholder="Escribe tu mensaje especial..."
                value={personalizacion.mensaje}
                onChange={(e) => setPersonalizacion(prev => ({ ...prev, mensaje: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cantidad */}
        <Card className="bg-white/90 backdrop-blur-sm border-floral-rose-dark">
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
              <span className="text-2xl font-semibold w-16 text-center">
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
            Agregar al Carrito - S/. {precioTotal * personalizacion.cantidad}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/cliente/catalogo")}
            className="w-full border-floral-pink text-floral-pink hover:bg-floral-rose py-4 text-lg rounded-xl"
          >
            Seguir Comprando
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ClientePersonalizarAvanzado;

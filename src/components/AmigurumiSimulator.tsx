
import React from 'react';

interface AmigurumiSimulatorProps {
  personalizacion: any;
  modelos: any;
}

const AmigurumiSimulator: React.FC<AmigurumiSimulatorProps> = ({ personalizacion, modelos }) => {
  const tipoSeleccionado = modelos.tipos.find((t: any) => t.id === personalizacion.tipoAmigurumi);
  const colorPrincipal = modelos.colores.find((c: any) => c.id === personalizacion.colorPrincipal);
  const colorSecundario = modelos.colores.find((c: any) => c.id === personalizacion.colorSecundario);
  const tamañoSeleccionado = modelos.tamaños.find((t: any) => t.id === personalizacion.tamaño);
  const rellenoSeleccionado = modelos.rellenos.find((r: any) => r.id === personalizacion.relleno);

  const escala = tamañoSeleccionado?.escala || 1;

  // Generar gradiente para multicolor
  const generarColorFondo = () => {
    if (colorPrincipal?.hex === "rainbow") {
      return "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A, #98D8C8)";
    }
    
    if (colorSecundario) {
      return `linear-gradient(135deg, ${colorPrincipal?.hex || "#FFB6C1"}, ${colorSecundario.hex})`;
    }
    
    return colorPrincipal?.hex || "#FFB6C1";
  };

  // Generar textura según el relleno
  const generarEfectoRelleno = () => {
    switch (rellenoSeleccionado?.suavidad) {
      case "premium":
        return "drop-shadow(0 4px 8px rgba(0,0,0,0.1)) brightness(1.1)";
      case "alta":
        return "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
      default:
        return "none";
    }
  };

  // Generar partes específicas del amigurumi
  const generarPartes = () => {
    if (!tipoSeleccionado) return null;
    
    const partes = [];
    const partesModelo = tipoSeleccionado.partes || [];

    partesModelo.forEach((parte: string, index: number) => {
      let posicion = { x: 0, y: 0, size: 1, emoji: "" };
      
      switch (parte) {
        case "cabeza":
          posicion = { x: 0, y: -15, size: 0.8, emoji: "⭕" };
          break;
        case "cuerpo":
          posicion = { x: 0, y: 5, size: 1.2, emoji: "⭕" };
          break;
        case "orejas":
          partes.push(
            <div key="oreja1" className="absolute" style={{ transform: `translate(-15px, -25px) scale(${0.4 * escala})` }}>
              <div className="w-4 h-6 rounded-full" style={{ background: generarColorFondo() }} />
            </div>,
            <div key="oreja2" className="absolute" style={{ transform: `translate(15px, -25px) scale(${0.4 * escala})` }}>
              <div className="w-4 h-6 rounded-full" style={{ background: generarColorFondo() }} />
            </div>
          );
          return;
        case "brazos":
          partes.push(
            <div key="brazo1" className="absolute" style={{ transform: `translate(-25px, 0px) scale(${0.5 * escala})` }}>
              <div className="w-3 h-8 rounded-full" style={{ background: generarColorFondo() }} />
            </div>,
            <div key="brazo2" className="absolute" style={{ transform: `translate(25px, 0px) scale(${0.5 * escala})` }}>
              <div className="w-3 h-8 rounded-full" style={{ background: generarColorFondo() }} />
            </div>
          );
          return;
        case "piernas":
          partes.push(
            <div key="pierna1" className="absolute" style={{ transform: `translate(-10px, 25px) scale(${0.5 * escala})` }}>
              <div className="w-4 h-10 rounded-full" style={{ background: generarColorFondo() }} />
            </div>,
            <div key="pierna2" className="absolute" style={{ transform: `translate(10px, 25px) scale(${0.5 * escala})` }}>
              <div className="w-4 h-10 rounded-full" style={{ background: generarColorFondo() }} />
            </div>
          );
          return;
        case "cola":
          posicion = { x: 20, y: 10, size: 0.3, emoji: "⭕" };
          break;
        case "cuerno":
          posicion = { x: 0, y: -30, size: 0.4, emoji: "🔺" };
          break;
        case "crin":
          posicion = { x: 0, y: -20, size: 0.6, emoji: "🌈" };
          break;
        case "alas":
          partes.push(
            <div key="ala1" className="absolute" style={{ transform: `translate(-20px, -5px) scale(${0.6 * escala}) rotate(-20deg)` }}>
              <div className="text-lg">🪶</div>
            </div>,
            <div key="ala2" className="absolute" style={{ transform: `translate(20px, -5px) scale(${0.6 * escala}) rotate(20deg)` }}>
              <div className="text-lg">🪶</div>
            </div>
          );
          return;
      }
      
      if (posicion.emoji) {
        partes.push(
          <div 
            key={parte}
            className="absolute flex items-center justify-center"
            style={{ 
              transform: `translate(${posicion.x}px, ${posicion.y}px) scale(${posicion.size * escala})`,
              filter: generarEfectoRelleno()
            }}
          >
            <div 
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ background: generarColorFondo() }}
            />
          </div>
        );
      }
    });

    return partes;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Cuerpo principal del amigurumi */}
      <div 
        className="relative flex flex-col items-center transition-all duration-300"
        style={{ 
          transform: `scale(${escala})`,
          filter: generarEfectoRelleno()
        }}
      >
        {/* Emoji principal del amigurumi */}
        <div 
          className="w-24 h-24 rounded-full border-4 border-gray-300 flex items-center justify-center text-5xl relative shadow-lg"
          style={{ 
            background: generarColorFondo(),
            borderColor: colorSecundario?.hex || "#ddd"
          }}
        >
          {tipoSeleccionado?.emoji || "🧸"}
          
          {/* Partes específicas del modelo */}
          {generarPartes()}
        </div>
        
        {/* Accesorios */}
        <div className="absolute -top-3 -right-3 flex flex-col gap-1">
          {personalizacion.accesorios.map((accId: string) => {
            const accesorio = modelos.accesorios.find((a: any) => a.id === accId);
            return (
              <span 
                key={accId} 
                className="text-lg animate-gentle-sway"
                style={{ animationDelay: `${Math.random() * 2}s` }}
              >
                {accesorio?.emoji}
              </span>
            );
          })}
        </div>
      </div>
      
      {/* Información del tamaño */}
      <div className="absolute bottom-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        {tamañoSeleccionado?.nombre.split('(')[1]?.split(')')[0] || "Tamaño personalizado"}
      </div>

      {/* Dedicatoria flotante */}
      {personalizacion.dedicatoria && (
        <div className="absolute -top-8 text-xs bg-white/90 px-3 py-1 rounded-full shadow-sm text-floral-pink border border-floral-rose">
          💝 Para: {personalizacion.dedicatoria}
        </div>
      )}

      {/* Indicador de urgencia */}
      {personalizacion.urgente && (
        <div className="absolute top-2 right-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
          ⚡ Urgente
        </div>
      )}

      {/* Indicador de calidad del relleno */}
      {rellenoSeleccionado && rellenoSeleccionado.suavidad === "premium" && (
        <div className="absolute top-2 left-2 text-xs bg-floral-green text-white px-2 py-1 rounded-full">
          ⭐ Premium
        </div>
      )}
    </div>
  );
};

export default AmigurumiSimulator;

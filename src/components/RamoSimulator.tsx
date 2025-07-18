
import React from 'react';

interface RamoSimulatorProps {
  personalizacion: any;
  modelos: any;
}

const RamoSimulator: React.FC<RamoSimulatorProps> = ({ personalizacion, modelos }) => {
  const tipoSeleccionado = modelos.tipos.find((t: any) => t.id === personalizacion.tipoRamo);
  const florSeleccionada = modelos.flores.find((f: any) => f.id === personalizacion.flor);
  const hojaSeleccionada = modelos.hojas.find((h: any) => h.id === personalizacion.hojas);
  const materialSeleccionado = modelos.materiales.find((m: any) => m.id === personalizacion.material);
  const cintaSeleccionada = modelos.cintas.find((c: any) => c.id === personalizacion.cinta);
  const tamañoSeleccionado = modelos.tamaños.find((t: any) => t.id === personalizacion.tamaño);

  const cantidadFlores = tamañoSeleccionado?.flores || 7;
  const escala = tamañoSeleccionado?.escala || 0.8;
  const intensidad = personalizacion.intensidadColor[0] || 50;

  // Función para ajustar la intensidad del color
  const adjustColorIntensity = (color: string, intensity: number) => {
    if (!color || color === "transparent") return color;
    
    // Convertir intensidad a factor (0.2 - 1.0)
    const factor = 0.2 + (intensity / 100) * 0.8;
    
    // Si es un color hex, ajustar la intensidad
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      const newR = Math.round(r * factor);
      const newG = Math.round(g * factor);
      const newB = Math.round(b * factor);
      
      return `rgb(${newR}, ${newG}, ${newB})`;
    }
    
    return color;
  };

  const colorFlorAjustado = adjustColorIntensity(personalizacion.colorFlor, intensidad);

  // Función para generar la forma del ramo
  const generarFormaRamo = () => {
    const flores = [];
    const forma = tipoSeleccionado?.forma || "circular";
    
    for (let i = 0; i < cantidadFlores; i++) {
      let posicion = { x: 0, y: 0, rotation: 0, scale: 1 };
      
      switch (forma) {
        case "circular":
          const angulo = (i / cantidadFlores) * 2 * Math.PI;
          const radio = 20 + Math.random() * 15;
          posicion = {
            x: Math.cos(angulo) * radio,
            y: Math.sin(angulo) * radio,
            rotation: Math.random() * 30 - 15,
            scale: 0.8 + Math.random() * 0.4
          };
          break;
          
        case "cascada":
          posicion = {
            x: (i - cantidadFlores / 2) * 8 + Math.random() * 10,
            y: i * 5 + Math.random() * 10,
            rotation: Math.random() * 45 - 22.5,
            scale: 1 - (i / cantidadFlores) * 0.3
          };
          break;
          
        case "compacto":
          const radioCompacto = 10 + Math.random() * 8;
          const anguloCompacto = (i / cantidadFlores) * 2 * Math.PI;
          posicion = {
            x: Math.cos(anguloCompacto) * radioCompacto,
            y: Math.sin(anguloCompacto) * radioCompacto,
            rotation: Math.random() * 20 - 10,
            scale: 0.9 + Math.random() * 0.2
          };
          break;
          
        case "libre":
          posicion = {
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 40,
            rotation: Math.random() * 60 - 30,
            scale: 0.7 + Math.random() * 0.6
          };
          break;
      }
      
      flores.push(
        <div
          key={i}
          className="absolute text-2xl transition-all duration-300"
          style={{
            transform: `translate(${posicion.x}px, ${posicion.y}px) rotate(${posicion.rotation}deg) scale(${posicion.scale * escala})`,
            color: colorFlorAjustado,
            filter: `brightness(${0.8 + (intensidad / 100) * 0.4})`,
            zIndex: cantidadFlores - i
          }}
        >
          {florSeleccionada?.emoji || "🌸"}
        </div>
      );
    }
    
    return flores;
  };

  // Generar hojas/follaje
  const generarFollaje = () => {
    if (!hojaSeleccionada || hojaSeleccionada.id === "sin_hojas") return null;
    
    const hojas = [];
    const cantidadHojas = Math.max(3, Math.floor(cantidadFlores * 0.3));
    
    for (let i = 0; i < cantidadHojas; i++) {
      const angulo = (i / cantidadHojas) * 2 * Math.PI;
      const radio = 25 + Math.random() * 20;
      
      hojas.push(
        <div
          key={`hoja-${i}`}
          className="absolute text-lg"
          style={{
            transform: `translate(${Math.cos(angulo) * radio}px, ${Math.sin(angulo) * radio}px) rotate(${Math.random() * 60 - 30}deg) scale(${escala})`,
            color: hojaSeleccionada.color,
            zIndex: -1
          }}
        >
          🌿
        </div>
      );
    }
    
    return hojas;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Fondo del envoltorio */}
      {materialSeleccionado && (
        <div 
          className="absolute bottom-0 rounded-t-full opacity-80 transition-all duration-300"
          style={{ 
            backgroundColor: materialSeleccionado.color,
            width: `${60 * escala}px`,
            height: `${40 * escala}px`,
            boxShadow: materialSeleccionado.textura === "rugosa" ? "inset 0 2px 4px rgba(0,0,0,0.1)" : "none",
            border: materialSeleccionado.textura === "delicada" ? "1px dashed rgba(0,0,0,0.2)" : "none"
          }}
        />
      )}
      
      {/* Hojas/Follaje */}
      <div className="relative">
        {generarFollaje()}
      </div>
      
      {/* Flores del ramo */}
      <div className="relative">
        {generarFormaRamo()}
      </div>

      {/* Cinta decorativa */}
      {cintaSeleccionada && personalizacion.colorCinta && (
        <div 
          className="absolute bottom-8 rounded transition-all duration-300"
          style={{ 
            backgroundColor: personalizacion.colorCinta === "transparent" ? "transparent" : personalizacion.colorCinta,
            width: `${40 * escala}px`,
            height: `${4 * escala}px`,
            border: personalizacion.colorCinta === "transparent" ? "2px dashed #888" : "none",
            boxShadow: cintaSeleccionada.id === "terciopelo" ? "0 2px 4px rgba(0,0,0,0.3)" : "none"
          }}
        />
      )}

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
    </div>
  );
};

export default RamoSimulator;

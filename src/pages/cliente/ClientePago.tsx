
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileLayout from "@/components/MobileLayout";
import FloralIcon from "@/components/FloralIcon";
import { useToast } from "@/hooks/use-toast";

const ClientePago = () => {
  const [comprobanteCargado, setComprobanteCargado] = useState(false);
  const [archivoComprobante, setArchivoComprobante] = useState<File | null>(null);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");
  const [codigoPedido, setCodigoPedido] = useState("");
  const [configPago, setConfigPago] = useState<any>(null);
  const { toast } = useToast();
  const location = useLocation();
  const pedidoData = location.state;

  // Generar código único del pedido y cargar configuración
  useEffect(() => {
    const codigo = "FP-" + Date.now().toString().slice(-6);
    setCodigoPedido(codigo);
    
    // Cargar configuración de pago del localStorage
    const config = localStorage.getItem('config-pago');
    if (config) {
      setConfigPago(JSON.parse(config));
      setMetodoPagoSeleccionado(JSON.parse(config).metodoPago);
    } else {
      // Configuración por defecto
      setConfigPago({
        metodoPago: 'yape',
        numeroTelefono: '987-654-321',
        nombreNegocio: 'Florería Pili',
        qrImagenUrl: ''
      });
      setMetodoPagoSeleccionado('yape');
    }
  }, []);

  const handleSubirComprobante = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (archivo) {
      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!tiposPermitidos.includes(archivo.type)) {
        toast({
          title: "Archivo no válido",
          description: "Solo se permiten archivos JPG, PNG o PDF",
          variant: "destructive"
        });
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (archivo.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo no debe superar los 5MB",
          variant: "destructive"
        });
        return;
      }

      setArchivoComprobante(archivo);
      setComprobanteCargado(true);
      
      // Guardar comprobante en localStorage para que el admin lo pueda ver
      const reader = new FileReader();
      reader.onload = (e) => {
        const comprobantesExistentes = JSON.parse(localStorage.getItem('comprobantes-pago') || '[]');
        comprobantesExistentes.push({
          codigoPedido,
          archivo: e.target?.result,
          nombreArchivo: archivo.name,
          metodoPago: metodoPagoSeleccionado,
          monto: 165,
          fecha: new Date().toISOString()
        });
        localStorage.setItem('comprobantes-pago', JSON.stringify(comprobantesExistentes));
      };
      reader.readAsDataURL(archivo);
      
      // Simular verificación del comprobante
      setTimeout(() => {
        toast({
          title: "¡Comprobante recibido! 📄",
          description: "Tu comprobante está siendo verificado por nuestro equipo",
        });
      }, 1000);
    }
  };

  return (
    <MobileLayout title="Realizar Pago" showBackButton={true} backUrl="/cliente/carrito">
      <div className="p-4 space-y-6">
        
        {/* Información del pedido */}
        <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <FloralIcon type="flower" size={24} />
              Tu Pedido #{codigoPedido}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>2x Ramo de Rosas Rojas</span>
                <span>S/. 90</span>
              </div>
              <div className="flex justify-between">
                <span>1x Caja Floral Elegante</span>
                <span>S/. 65</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span>S/. 10</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total a Pagar:</span>
                <span className="text-floral-pink">S/. 165</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selección de método de pago */}
        <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
          <CardHeader>
            <CardTitle className="text-lg font-serif">
              💳 Método de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={metodoPagoSeleccionado} onValueChange={setMetodoPagoSeleccionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yape">📱 Yape</SelectItem>
                <SelectItem value="plin">💰 Plin</SelectItem>
                <SelectItem value="bcp">🏦 BCP</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* QR de pago estático */}
        {configPago && (
          <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-center">
                📱 Código QR de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  ✅ Código QR fijo - Escanea y paga directamente
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl mx-auto w-fit border-2 border-dashed border-floral-pink">
                {configPago.qrImagenUrl ? (
                  <div className="text-center">
                    <img
                      src={configPago.qrImagenUrl}
                      alt="QR de pago"
                      className="mx-auto w-48 h-48 object-contain"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {metodoPagoSeleccionado.toUpperCase()} - {configPago.numeroTelefono}
                    </p>
                    <p className="text-sm font-medium">{configPago.nombreNegocio}</p>
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-gray-600">QR de {metodoPagoSeleccionado.toUpperCase()}</p>
                      <p className="text-xs text-gray-500 mt-2">{configPago.numeroTelefono}</p>
                      <p className="text-xs text-gray-500">{configPago.nombreNegocio}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600 space-y-1 bg-blue-50 p-3 rounded-lg">
                <p><strong>📱 Número:</strong> {configPago.numeroTelefono}</p>
                <p><strong>🏪 Nombre:</strong> {configPago.nombreNegocio}</p>
                <p><strong>💰 Monto Exacto:</strong> S/. 165.00</p>
                <p><strong>📝 Concepto:</strong> Pedido {codigoPedido}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subir comprobante */}
        <Card className="bg-white/80 backdrop-blur-sm border-floral-rose-dark">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-800">
              📄 Subir Comprobante de Pago
            </h3>
            <p className="text-sm text-gray-600">
              Una vez realizado el pago, sube tu comprobante para confirmar tu pedido.
            </p>
            
            {!comprobanteCargado ? (
              <div className="space-y-2">
                <Label htmlFor="comprobante" className="block text-sm font-medium">
                  Seleccionar archivo (JPG, PNG o PDF - máx. 5MB)
                </Label>
                <Input
                  id="comprobante"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleSubirComprobante}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-green-800 font-semibold">¡Comprobante subido!</p>
                <p className="text-sm text-green-600">Archivo: {archivoComprobante?.name}</p>
                <p className="text-xs text-green-600 mt-1">Esperando validación del equipo</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instrucciones de pago */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              💡 Instrucciones de Pago
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Escanea el código QR con tu app de {metodoPagoSeleccionado.toUpperCase()}</li>
              <li>• Ingresa exactamente S/. 165.00</li>
              <li>• En el concepto escribe: "Pedido {codigoPedido}"</li>
              <li>• Toma captura del comprobante y súbelo aquí</li>
            </ul>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="space-y-3">
          {comprobanteCargado && (
            <Link to="/cliente/confirmacion" state={{ codigoPedido }}>
              <Button className="w-full bg-floral-green hover:bg-floral-green-light text-white py-4 text-lg font-semibold rounded-xl">
                <FloralIcon type="heart" size={24} className="mr-2" />
                Ver Estado del Pedido
              </Button>
            </Link>
          )}
          
          <Link to="/cliente">
            <Button variant="outline" className="w-full border-floral-pink text-floral-pink hover:bg-floral-rose py-3">
              Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* Ayuda */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-sm text-yellow-800 mb-2">
              ¿Problemas con el pago o necesitas ayuda?
            </p>
            <a
              href={`https://wa.me/51987654321?text=Hola%20Pili,%20tengo%20problemas%20con%20el%20pago%20del%20pedido%20${codigoPedido}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              Chatear por WhatsApp
            </a>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default ClientePago;

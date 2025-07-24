
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileLayout from "@/components/MobileLayout";
import { useToast } from "@/hooks/use-toast";

const ClienteReclamaciones = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipoReclamo: "",
    pedidoId: "",
    descripcion: "",
    fechaIncidente: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular envío del reclamo
    const numeroReclamo = `REC-${Date.now()}`;
    
    toast({
      title: "Reclamo registrado exitosamente",
      description: `Su número de reclamo es: ${numeroReclamo}`,
    });

    // Limpiar formulario
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      tipoReclamo: "",
      pedidoId: "",
      descripcion: "",
      fechaIncidente: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <MobileLayout title="Libro de Reclamaciones" showBackButton backUrl="/cliente">
      <div className="p-6 space-y-6">
        {/* Información legal */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📋 Libro de Reclamaciones
            </CardTitle>
            <CardDescription>
              Conforme a lo establecido en el Código de Protección y Defensa del Consumidor
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• La formulación del reclamo no impide acudir a otras vías de solución de controversias.</p>
            <p>• El proveedor debe dar respuesta al reclamo en un plazo no mayor a 30 días calendario.</p>
            <p>• Para consultas adicionales, puede comunicarse con INDECOPI al 224-7777.</p>
          </CardContent>
        </Card>

        {/* Formulario de reclamo */}
        <Card>
          <CardHeader>
            <CardTitle>Registrar Reclamo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ingrese su nombre completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Correo electrónico *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono *</label>
                  <Input
                    value={formData.telefono}
                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                    placeholder="999 123 456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de reclamo *</label>
                  <Select onValueChange={(value) => handleInputChange("tipoReclamo", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de reclamo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="producto-defectuoso">Producto defectuoso</SelectItem>
                      <SelectItem value="entrega-tardia">Entrega tardía</SelectItem>
                      <SelectItem value="atencion-cliente">Atención al cliente</SelectItem>
                      <SelectItem value="precio-cobro">Precio o cobro incorrecto</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ID del pedido (opcional)</label>
                  <Input
                    value={formData.pedidoId}
                    onChange={(e) => handleInputChange("pedidoId", e.target.value)}
                    placeholder="FP-001234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fecha del incidente</label>
                  <Input
                    type="date"
                    value={formData.fechaIncidente}
                    onChange={(e) => handleInputChange("fechaIncidente", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción del reclamo *</label>
                  <Textarea
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    placeholder="Describa detalladamente su reclamo..."
                    rows={4}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-floral-pink hover:bg-floral-pink-dark">
                Enviar Reclamo
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información de contacto adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Otros canales de atención</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">reclamos@floreriapili.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-sm text-gray-600">+51 987 654 321</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕒</span>
              <div>
                <p className="font-medium">Horario de atención</p>
                <p className="text-sm text-gray-600">Lunes a Sábado: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default ClienteReclamaciones;

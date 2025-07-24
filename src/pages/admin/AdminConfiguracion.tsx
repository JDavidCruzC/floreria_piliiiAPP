import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminConfiguracion = () => {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Cargar configuraciones
  const cargarConfiguraciones = async () => {
    try {
      const { data, error } = await supabase
        .from('configuraciones')
        .select('clave, valor');
      
      if (error) throw error;
      
      const configObj = data?.reduce((acc, item) => {
        acc[item.clave] = item.valor;
        return acc;
      }, {} as any) || {};
      
      setConfig(configObj);
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las configuraciones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const actualizarConfiguracion = async (clave: string, valor: string) => {
    try {
      const { error } = await supabase
        .from('configuraciones')
        .upsert({ clave, valor }, { onConflict: 'clave' });
      
      if (error) throw error;
      
      setConfig((prev: any) => ({ ...prev, [clave]: valor }));
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      throw error;
    }
  };

  const guardarConfiguraciones = async () => {
    try {
      setSaving(true);
      
      // Actualizar todas las configuraciones
      const updates = Object.entries(config).map(([clave, valor]) =>
        actualizarConfiguracion(clave, valor as string)
      );
      
      await Promise.all(updates);
      
      toast({
        title: "Configuraciones guardadas",
        description: "Todas las configuraciones han sido actualizadas exitosamente",
      });
    } catch (error) {
      console.error('Error guardando configuraciones:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las configuraciones",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (clave: string, valor: string) => {
    setConfig((prev: any) => ({ ...prev, [clave]: valor }));
  };

  if (loading) {
    return (
      <AdminLayout title="Configuración del Sistema">
        <div className="p-6 text-center">Cargando configuraciones...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Configuración del Sistema">
      <div className="space-y-6">
        {/* Información de la Empresa */}
        <Card>
          <CardHeader>
            <CardTitle>🏢 Información de la Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="empresa_nombre">Nombre de la Empresa</Label>
              <Input
                id="empresa_nombre"
                value={config.empresa_nombre || ''}
                onChange={(e) => handleInputChange('empresa_nombre', e.target.value)}
                placeholder="Florería Pili"
              />
            </div>
            <div>
              <Label htmlFor="empresa_telefono">Teléfono Principal</Label>
              <Input
                id="empresa_telefono"
                value={config.empresa_telefono || ''}
                onChange={(e) => handleInputChange('empresa_telefono', e.target.value)}
                placeholder="+51 987 654 321"
              />
            </div>
            <div>
              <Label htmlFor="empresa_email">Email de Contacto</Label>
              <Input
                id="empresa_email"
                type="email"
                value={config.empresa_email || ''}
                onChange={(e) => handleInputChange('empresa_email', e.target.value)}
                placeholder="info@floreriapili.com"
              />
            </div>
            <div>
              <Label htmlFor="empresa_direccion">Dirección</Label>
              <Input
                id="empresa_direccion"
                value={config.empresa_direccion || ''}
                onChange={(e) => handleInputChange('empresa_direccion', e.target.value)}
                placeholder="Av. Principal 123, Lima"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp_numero">Número de WhatsApp</Label>
              <Input
                id="whatsapp_numero"
                value={config.whatsapp_numero || ''}
                onChange={(e) => handleInputChange('whatsapp_numero', e.target.value)}
                placeholder="+51987654321"
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociales */}
        <Card>
          <CardHeader>
            <CardTitle>🌐 Redes Sociales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebook_url">URL de Facebook</Label>
              <Input
                id="facebook_url"
                value={config.facebook_url || ''}
                onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/floreriapili"
              />
            </div>
            <div>
              <Label htmlFor="instagram_url">URL de Instagram</Label>
              <Input
                id="instagram_url"
                value={config.instagram_url || ''}
                onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/floreriapili"
              />
            </div>
            <div>
              <Label htmlFor="tiktok_url">URL de TikTok</Label>
              <Input
                id="tiktok_url"
                value={config.tiktok_url || ''}
                onChange={(e) => handleInputChange('tiktok_url', e.target.value)}
                placeholder="https://tiktok.com/@floreriapili"
              />
            </div>
            <div>
              <Label htmlFor="youtube_url">URL de YouTube</Label>
              <Input
                id="youtube_url"
                value={config.youtube_url || ''}
                onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                placeholder="https://youtube.com/@floreriapili"
              />
            </div>
          </CardContent>
        </Card>

        {/* Horarios */}
        <Card>
          <CardHeader>
            <CardTitle>🕒 Horarios de Atención</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="horario_lunes_viernes">Lunes a Viernes</Label>
              <Input
                id="horario_lunes_viernes"
                value={config.horario_lunes_viernes || ''}
                onChange={(e) => handleInputChange('horario_lunes_viernes', e.target.value)}
                placeholder="9:00 AM - 7:00 PM"
              />
            </div>
            <div>
              <Label htmlFor="horario_sabados">Sábados</Label>
              <Input
                id="horario_sabados"
                value={config.horario_sabados || ''}
                onChange={(e) => handleInputChange('horario_sabados', e.target.value)}
                placeholder="9:00 AM - 6:00 PM"
              />
            </div>
            <div>
              <Label htmlFor="horario_domingos">Domingos</Label>
              <Input
                id="horario_domingos"
                value={config.horario_domingos || ''}
                onChange={(e) => handleInputChange('horario_domingos', e.target.value)}
                placeholder="10:00 AM - 4:00 PM"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuraciones de Delivery */}
        <Card>
          <CardHeader>
            <CardTitle>🚚 Configuraciones de Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="delivery_costo">Costo de Delivery (S/.)</Label>
              <Input
                id="delivery_costo"
                type="number"
                step="0.01"
                value={config.delivery_costo || ''}
                onChange={(e) => handleInputChange('delivery_costo', e.target.value)}
                placeholder="10.00"
              />
            </div>
            <div>
              <Label htmlFor="delivery_minimo">Monto Mínimo para Delivery (S/.)</Label>
              <Input
                id="delivery_minimo"
                type="number"
                step="0.01"
                value={config.delivery_minimo || ''}
                onChange={(e) => handleInputChange('delivery_minimo', e.target.value)}
                placeholder="30.00"
              />
            </div>
            <div>
              <Label htmlFor="delivery_gratuito">Monto para Delivery Gratuito (S/.)</Label>
              <Input
                id="delivery_gratuito"
                type="number"
                step="0.01"
                value={config.delivery_gratuito || ''}
                onChange={(e) => handleInputChange('delivery_gratuito', e.target.value)}
                placeholder="100.00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pago */}
        <Card>
          <CardHeader>
            <CardTitle>💳 Métodos de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="qr_pago_yape">Número para Yape</Label>
              <Input
                id="qr_pago_yape"
                value={config.qr_pago_yape || ''}
                onChange={(e) => handleInputChange('qr_pago_yape', e.target.value)}
                placeholder="987654321"
              />
            </div>
            <div>
              <Label htmlFor="qr_pago_plin">Número para Plin</Label>
              <Input
                id="qr_pago_plin"
                value={config.qr_pago_plin || ''}
                onChange={(e) => handleInputChange('qr_pago_plin', e.target.value)}
                placeholder="987654321"
              />
            </div>
            <div>
              <Label htmlFor="qr_pago_bcp">Número de Cuenta BCP</Label>
              <Input
                id="qr_pago_bcp"
                value={config.qr_pago_bcp || ''}
                onChange={(e) => handleInputChange('qr_pago_bcp', e.target.value)}
                placeholder="1234567890123456"
              />
            </div>
          </CardContent>
        </Card>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <Button 
            onClick={guardarConfiguraciones}
            disabled={saving}
            className="bg-floral-pink hover:bg-floral-pink-dark text-white"
          >
            {saving ? "Guardando..." : "💾 Guardar Configuraciones"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminConfiguracion;
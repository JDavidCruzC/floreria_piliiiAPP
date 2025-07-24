
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import MobileLayout from "@/components/MobileLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ClienteContacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: ""
  });
  const [contactInfo, setContactInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cargar información de contacto desde Supabase
  const cargarContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('configuraciones')
        .select('clave, valor')
        .in('clave', [
          'empresa_telefono', 'empresa_email', 'whatsapp_numero',
          'facebook_url', 'instagram_url', 'tiktok_url', 'youtube_url',
          'horario_lunes_viernes', 'horario_sabados', 'horario_domingos'
        ]);
      
      if (error) throw error;
      
      const config = data?.reduce((acc, item) => {
        acc[item.clave] = item.valor;
        return acc;
      }, {} as any) || {};
      
      setContactInfo(config);
    } catch (error) {
      console.error('Error cargando información de contacto:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContactInfo();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Mensaje enviado exitosamente",
      description: "Nos pondremos en contacto contigo pronto",
    });

    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      asunto: "",
      mensaje: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <MobileLayout title="Contacto" showBackButton backUrl="/cliente">
      <div className="p-6 space-y-6">
        {/* Información de contacto */}
        <Card className="bg-gradient-to-r from-floral-rose to-floral-peach">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              🌸 ¡Contáctanos!
            </CardTitle>
            <CardDescription className="text-gray-700">
              Estamos aquí para ayudarte con cualquier consulta
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Métodos de contacto */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                 <div className="flex-1">
                   <h3 className="font-semibold">WhatsApp</h3>
                   <p className="text-sm text-gray-600">{contactInfo.whatsapp_numero || '+51 987 654 321'}</p>
                   <Button 
                     size="sm" 
                     className="mt-2 bg-green-500 hover:bg-green-600"
                     onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp_numero?.replace(/[^0-9]/g, '') || '51987654321'}`, "_blank")}
                   >
                     Chatear ahora
                   </Button>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                 <div className="flex-1">
                   <h3 className="font-semibold">Email</h3>
                   <p className="text-sm text-gray-600">{contactInfo.empresa_email || 'info@floreriapili.com'}</p>
                   <Button 
                     size="sm" 
                     variant="outline" 
                     className="mt-2"
                     onClick={() => window.open(`mailto:${contactInfo.empresa_email || 'info@floreriapili.com'}`, "_blank")}
                   >
                     Enviar email
                   </Button>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📞</span>
                </div>
                 <div className="flex-1">
                   <h3 className="font-semibold">Teléfono</h3>
                   <p className="text-sm text-gray-600">{contactInfo.empresa_telefono || '+51 987 654 321'}</p>
                   <Button 
                     size="sm" 
                     variant="outline" 
                     className="mt-2"
                     onClick={() => window.open(`tel:${contactInfo.empresa_telefono?.replace(/[^0-9]/g, '') || '+51987654321'}`, "_blank")}
                   >
                     Llamar ahora
                   </Button>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Redes sociales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌐 Redes Sociales
            </CardTitle>
            <CardDescription>
              Síguenos en nuestras redes sociales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
               <Button 
                 variant="outline" 
                 className="flex items-center gap-2 p-4 h-auto"
                 onClick={() => window.open(contactInfo.facebook_url || "https://facebook.com/floreriapili", "_blank")}
               >
                 <span className="text-2xl">📘</span>
                 <div className="text-left">
                   <p className="font-semibold">Facebook</p>
                   <p className="text-xs text-gray-600">@floreriapili</p>
                 </div>
               </Button>

               <Button 
                 variant="outline" 
                 className="flex items-center gap-2 p-4 h-auto"
                 onClick={() => window.open(contactInfo.instagram_url || "https://instagram.com/floreriapili", "_blank")}
               >
                 <span className="text-2xl">📷</span>
                 <div className="text-left">
                   <p className="font-semibold">Instagram</p>
                   <p className="text-xs text-gray-600">@floreriapili</p>
                 </div>
               </Button>

               <Button 
                 variant="outline" 
                 className="flex items-center gap-2 p-4 h-auto"
                 onClick={() => window.open(contactInfo.tiktok_url || "https://tiktok.com/@floreriapili", "_blank")}
               >
                 <span className="text-2xl">🎵</span>
                 <div className="text-left">
                   <p className="font-semibold">TikTok</p>
                   <p className="text-xs text-gray-600">@floreriapili</p>
                 </div>
               </Button>

               <Button 
                 variant="outline" 
                 className="flex items-center gap-2 p-4 h-auto"
                 onClick={() => window.open(contactInfo.youtube_url || "https://youtube.com/@floreriapili", "_blank")}
               >
                 <span className="text-2xl">📺</span>
                 <div className="text-left">
                   <p className="font-semibold">YouTube</p>
                   <p className="text-xs text-gray-600">@floreriapili</p>
                 </div>
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Envíanos un mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <Input
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="999 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Asunto *</label>
                <Input
                  value={formData.asunto}
                  onChange={(e) => handleInputChange("asunto", e.target.value)}
                  placeholder="¿En qué podemos ayudarte?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mensaje *</label>
                <Textarea
                  value={formData.mensaje}
                  onChange={(e) => handleInputChange("mensaje", e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-floral-pink hover:bg-floral-pink-dark">
                Enviar Mensaje
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Horarios de atención</CardTitle>
          </CardHeader>
           <CardContent className="space-y-2">
             <div className="flex justify-between">
               <span>Lunes - Viernes:</span>
               <span className="font-semibold">{contactInfo.horario_lunes_viernes || '9:00 AM - 7:00 PM'}</span>
             </div>
             <div className="flex justify-between">
               <span>Sábados:</span>
               <span className="font-semibold">{contactInfo.horario_sabados || '9:00 AM - 6:00 PM'}</span>
             </div>
             <div className="flex justify-between">
               <span>Domingos:</span>
               <span className="font-semibold">{contactInfo.horario_domingos || '10:00 AM - 4:00 PM'}</span>
             </div>
           </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default ClienteContacto;

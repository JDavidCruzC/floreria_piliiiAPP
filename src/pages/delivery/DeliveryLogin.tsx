
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser } from "@/lib/supabase";

const DeliveryLogin = () => {
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔄 Intentando login delivery con:', { codigo });
      
      const result = await authenticateUser(codigo, password);

      if (result.success && result.usuario) {
        // Verificar permisos para delivery
        if (result.usuario.rol !== 'delivery') {
          toast({
            title: "❌ Acceso denegado",
            description: "No tienes permisos para acceder al sistema de delivery",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Guardar datos del usuario en localStorage
        localStorage.setItem('floreria_user', JSON.stringify(result.usuario));
        localStorage.setItem('floreria_session', 'active');

        toast({
          title: "✅ Acceso correcto",
          description: `Bienvenido al sistema de delivery, ${result.usuario.nombre}`,
        });

        console.log('✅ Login delivery exitoso:', result.usuario);

        navigate("/delivery/panel");
      } else {
        toast({
          title: "❌ Error de acceso",
          description: result.error || "Credenciales incorrectas",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('❌ Error de login delivery:', error);
      toast({
        title: "❌ Error del sistema",
        description: "Error de conexión. Intenta nuevamente.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-floral-rose to-floral-cream flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <span className="text-5xl">🌸</span>
          </div>
          <CardTitle className="font-serif text-2xl">
            Florería Pili - Delivery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Código de empleado</label>
              <Input 
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: FLOR001"
                required
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-floral-pink hover:bg-floral-pink-dark"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-2">
              Credenciales de prueba:
            </p>
            <div className="text-xs text-blue-700">
              <p><strong>Código:</strong> FLOR001</p>
              <p><strong>Contraseña:</strong> Delivery789*</p>
              <p className="mt-2 text-green-700">
                ✅ Sistema configurado y funcionando
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryLogin;

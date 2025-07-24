
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser } from "@/lib/supabase";

const AdminLogin = () => {
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔄 Intentando login con:', { codigo });
      
      const result = await authenticateUser(codigo, password);

      if (result.success && result.usuario) {
        // Verificar permisos para admin
        if (!['gerente', 'vendedor'].includes(result.usuario.rol)) {
          toast({
            title: "❌ Acceso denegado",
            description: "No tienes permisos para acceder al panel de administración",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Guardar datos del usuario en localStorage
        localStorage.setItem('floreria_user', JSON.stringify(result.usuario));
        localStorage.setItem('floreria_session', 'active');

        toast({
          title: "¡Bienvenida! 🌸",
          description: `Acceso exitoso, ${result.usuario.nombre}`,
        });

        console.log('✅ Login exitoso:', result.usuario);
        
        setTimeout(() => {
          navigate("/admin/panel");
        }, 1000);
      } else {
        toast({
          title: "❌ Error de acceso",
          description: result.error || "Credenciales incorrectas",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('❌ Error de login:', error);
      toast({
        title: "Error del sistema",
        description: "Error de conexión. Intenta nuevamente.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen floral-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-gentle-sway">🌸</div>
          <CardTitle className="text-2xl font-serif floral-text-gradient">
            Florería Pili
          </CardTitle>
          <CardDescription>
            Panel de Administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código de Empleado</Label>
              <Input
                id="codigo"
                type="text"
                placeholder="ADMIN001"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                className="bg-white/80 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/80"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Ingresar"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-2">
              Credenciales de prueba:
            </p>
            <p className="text-xs text-blue-700">
              <strong>Admin:</strong> ADMIN001 / Temp123*<br />
              <strong>Vendedor:</strong> VEND001 / Temp456*
            </p>
            <p className="text-xs text-green-700 mt-2">
              ✅ Sistema configurado y funcionando
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

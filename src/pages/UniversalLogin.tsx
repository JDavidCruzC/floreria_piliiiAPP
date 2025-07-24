
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authenticateUser } from "@/lib/supabase";

const UniversalLogin = () => {
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [tipoLogin, setTipoLogin] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔄 Intentando login universal con:', { codigo, tipoLogin });
      
      const result = await authenticateUser(codigo, password);

      if (result.success && result.usuario) {
        // Verificar permisos según tipo de login
        const rutasPermitidas = {
          admin: ['gerente', 'vendedor'],
          delivery: ['delivery'],
          vendedor: ['vendedor'],
          marketing: ['marketing']
        };

        const rolesPermitidos = rutasPermitidas[tipoLogin as keyof typeof rutasPermitidas] || [];
        
        if (!rolesPermitidos.includes(result.usuario.rol)) {
          toast({
            title: "❌ Acceso denegado",
            description: `No tienes permisos para acceder como ${tipoLogin}`,
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
          description: `Bienvenido, ${result.usuario.nombre}`,
        });

        console.log('✅ Login universal exitoso:', result.usuario);

        // Redirigir según el rol
        const rutas = {
          gerente: "/admin/panel",
          delivery: "/delivery/panel",
          vendedor: "/admin/panel",
          marketing: "/admin/panel"
        };
        
        const ruta = rutas[result.usuario.rol];
        navigate(ruta);
      } else {
        toast({
          title: "❌ Error de acceso",
          description: result.error || "Credenciales incorrectas",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('❌ Error de login universal:', error);
      toast({
        title: "❌ Error del sistema",
        description: "Error de conexión. Intenta nuevamente.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const getPlaceholder = () => {
    const placeholders = {
      admin: "ADMIN001 o VEND001",
      delivery: "FLOR001",
      vendedor: "VEND001",
      marketing: "MARK001"
    };
    return `Ej: ${placeholders[tipoLogin as keyof typeof placeholders]}`;
  };

  const getTitulo = () => {
    const titulos = {
      admin: "Panel de Administración",
      delivery: "Sistema de Delivery",
      vendedor: "Portal de Ventas",
      marketing: "Panel de Marketing"
    };
    return titulos[tipoLogin as keyof typeof titulos];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-floral-rose to-floral-cream flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <span className="text-5xl">🌸</span>
          </div>
          <CardTitle className="font-serif text-2xl">
            Florería Pili
          </CardTitle>
          <p className="text-gray-600">{getTitulo()}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Acceso</label>
              <Select value={tipoLogin} onValueChange={setTipoLogin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">👑 Administración</SelectItem>
                  <SelectItem value="delivery">🚚 Delivery</SelectItem>
                  <SelectItem value="vendedor">👤 Ventas</SelectItem>
                  <SelectItem value="marketing">📢 Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Código de empleado</label>
              <Input 
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder={getPlaceholder()}
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
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Admin:</strong> ADMIN001 / Temp123*</p>
              <p><strong>Vendedor:</strong> VEND001 / Temp456*</p>
              <p><strong>Delivery:</strong> FLOR001 / Delivery789*</p>
              <p><strong>Marketing:</strong> MARK001 / Market321*</p>
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

export default UniversalLogin;

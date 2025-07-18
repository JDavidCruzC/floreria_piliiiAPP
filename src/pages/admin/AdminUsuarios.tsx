import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const usuariosData = [
  {
    id: 1,
    nombre: "Fiorela Pili",
    email: "admin@floreriapili.com",
    rol: "gerente",
    activo: true,
    ultimoAcceso: "2024-01-15 09:30",
    fechaCreacion: "2023-01-15",
    telefono: "987-654-321",
    codigo: "ADMIN001",
    password: "Temp123*",
    requiereCambioPassword: false
  },
  {
    id: 2,
    nombre: "María González",
    email: "maria@floreriapili.com", 
    rol: "vendedor",
    activo: true,
    ultimoAcceso: "2024-01-15 14:20",
    fechaCreacion: "2023-06-10",
    telefono: "987-654-322",
    codigo: "VEND001",
    password: "Temp456*",
    requiereCambioPassword: true
  },
  {
    id: 3,
    nombre: "Carlos Delivery",
    email: "carlos@floreriapili.com",
    rol: "delivery", 
    activo: true,
    ultimoAcceso: "2024-01-15 16:45",
    fechaCreacion: "2023-08-22",
    telefono: "987-654-323",
    codigo: "FLOR001",
    password: "Delivery789*",
    requiereCambioPassword: false
  },
  {
    id: 4,
    nombre: "Ana Marketing",
    email: "ana@floreriapili.com",
    rol: "marketing",
    activo: true,
    ultimoAcceso: "2024-01-14 11:15",
    fechaCreacion: "2023-03-05",
    telefono: "987-654-324",
    codigo: "MARK001",
    password: "Market321*",
    requiereCambioPassword: true
  },
  {
    id: 5,
    nombre: "Luis Repartidor",
    email: "luis@floreriapili.com",
    rol: "delivery",
    activo: false,
    ultimoAcceso: "2024-01-10 08:30",
    fechaCreacion: "2023-09-15",
    telefono: "987-654-325",
    codigo: "FLOR002",
    password: "Delivery555*",
    requiereCambioPassword: true
  }
];

const clientesData = [
  {
    id: 1,
    nombre: "Luis Mendoza",
    email: "luis.mendoza@email.com",
    telefono: "987-654-321",
    pedidos: 8,
    totalGastado: 420,
    ultimoPedido: "2024-01-15"
  },
  {
    id: 2,
    nombre: "Sofia Paz", 
    email: "sofia.paz@email.com",
    telefono: "987-654-322",
    pedidos: 12,
    totalGastado: 680,
    ultimoPedido: "2024-01-14"
  },
  {
    id: 3,
    nombre: "Roberto Silva",
    email: "roberto.silva@email.com", 
    telefono: "987-654-323",
    pedidos: 3,
    totalGastado: 145,
    ultimoPedido: "2024-01-12"
  },
  {
    id: 4,
    nombre: "Carmen Flores",
    email: "carmen.flores@email.com",
    telefono: "987-654-324", 
    pedidos: 15,
    totalGastado: 890,
    ultimoPedido: "2024-01-15"
  }
];

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes] = useState(clientesData);
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState("usuarios");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalCredenciales, setModalCredenciales] = useState(false);
  const [modalCambioPassword, setModalCambioPassword] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<any>(null);
  const [usuarioCredenciales, setUsuarioCredenciales] = useState<any>(null);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const { toast } = useToast();

  // Cargar usuarios desde Supabase
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error cargando usuarios:', error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los usuarios",
            variant: "destructive"
          });
        } else {
          setUsuarios(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, [toast]);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "vendedor",
    codigo: "",
    password: ""
  });

  const getRolBadge = (rol: string) => {
    const config = {
      gerente: "bg-purple-100 text-purple-800",
      vendedor: "bg-blue-100 text-blue-800",
      delivery: "bg-orange-100 text-orange-800",
      marketing: "bg-green-100 text-green-800",
      cliente: "bg-gray-100 text-gray-800"
    };
    
    const iconos = {
      gerente: "👑 Gerente",
      vendedor: "👤 Vendedor", 
      delivery: "🚚 Delivery",
      marketing: "📢 Marketing",
      cliente: "🛒 Cliente"
    };
    
    return (
      <Badge className={config[rol as keyof typeof config] || "bg-gray-100 text-gray-800"}>
        {iconos[rol as keyof typeof iconos] || "👤 Usuario"}
      </Badge>
    );
  };

  const generarCodigo = (rol: string) => {
    const prefijos = {
      gerente: "ADMIN",
      vendedor: "VEND", 
      delivery: "FLOR",
      marketing: "MARK"
    };
    
    const prefijo = prefijos[rol as keyof typeof prefijos] || "USER";
    const numero = String(Math.floor(Math.random() * 999) + 100).padStart(3, '0');
    return `${prefijo}${numero}`;
  };

  const generarPasswordSegura = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    
    // Asegurar al menos una mayúscula, una minúscula, un número y un símbolo
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
    
    // Completar hasta 8 caracteres
    for (let i = 4; i < 8; i++) {
      password += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    
    // Mezclar los caracteres
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono || "",
        rol: usuario.rol,
        codigo: usuario.codigo || "",
        password: usuario.password || ""
      });
    } else {
      setUsuarioEditando(null);
      const nuevoCodigo = generarCodigo("vendedor");
      const nuevaPassword = generarPasswordSegura();
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        rol: "vendedor",
        codigo: nuevoCodigo,
        password: nuevaPassword
      });
    }
    setModalAbierto(true);
  };

  const guardarUsuario = async () => {
    if (!formData.nombre || !formData.codigo) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    try {
      if (usuarioEditando) {
        // Editar usuario existente
        const { error } = await supabase
          .from('usuarios')
          .update({
            nombre: formData.nombre,
            codigo: formData.codigo,
            rol: formData.rol as "gerente" | "vendedor" | "delivery" | "marketing",
            password_hash: formData.password
          })
          .eq('id', usuarioEditando.id);

        if (error) {
          toast({
            title: "Error",
            description: "No se pudo actualizar el usuario",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Usuario actualizado 👤",
          description: `${formData.nombre} ha sido actualizado`,
        });
      } else {
        // Crear nuevo usuario
        const { data, error } = await supabase
          .from('usuarios')
          .insert({
            nombre: formData.nombre,
            codigo: formData.codigo,
            rol: formData.rol as "gerente" | "vendedor" | "delivery" | "marketing",
            password_hash: formData.password,
            activo: true
          })
          .select();

        if (error) {
          toast({
            title: "Error",
            description: "No se pudo crear el usuario",
            variant: "destructive"
          });
          return;
        }

        // Mostrar credenciales del nuevo usuario
        setUsuarioCredenciales(data[0]);
        setModalCredenciales(true);
        
        toast({
          title: "Usuario creado 👤",
          description: `${formData.nombre} ha sido agregado. Se mostrarán las credenciales.`,
        });
      }

      // Recargar usuarios
      const { data: usuariosData } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });
      
      setUsuarios(usuariosData || []);
      setModalAbierto(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Error del sistema",
        variant: "destructive"
      });
    }
  };

  const actualizarCodigoPorRol = (nuevoRol: string) => {
    if (!usuarioEditando) {
      const nuevoCodigo = generarCodigo(nuevoRol);
      const nuevaPassword = generarPasswordSegura();
      setFormData(prev => ({ ...prev, rol: nuevoRol, codigo: nuevoCodigo, password: nuevaPassword }));
    } else {
      setFormData(prev => ({ ...prev, rol: nuevoRol }));
    }
  };

  const toggleEstadoUsuario = async (id: string) => {
    try {
      const usuario = usuarios.find(u => u.id === id);
      if (!usuario) return;

      const { error } = await supabase
        .from('usuarios')
        .update({ activo: !usuario.activo })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo cambiar el estado del usuario",
          variant: "destructive"
        });
        return;
      }

      // Recargar usuarios
      const { data: usuariosData } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });
      
      setUsuarios(usuariosData || []);
      
      toast({
        title: `Usuario ${usuario?.activo ? 'desactivado' : 'activado'}`,
        description: `${usuario?.nombre} ha sido ${usuario?.activo ? 'desactivado' : 'activado'}`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const abrirCambioPassword = (usuario: any) => {
    setUsuarioEditando(usuario);
    setNuevaPassword(generarPasswordSegura());
    setModalCambioPassword(true);
  };

  const cambiarPassword = async () => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ password_hash: nuevaPassword })
        .eq('id', usuarioEditando.id);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar la contraseña",
          variant: "destructive"
        });
        return;
      }

      // Recargar usuarios
      const { data: usuariosData } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });
      
      setUsuarios(usuariosData || []);
      
      toast({
        title: "Contraseña actualizada 🔐",
        description: `Nueva contraseña generada para ${usuarioEditando.nombre}`,
      });
      
      setModalCambioPassword(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const copiarTexto = (texto: string, tipo: string) => {
    navigator.clipboard.writeText(texto);
    toast({
      title: "Copiado ✅",
      description: `${tipo} copiado al portapapeles`,
    });
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    (usuario.codigo || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <AdminLayout title="Gestión de Usuarios">
      <div className="space-y-6">
        {/* Navegación entre vistas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex gap-4">
                <Button
                  variant={vistaActiva === "usuarios" ? "default" : "outline"}
                  onClick={() => setVistaActiva("usuarios")}
                  className={vistaActiva === "usuarios" ? "bg-floral-pink hover:bg-floral-pink-dark text-white" : ""}
                >
                  👥 Usuarios del Sistema
                </Button>
                <Button
                  variant={vistaActiva === "clientes" ? "default" : "outline"}
                  onClick={() => setVistaActiva("clientes")}
                  className={vistaActiva === "clientes" ? "bg-floral-pink hover:bg-floral-pink-dark text-white" : ""}
                >
                  🛒 Clientes
                </Button>
              </div>
              {vistaActiva === "usuarios" && (
                <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => abrirModal()}
                      className="bg-floral-green hover:bg-floral-green-light text-white"
                    >
                      ➕ Nuevo Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {usuarioEditando ? "Editar Usuario" : "Nuevo Usuario"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nombre">Nombre Completo *</Label>
                        <Input
                          id="nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          placeholder="Ej: María González"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Correo Electrónico *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="usuario@floreriapili.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input
                          id="telefono"
                          value={formData.telefono}
                          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                          placeholder="987-654-321"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rol">Rol *</Label>
                        <Select value={formData.rol} onValueChange={actualizarCodigoPorRol}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vendedor">👤 Vendedor</SelectItem>
                            <SelectItem value="delivery">🚚 Personal de Delivery</SelectItem>
                            <SelectItem value="marketing">📢 Marketing</SelectItem>
                            <SelectItem value="gerente">👑 Gerente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="codigo">Código de Usuario</Label>
                        <div className="flex gap-2">
                          <Input
                            id="codigo"
                            value={formData.codigo}
                            onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                            placeholder="Se genera automáticamente"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFormData({...formData, codigo: generarCodigo(formData.rol)})}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {!usuarioEditando && (
                        <div>
                          <Label htmlFor="password">Contraseña Temporal</Label>
                          <div className="flex gap-2">
                            <Input
                              id="password"
                              type={mostrarPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              placeholder="Se genera automáticamente"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setMostrarPassword(!mostrarPassword)}
                            >
                              {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setFormData({...formData, password: generarPasswordSegura()})}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Contraseña segura generada automáticamente
                          </p>
                        </div>
                      )}
                      <Button 
                        onClick={guardarUsuario}
                        className="w-full bg-floral-green hover:bg-floral-green-light text-white"
                      >
                        {usuarioEditando ? "Actualizar" : "Crear"} Usuario
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder={vistaActiva === "usuarios" ? "Buscar usuarios..." : "Buscar clientes..."}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {vistaActiva === "usuarios" ? (
          <>
            {/* Tabla de usuarios del sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👥 Usuarios del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosFiltrados.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{usuario.nombre}</p>
                            <p className="text-sm text-gray-500">{usuario.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{usuario.telefono}</p>
                        </TableCell>
                        <TableCell>
                          {getRolBadge(usuario.rol)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {usuario.codigo}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copiarTexto(usuario.codigo, "Código")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge className={usuario.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {usuario.activo ? "✅ Activo" : "❌ Inactivo"}
                            </Badge>
                            {usuario.requiereCambioPassword && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                🔄 Requiere cambio
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {mostrarPassword ? usuario.password : "••••••••"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setMostrarPassword(!mostrarPassword)}
                            >
                              {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {usuario.ultimoAcceso}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => abrirModal(usuario)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              ✏️
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => abrirCambioPassword(usuario)}
                              className="text-purple-600 border-purple-600 hover:bg-purple-50"
                            >
                              🔐
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setUsuarioCredenciales(usuario);
                                setModalCredenciales(true);
                              }}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              👁️
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleEstadoUsuario(usuario.id)}
                              className={usuario.activo ? "text-red-600 border-red-600 hover:bg-red-50" : "text-green-600 border-green-600 hover:bg-green-50"}
                            >
                              {usuario.activo ? "🚫" : "✅"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Estadísticas de usuarios */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <p className="text-2xl font-bold text-blue-600">{usuarios.length}</p>
                  <p className="text-sm text-gray-600">Total Usuarios</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">👑</div>
                  <p className="text-2xl font-bold text-purple-600">
                    {usuarios.filter(u => u.rol === "gerente").length}
                  </p>
                  <p className="text-sm text-gray-600">Gerentes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">👤</div>
                  <p className="text-2xl font-bold text-blue-600">
                    {usuarios.filter(u => u.rol === "vendedor").length}
                  </p>
                  <p className="text-sm text-gray-600">Vendedores</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🚚</div>
                  <p className="text-2xl font-bold text-orange-600">
                    {usuarios.filter(u => u.rol === "delivery").length}
                  </p>
                  <p className="text-sm text-gray-600">Delivery</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">📢</div>
                  <p className="text-2xl font-bold text-green-600">
                    {usuarios.filter(u => u.rol === "marketing").length}
                  </p>
                  <p className="text-sm text-gray-600">Marketing</p>
                </CardContent>
              </Card>
            </div>
          </>
        ):(
          <>
            {/* Tabla de clientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🛒 Base de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Total Gastado</TableHead>
                      <TableHead>Último Pedido</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesFiltrados.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{cliente.nombre}</p>
                            <p className="text-sm text-gray-500">{cliente.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <p className="text-sm">{cliente.telefono}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copiarTexto(cliente.telefono, "Teléfono")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            {cliente.pedidos} pedidos
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-floral-pink">
                          S/. {cliente.totalGastado}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {cliente.ultimoPedido}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast({
                                title: "Historial de cliente",
                                description: `Mostrando pedidos de ${cliente.nombre}`,
                              })}
                            >
                              👁️
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast({
                                title: "Contactando cliente",
                                description: `Llamando a ${cliente.nombre}...`,
                              })}
                            >
                              📞
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Estadísticas de clientes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🛒</div>
                  <p className="text-2xl font-bold text-green-600">{clientes.length}</p>
                  <p className="text-sm text-gray-600">Total Clientes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">📦</div>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(clientes.reduce((sum, c) => sum + c.pedidos, 0) / clientes.length)}
                  </p>
                  <p className="text-sm text-gray-600">Pedidos Promedio</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="text-2xl font-bold text-purple-600">
                    S/. {Math.round(clientes.reduce((sum, c) => sum + c.totalGastado, 0) / clientes.length)}
                  </p>
                  <p className="text-sm text-gray-600">Gasto Promedio</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">👑</div>
                  <p className="text-2xl font-bold text-pink-600">
                    {clientes.filter(c => c.totalGastado > 500).length}
                  </p>
                  <p className="text-sm text-gray-600">Clientes VIP</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Modal para crear/editar usuario */}
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {usuarioEditando ? "Editar Usuario" : "Nuevo Usuario"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: María González"
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usuario@floreriapili.com"
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  placeholder="987-654-321"
                />
              </div>
              <div>
                <Label htmlFor="rol">Rol *</Label>
                <Select value={formData.rol} onValueChange={actualizarCodigoPorRol}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendedor">👤 Vendedor</SelectItem>
                    <SelectItem value="delivery">🚚 Personal de Delivery</SelectItem>
                    <SelectItem value="marketing">📢 Marketing</SelectItem>
                    <SelectItem value="gerente">👑 Gerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="codigo">Código de Usuario</Label>
                <div className="flex gap-2">
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    placeholder="Se genera automáticamente"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({...formData, codigo: generarCodigo(formData.rol)})}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!usuarioEditando && (
                <div>
                  <Label htmlFor="password">Contraseña Temporal</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type={mostrarPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Se genera automáticamente"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                    >
                      {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({...formData, password: generarPasswordSegura()})}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Contraseña segura generada automáticamente
                  </p>
                </div>
              )}
              <Button 
                onClick={guardarUsuario}
                className="w-full bg-floral-green hover:bg-floral-green-light text-white"
              >
                {usuarioEditando ? "Actualizar" : "Crear"} Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal para mostrar credenciales */}
        <Dialog open={modalCredenciales} onOpenChange={setModalCredenciales}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>🔐 Credenciales del Usuario</DialogTitle>
            </DialogHeader>
            {usuarioCredenciales && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3">
                    Credenciales para: {usuarioCredenciales.nombre}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Código:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded border font-mono">
                          {usuarioCredenciales.codigo}
                        </code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copiarTexto(usuarioCredenciales.codigo, "Código")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Contraseña:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded border font-mono">
                          {usuarioCredenciales.password}
                        </code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copiarTexto(usuarioCredenciales.password, "Contraseña")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Email:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {usuarioCredenciales.email}
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copiarTexto(usuarioCredenciales.email, "Email")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      ⚠️ <strong>Importante:</strong> Entrega estas credenciales al usuario de forma segura. 
                      El usuario deberá cambiar su contraseña en el primer acceso.
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setModalCredenciales(false)}
                  className="w-full"
                >
                  Cerrar
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal para cambio de contraseña */}
        <Dialog open={modalCambioPassword} onOpenChange={setModalCambioPassword}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>🔐 Cambiar Contraseña</DialogTitle>
            </DialogHeader>
            {usuarioEditando && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Generando nueva contraseña para: <strong>{usuarioEditando.nombre}</strong>
                </p>
                
                <div>
                  <Label htmlFor="nuevaPassword">Nueva Contraseña</Label>
                  <div className="flex gap-2">
                    <Input
                      id="nuevaPassword"
                      type={mostrarPassword ? "text" : "password"}
                      value={nuevaPassword}
                      onChange={(e) => setNuevaPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                    >
                      {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNuevaPassword(generarPasswordSegura())}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={cambiarPassword}
                    className="flex-1 bg-floral-green hover:bg-floral-green-light text-white"
                  >
                    Cambiar Contraseña
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setModalCambioPassword(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsuarios;

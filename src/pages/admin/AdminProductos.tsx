
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminProductos = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cargar productos desde Supabase
  const cargarProductos = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "ramos"
  });

  const abrirModal = (producto = null) => {
    if (producto) {
      setProductoEditando(producto);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        categoria: producto.categoria
      });
    } else {
      setProductoEditando(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "ramos"
      });
    }
    setModalAbierto(true);
  };

  const guardarProducto = async () => {
    try {
      setLoading(true);
      
      if (productoEditando) {
        // Editar producto existente
        const { error } = await supabase
          .from('productos')
          .update({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock),
            categoria: formData.categoria
          })
          .eq('id', productoEditando.id);
          
        if (error) throw error;
        
        toast({
          title: "Producto actualizado 🌸",
          description: `${formData.nombre} ha sido actualizado`,
        });
      } else {
        // Crear nuevo producto
        const { error } = await supabase
          .from('productos')
          .insert({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock),
            categoria: formData.categoria,
            imagen_url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop",
            personalizable: true,
            activo: true
          });
          
        if (error) throw error;
        
        toast({
          title: "Producto creado 🌸",
          description: `${formData.nombre} ha sido agregado al catálogo`,
        });
      }
      
      cargarProductos();
      setModalAbierto(false);
    } catch (error) {
      console.error('Error guardando producto:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('productos')
        .update({ activo: false })
        .eq('id', id);
        
      if (error) throw error;
      
      cargarProductos();
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido removido del catálogo",
      });
    } catch (error) {
      console.error('Error eliminando producto:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive"
      });
    }
  };

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getCategoriaIcon = (categoria: string) => {
    const icons = {
      ramos: "💐",
      cajas: "📦", 
      personalizados: "🎨"
    };
    return icons[categoria as keyof typeof icons] || "🌸";
  };

  return (
    <AdminLayout title="Gestión de Productos">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌸 Catálogo de Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => abrirModal()}
                    className="bg-floral-pink hover:bg-floral-pink-dark text-white"
                  >
                    ➕ Nuevo Producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {productoEditando ? "Editar Producto" : "Nuevo Producto"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre del Producto</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        placeholder="Ej: Ramo de Rosas Blancas"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        placeholder="Descripción del producto..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="precio">Precio (S/.)</Label>
                        <Input
                          id="precio"
                          type="number"
                          step="0.01"
                          value={formData.precio}
                          onChange={(e) => setFormData({...formData, precio: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoría</Label>
                      <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ramos">💐 Ramos</SelectItem>
                          <SelectItem value="cajas">📦 Cajas</SelectItem>
                          <SelectItem value="personalizados">🎨 Personalizados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={guardarProducto}
                      className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white"
                    >
                      {productoEditando ? "Actualizar" : "Crear"} Producto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de productos */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productosFiltrados.map((producto) => (
                  <TableRow key={producto.id}>
                     <TableCell>
                       <img
                         src={producto.imagen_url || "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop"}
                         alt={producto.nombre}
                         className="w-12 h-12 rounded-lg object-cover"
                       />
                     </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{producto.nombre}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {producto.descripcion}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{getCategoriaIcon(producto.categoria)}</span>
                        <span className="capitalize">{producto.categoria}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-floral-pink">
                      S/. {producto.precio}
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${producto.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {producto.stock}
                      </span>
                      {producto.stock < 5 && (
                        <span className="text-xs text-red-500 block">Stock bajo</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        producto.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => abrirModal(producto)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => eliminarProducto(producto.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          🗑️
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🌸</div>
              <p className="text-2xl font-bold text-floral-pink">{productos.length}</p>
              <p className="text-sm text-gray-600">Total Productos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <p className="text-2xl font-bold text-red-600">
                {productos.filter(p => p.stock < 5).length}
              </p>
              <p className="text-sm text-gray-600">Stock Bajo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-2xl font-bold text-green-600">
                S/. {Math.round(productos.reduce((sum, p) => sum + p.precio, 0) / productos.length)}
              </p>
              <p className="text-sm text-gray-600">Precio Promedio</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-2xl font-bold text-blue-600">
                {productos.reduce((sum, p) => sum + p.stock, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Stock</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductos;

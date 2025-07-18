
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";

const inventarioData = [
  {
    id: 1,
    producto: "Ramo de Rosas Rojas",
    stockActual: 15,
    stockMinimo: 5,
    stockMaximo: 30,
    categoria: "ramos",
    ultimaActualizacion: "2024-01-15"
  },
  {
    id: 2,
    producto: "Caja Floral Elegante",
    stockActual: 8,
    stockMinimo: 3,
    stockMaximo: 20,
    categoria: "cajas", 
    ultimaActualizacion: "2024-01-14"
  },
  {
    id: 3,
    producto: "Arreglo Personalizado",
    stockActual: 2,
    stockMinimo: 2,
    stockMaximo: 10,
    categoria: "personalizados",
    ultimaActualizacion: "2024-01-13"
  },
  {
    id: 4,
    producto: "Bouquet Primaveral", 
    stockActual: 12,
    stockMinimo: 5,
    stockMaximo: 25,
    categoria: "ramos",
    ultimaActualizacion: "2024-01-15"
  },
  {
    id: 5,
    producto: "Caja de Girasoles",
    stockActual: 3,
    stockMinimo: 4,
    stockMaximo: 15,
    categoria: "cajas",
    ultimaActualizacion: "2024-01-12"
  }
];

const movimientosData = [
  {
    id: 1,
    producto: "Ramo de Rosas Rojas",
    tipo: "entrada",
    cantidad: 10,
    motivo: "Compra a proveedor",
    fecha: "2024-01-15",
    usuario: "Fiorela"
  },
  {
    id: 2,
    producto: "Caja Floral Elegante",
    tipo: "salida", 
    cantidad: 2,
    motivo: "Venta cliente",
    fecha: "2024-01-15",
    usuario: "Sistema"
  },
  {
    id: 3,
    producto: "Bouquet Primaveral",
    tipo: "salida",
    cantidad: 1,
    motivo: "Venta cliente",
    fecha: "2024-01-14", 
    usuario: "Sistema"
  }
];

const AdminInventario = () => {
  const [inventario, setInventario] = useState(inventarioData);
  const [movimientos, setMovimientos] = useState(movimientosData);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const { toast } = useToast();

  const getEstadoStock = (item: any) => {
    if (item.stockActual <= item.stockMinimo) {
      return { estado: "bajo", color: "bg-red-100 text-red-800", icon: "⚠️" };
    } else if (item.stockActual >= item.stockMaximo * 0.8) {
      return { estado: "alto", color: "bg-green-100 text-green-800", icon: "✅" };
    } else {
      return { estado: "normal", color: "bg-yellow-100 text-yellow-800", icon: "📊" };
    }
  };

  const actualizarStock = () => {
    const productoEncontrado = inventario.find(p => p.producto === productoSeleccionado);
    if (!productoEncontrado) return;

    const cantidadNum = parseInt(cantidad);
    const nuevaCantidad = tipoMovimiento === "entrada" 
      ? productoEncontrado.stockActual + cantidadNum
      : productoEncontrado.stockActual - cantidadNum;

    // Actualizar inventario
    setInventario(prev => 
      prev.map(item => 
        item.producto === productoSeleccionado
          ? { 
              ...item, 
              stockActual: Math.max(0, nuevaCantidad),
              ultimaActualizacion: new Date().toISOString().split('T')[0]
            }
          : item
      )
    );

    // Agregar movimiento
    const nuevoMovimiento = {
      id: Math.max(...movimientos.map(m => m.id)) + 1,
      producto: productoSeleccionado,
      tipo: tipoMovimiento,
      cantidad: cantidadNum,
      motivo: motivo || (tipoMovimiento === "entrada" ? "Reposición stock" : "Ajuste inventario"),
      fecha: new Date().toISOString().split('T')[0],
      usuario: "Fiorela"
    };

    setMovimientos(prev => [nuevoMovimiento, ...prev]);

    toast({
      title: "Stock actualizado 📦",
      description: `${tipoMovimiento === "entrada" ? "Agregadas" : "Retiradas"} ${cantidadNum} unidades de ${productoSeleccionado}`,
    });

    // Limpiar form
    setProductoSeleccionado("");
    setCantidad("");
    setMotivo("");
    setModalAbierto(false);
  };

  const productosConStockBajo = inventario.filter(item => item.stockActual <= item.stockMinimo);

  return (
    <AdminLayout title="Control de Inventario">
      <div className="space-y-6">
        {/* Alertas de stock bajo */}
        {productosConStockBajo.length > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                ⚠️ Alerta: Stock Bajo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-2">Los siguientes productos necesitan reposición:</p>
              <div className="space-y-1">
                {productosConStockBajo.map(item => (
                  <p key={item.id} className="text-sm text-red-600">
                    • {item.producto}: Solo {item.stockActual} unidades (mínimo: {item.stockMinimo})
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header con botón */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                📦 Estado del Inventario
              </span>
              <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogTrigger asChild>
                  <Button className="bg-floral-green hover:bg-floral-green-light text-white">
                    ➕ Actualizar Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Actualizar Stock</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="producto">Producto</Label>
                      <Select value={productoSeleccionado} onValueChange={setProductoSeleccionado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventario.map(item => (
                            <SelectItem key={item.id} value={item.producto}>
                              {item.producto} (Stock: {item.stockActual})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo de Movimiento</Label>
                      <Select value={tipoMovimiento} onValueChange={setTipoMovimiento}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entrada">➕ Entrada (Agregar stock)</SelectItem>
                          <SelectItem value="salida">➖ Salida (Retirar stock)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cantidad">Cantidad</Label>
                      <Input
                        id="cantidad"
                        type="number"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="motivo">Motivo (opcional)</Label>
                      <Input
                        id="motivo"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Ej: Compra a proveedor, ajuste..."
                      />
                    </div>
                    <Button 
                      onClick={actualizarStock}
                      className="w-full bg-floral-green hover:bg-floral-green-light text-white"
                      disabled={!productoSeleccionado || !cantidad}
                    >
                      Actualizar Stock
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Tabla de inventario */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Stock Máximo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Última Act.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventario.map((item) => {
                  const estadoStock = getEstadoStock(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{item.producto}</p>
                          <p className="text-sm text-gray-500 capitalize">{item.categoria}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-2xl font-bold">
                          {item.stockActual}
                        </span>
                      </TableCell>
                      <TableCell className="text-red-600 font-semibold">
                        {item.stockMinimo}
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        {item.stockMaximo}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoStock.color}`}>
                          {estadoStock.icon} {estadoStock.estado}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {item.ultimaActualizacion}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Historial de movimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Historial de Movimientos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimientos.slice(0, 10).map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="text-sm">
                      {mov.fecha}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {mov.producto}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        mov.tipo === "entrada" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {mov.tipo === "entrada" ? "➕ Entrada" : "➖ Salida"}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold">
                      {mov.cantidad}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {mov.motivo}
                    </TableCell>
                    <TableCell className="text-sm">
                      {mov.usuario}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Estadísticas del inventario */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-2xl font-bold text-blue-600">
                {inventario.reduce((sum, item) => sum + item.stockActual, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <p className="text-2xl font-bold text-red-600">
                {productosConStockBajo.length}
              </p>
              <p className="text-sm text-gray-600">Stock Bajo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-2xl font-bold text-green-600">
                {movimientos.filter(m => m.tipo === "entrada").length}
              </p>
              <p className="text-sm text-gray-600">Entradas Hoy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📉</div>
              <p className="text-2xl font-bold text-orange-600">
                {movimientos.filter(m => m.tipo === "salida").length}
              </p>
              <p className="text-sm text-gray-600">Salidas Hoy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInventario;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";

const AdminVentas = () => {
  const [ventas, setVentas] = useState<any[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);
  const { toast } = useToast();

  // Cargar comprobantes del localStorage
  useEffect(() => {
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes-pago') || '[]');
    const ventasData = comprobantes.map((comp: any, index: number) => ({
      id: comp.codigoPedido,
      cliente: `Cliente ${index + 1}`,
      telefono: "987654321",
      productos: [
        { nombre: "Ramo Rosas Rojas", cantidad: 2, precio: 45 },
        { nombre: "Caja Floral", cantidad: 1, precio: 65 }
      ],
      metodo: comp.metodoPago,
      total: comp.monto,
      comprobanteUrl: comp.archivo,
      nombreArchivo: comp.nombreArchivo,
      estado: "verificando",
      fecha: new Date(comp.fecha).toLocaleString('es-PE'),
      notas: ""
    }));
    setVentas(ventasData);
  }, []);

  const getEstadoBadge = (estado: string) => {
    const config = {
      verificando: { color: "bg-yellow-100 text-yellow-800", text: "Verificando" },
      confirmado: { color: "bg-green-100 text-green-800", text: "Confirmado" },
      rechazado: { color: "bg-red-100 text-red-800", text: "Rechazado" },
      fraudulento: { color: "bg-red-200 text-red-900", text: "Fraudulento" }
    };
    
    const config_estado = config[estado as keyof typeof config];
    return (
      <Badge className={config_estado?.color || "bg-gray-100 text-gray-800"}>
        {config_estado?.text || estado}
      </Badge>
    );
  };

  const validarComprobante = (ventaId: string, esValido: boolean, motivo?: string) => {
    setVentas(prev => 
      prev.map(venta => 
        venta.id === ventaId 
          ? { 
              ...venta, 
              estado: esValido ? "confirmado" : "rechazado",
              motivoRechazo: motivo 
            }
          : venta
      )
    );
    
    toast({
      title: esValido ? "Pago confirmado ✅" : "Pago rechazado ❌",
      description: `Venta ${ventaId} ${esValido ? 'confirmada' : 'rechazada'}`,
    });
  };

  const marcarFraudulento = (ventaId: string) => {
    setVentas(prev => 
      prev.map(venta => 
        venta.id === ventaId 
          ? { ...venta, estado: "fraudulento" }
          : venta
      )
    );
    
    toast({
      title: "Marcado como fraudulento 🚨",
      description: `Venta ${ventaId} marcada como fraudulenta`,
      variant: "destructive"
    });
  };

  const ventasFiltradas = ventas.filter(venta => {
    const cumpleEstado = filtroEstado === "todos" || venta.estado === filtroEstado;
    const cumpleBusqueda = 
      venta.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.telefono.includes(busqueda);
    return cumpleEstado && cumpleBusqueda;
  });

  return (
    <AdminLayout title="Gestión de Ventas y Comprobantes">
      <div className="space-y-6">
        {/* Header con filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 Ventas y Validación de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por código, cliente o teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="verificando">Verificando</SelectItem>
                  <SelectItem value="confirmado">Confirmados</SelectItem>
                  <SelectItem value="rechazado">Rechazados</SelectItem>
                  <SelectItem value="fraudulento">Fraudulentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de ventas */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código Venta</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Método Pago</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventasFiltradas.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell className="font-mono text-sm">
                      {venta.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{venta.cliente}</p>
                        <p className="text-xs text-gray-500">{venta.telefono}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {venta.productos.map((prod: any, idx: number) => (
                          <p key={idx} className="text-sm">
                            {prod.cantidad}x {prod.nombre} (S/.{prod.precio})
                          </p>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{venta.metodo}</Badge>
                    </TableCell>
                    <TableCell className="font-bold text-floral-pink">
                      S/. {venta.total}
                    </TableCell>
                    <TableCell>
                      {getEstadoBadge(venta.estado)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {venta.fecha}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setVentaSeleccionada(venta)}
                            >
                              🔍 Ver
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-full sm:max-w-lg">
                            <SheetHeader>
                              <SheetTitle>Detalle de Venta {venta.id}</SheetTitle>
                            </SheetHeader>
                            {ventaSeleccionada && (
                              <div className="space-y-4 mt-4">
                                <div>
                                  <Label className="font-semibold">Cliente:</Label>
                                  <p>{ventaSeleccionada.cliente} - {ventaSeleccionada.telefono}</p>
                                </div>
                                
                                <div>
                                  <Label className="font-semibold">Productos:</Label>
                                  <div className="space-y-1 mt-1">
                                    {ventaSeleccionada.productos.map((prod: any, idx: number) => (
                                      <div key={idx} className="flex justify-between text-sm">
                                        <span>{prod.cantidad}x {prod.nombre}</span>
                                        <span>S/. {prod.precio * prod.cantidad}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <Label className="font-semibold">Comprobante de Pago:</Label>
                                  <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-600 mb-2">Archivo subido por el cliente:</p>
                                    {ventaSeleccionada.comprobanteUrl ? (
                                      <div className="bg-white border rounded p-4">
                                        <img 
                                          src={ventaSeleccionada.comprobanteUrl} 
                                          alt="Comprobante de pago" 
                                          className="max-w-full h-auto max-h-96 mx-auto"
                                        />
                                        <p className="text-xs text-center mt-2 text-gray-500">
                                          {ventaSeleccionada.nombreArchivo}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="bg-white border-2 border-dashed p-8 text-center rounded">
                                        <div className="text-4xl mb-2">📄</div>
                                        <p className="text-sm">No hay comprobante disponible</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Label className="font-semibold">Notas:</Label>
                                  <Textarea 
                                    value={ventaSeleccionada.notas}
                                    placeholder="Agregar notas sobre la venta..."
                                    className="mt-1"
                                  />
                                </div>

                                {ventaSeleccionada.estado === "verificando" && (
                                  <div className="space-y-2 pt-4 border-t">
                                    <Label className="font-semibold">Validar Comprobante:</Label>
                                    <div className="flex gap-2">
                                      <Button 
                                        onClick={() => validarComprobante(ventaSeleccionada.id, true)}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                      >
                                        ✅ Confirmar Pago
                                      </Button>
                                      <Button 
                                        onClick={() => validarComprobante(ventaSeleccionada.id, false, "Comprobante no válido")}
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        ❌ Rechazar
                                      </Button>
                                    </div>
                                    <Button 
                                      onClick={() => marcarFraudulento(ventaSeleccionada.id)}
                                      variant="destructive"
                                      className="w-full bg-red-800 hover:bg-red-900"
                                    >
                                      🚨 Marcar como Fraudulento
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </SheetContent>
                        </Sheet>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">⏳</div>
              <p className="text-2xl font-bold text-yellow-600">
                {ventas.filter(v => v.estado === "verificando").length}
              </p>
              <p className="text-sm text-gray-600">Verificando</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-2xl font-bold text-green-600">
                {ventas.filter(v => v.estado === "confirmado").length}
              </p>
              <p className="text-sm text-gray-600">Confirmados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">❌</div>
              <p className="text-2xl font-bold text-red-600">
                {ventas.filter(v => v.estado === "rechazado").length}
              </p>
              <p className="text-sm text-gray-600">Rechazados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🚨</div>
              <p className="text-2xl font-bold text-red-800">
                {ventas.filter(v => v.estado === "fraudulento").length}
              </p>
              <p className="text-sm text-gray-600">Fraudulentos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-2xl font-bold text-floral-pink">
                S/. {ventas.filter(v => v.estado === "confirmado").reduce((sum, v) => sum + v.total, 0)}
              </p>
              <p className="text-sm text-gray-600">Ventas Válidas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVentas;

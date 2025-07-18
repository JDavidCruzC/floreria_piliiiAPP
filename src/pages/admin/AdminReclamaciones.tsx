
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminReclamaciones = () => {
  const [reclamos, setReclamos] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<any>(null);
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cargar reclamaciones desde Supabase
  const cargarReclamaciones = async () => {
    try {
      const { data, error } = await supabase
        .from('reclamaciones')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const reclamacionesFormateadas = data?.map(rec => ({
        id: rec.numero_reclamo,
        fecha: new Date(rec.created_at).toLocaleDateString('es-PE'),
        cliente: rec.cliente_nombre,
        email: rec.cliente_email,
        telefono: rec.cliente_telefono,
        tipo: rec.tipo_reclamo,
        pedidoId: rec.pedido_relacionado,
        descripcion: rec.descripcion,
        estado: rec.estado,
        respuesta: rec.respuesta,
        fechaRespuesta: rec.updated_at ? new Date(rec.updated_at).toLocaleDateString('es-PE') : null
      })) || [];
      
      setReclamos(reclamacionesFormateadas);
    } catch (error) {
      console.error('Error cargando reclamaciones:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reclamaciones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReclamaciones();
  }, []);

  const estadoColors = {
    pendiente: "bg-yellow-100 text-yellow-800",
    "en-proceso": "bg-blue-100 text-blue-800",
    resuelto: "bg-green-100 text-green-800"
  };

  const tipoLabels = {
    "producto-defectuoso": "Producto defectuoso",
    "entrega-tardia": "Entrega tardía",
    "atencion-cliente": "Atención al cliente",
    "precio-cobro": "Precio o cobro",
    "otro": "Otro"
  };

  const reclamosFiltrados = reclamos.filter(reclamo => {
    const cumpleFiltro = filtro === "todos" || reclamo.estado === filtro;
    const cumpleBusqueda = reclamo.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
                          reclamo.id.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  const estadisticas = {
    total: reclamos.length,
    pendientes: reclamos.filter(r => r.estado === "pendiente").length,
    enProceso: reclamos.filter(r => r.estado === "en-proceso").length,
    resueltos: reclamos.filter(r => r.estado === "resuelto").length
  };

  const handleResponder = (reclamo: any) => {
    setReclamoSeleccionado(reclamo);
    setRespuesta(reclamo.respuesta || "");
  };

  const handleGuardarRespuesta = async (nuevoEstado: string) => {
    if (!reclamoSeleccionado) return;

    try {
      const { error } = await supabase
        .from('reclamaciones')
        .update({
          respuesta,
          estado: nuevoEstado
        })
        .eq('numero_reclamo', reclamoSeleccionado.id);
        
      if (error) throw error;
      
      cargarReclamaciones();
      toast({
        title: "Respuesta guardada",
        description: `El reclamo ha sido marcado como ${nuevoEstado}`,
      });

      setReclamoSeleccionado(null);
      setRespuesta("");
    } catch (error) {
      console.error('Error guardando respuesta:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la respuesta",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout title="Gestión de Reclamaciones">
      <div className="space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{estadisticas.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{estadisticas.enProceso}</div>
                <div className="text-sm text-gray-600">En Proceso</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{estadisticas.resueltos}</div>
                <div className="text-sm text-gray-600">Resueltos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por cliente o ID de reclamo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <Select value={filtro} onValueChange={setFiltro}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="en-proceso">En proceso</SelectItem>
                  <SelectItem value="resuelto">Resueltos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de reclamos */}
        <Card>
          <CardHeader>
            <CardTitle>Libro de Reclamaciones</CardTitle>
            <CardDescription>
              Lista de todos los reclamos registrados por los clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Reclamo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reclamosFiltrados.map((reclamo) => (
                  <TableRow key={reclamo.id}>
                    <TableCell className="font-mono text-sm">{reclamo.id}</TableCell>
                    <TableCell>{reclamo.fecha}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reclamo.cliente}</div>
                        <div className="text-sm text-gray-500">{reclamo.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{tipoLabels[reclamo.tipo as keyof typeof tipoLabels]}</TableCell>
                    <TableCell>
                      <Badge className={estadoColors[reclamo.estado as keyof typeof estadoColors]}>
                        {reclamo.estado.charAt(0).toUpperCase() + reclamo.estado.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResponder(reclamo)}
                          >
                            Ver detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Reclamo {reclamo.id}</DialogTitle>
                            <DialogDescription>
                              Registrado el {reclamo.fecha}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Cliente</label>
                                <p>{reclamo.cliente}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <p>{reclamo.email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Teléfono</label>
                                <p>{reclamo.telefono}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Pedido relacionado</label>
                                <p>{reclamo.pedidoId || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Descripción del reclamo</label>
                              <p className="mt-1 p-3 bg-gray-50 rounded">{reclamo.descripcion}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Respuesta</label>
                              <Textarea
                                value={respuesta}
                                onChange={(e) => setRespuesta(e.target.value)}
                                placeholder="Escriba su respuesta al cliente..."
                                rows={4}
                                className="mt-1"
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleGuardarRespuesta("en-proceso")}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Marcar en proceso
                              </Button>
                              <Button 
                                onClick={() => handleGuardarRespuesta("resuelto")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Marcar como resuelto
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReclamaciones;

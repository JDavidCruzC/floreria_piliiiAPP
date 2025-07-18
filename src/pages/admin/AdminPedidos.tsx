
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import OrderFilters from "@/components/admin/OrderFilters";
import OrdersTable from "@/components/admin/OrdersTable";
import DeliveryTrackingPanel from "@/components/admin/DeliveryTrackingPanel";
import OrderStatistics from "@/components/admin/OrderStatistics";
import { supabase } from "@/integrations/supabase/client";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cargar pedidos desde Supabase
  const cargarPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes_pedidos (nombre, telefono, direccion)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const pedidosFormateados = data?.map(pedido => ({
        id: pedido.numero_pedido,
        cliente: pedido.clientes_pedidos?.nombre || 'Cliente',
        productos: `Pedido ${pedido.numero_pedido}`,
        estado: pedido.estado,
        total: pedido.total,
        fecha: new Date(pedido.created_at).toLocaleDateString('es-PE'),
        metodo: pedido.metodo_pago || 'No especificado',
        direccion: pedido.clientes_pedidos?.direccion || 'No especificada',
        tieneGeolocalizacion: pedido.clientes_pedidos?.direccion !== 'Retiro en local'
      })) || [];
      
      setPedidos(pedidosFormateados);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cambiarEstado = async (pedidoId: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado as any })
        .eq('numero_pedido', pedidoId);
        
      if (error) throw error;
      
      cargarPedidos();
      toast({
        title: "Estado actualizado 🌸",
        description: `Pedido ${pedidoId} marcado como ${nuevoEstado}`,
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido",
        variant: "destructive"
      });
    }
  };

  const asignarDelivery = (pedidoId: string) => {
    toast({
      title: "Pedido asignado 🚚",
      description: `El pedido ${pedidoId} ha sido asignado a repartidor`,
    });
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    const cumpleEstado = filtroEstado === "todos" || pedido.estado === filtroEstado;
    const cumpleBusqueda = 
      pedido.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.cliente.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleEstado && cumpleBusqueda;
  });

  return (
    <AdminLayout title="Gestión de Pedidos">
      <div className="space-y-6">
        <OrderFilters
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
        />
        
        <OrdersTable
          pedidos={pedidosFiltrados}
          cambiarEstado={cambiarEstado}
          asignarDelivery={asignarDelivery}
        />
        
        <DeliveryTrackingPanel />
        
        <OrderStatistics pedidos={pedidos} />
      </div>
    </AdminLayout>
  );
};

export default AdminPedidos;

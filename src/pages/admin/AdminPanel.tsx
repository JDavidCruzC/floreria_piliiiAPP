import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const usuario = JSON.parse(localStorage.getItem("floreria_user") || "{}");
const nombre = usuario.nombre || "Usuario";

const AdminPanel = () => {
  const [statsData, setStatsData] = useState([
    {
      title: "Pedidos Hoy",
      value: "0",
      description: "Actualizado en tiempo real",
      icon: "📋",
      color: "text-blue-600",
    },
    {
      title: "Ventas del Día",
      value: "S/. 0.00",
      description: "Actualizado en tiempo real",
      icon: "💰",
      color: "text-green-600",
    },
    {
      title: "Productos Activos",
      value: "0",
      description: "",
      icon: "🌸",
      color: "text-floral-pink",
    },
    {
      title: "Clientes Nuevos",
      value: "0",
      description: "Registrados esta semana",
      icon: "👥",
      color: "text-purple-600",
    },
  ]);

  const [pedidosRecientes, setPedidosRecientes] = useState<any[]>([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState<
    { id: string; nombre: string; precio: number; vendidos: number }[]
  >([]);
  const [productosMenosVendidos, setProductosMenosVendidos] = useState<
    { id: string; nombre: string; precio: number; vendidos: number }[]
  >([]);

  const getEstadoBadge = (estado: string) => {
    const classes = {
      pendiente: "bg-yellow-100 text-yellow-800",
      preparando: "bg-blue-100 text-blue-800",
      entregado: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          classes[estado as keyof typeof classes]
        }`}
      >
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      // Fechas
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isoToday = today.toISOString();
      const now = new Date();
      const diff = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      monday.setHours(0, 0, 0, 0);
      const isoMonday = monday.toISOString();

      // 1) Pedidos de hoy y totales de ventas
      const pedidosHoyRes = await supabase
        .from("pedidos")
        .select("total", { count: "exact", head: false })
        .gte("created_at", isoToday);

      // 2) Pedidos recientes con nombre de cliente
      const pedidosRecRes = await supabase
        .from("pedidos")
        .select(
          "id, estado, total, created_at, clientes_pedidos!inner(nombre)"
        )
        .order("created_at", { ascending: false })
        .limit(5);

      // 3) Productos activos
      const productosActRes = await supabase
        .from("productos")
        .select("id", { count: "exact", head: true })
        .eq("activo", true);

      // 4) Clientes nuevos desde el lunes
      const clientesNuevosRes = await supabase
        .from("usuarios")
        .select("id", { count: "exact", head: true })
        .gte("created_at", isoMonday);

      // 5) Detalles para calcular más/menos vendidos
      const detallesRes = await supabase
        .from("pedido_detalles")
        .select("producto_id, cantidad");

      // --- Procesar datos ---
      const pedidosHoyCount = pedidosHoyRes.count || 0;
      const totalVentasHoy =
        pedidosHoyRes.data?.reduce(
          (sum, p) => sum + Number(p.total || 0),
          0
        ) || 0;
      const productosActCount = productosActRes.count || 0;
      const clientesNuevosCount = clientesNuevosRes.count || 0;

      // Estadísticas
      setStatsData([
        {
          title: "Pedidos Hoy",
          value: pedidosHoyCount.toString(),
          description: "Actualizado en tiempo real",
          icon: "📋",
          color: "text-blue-600",
        },
        {
          title: "Ventas del Día",
          value: `S/. ${totalVentasHoy.toFixed(2)}`,
          description: "Actualizado en tiempo real",
          icon: "💰",
          color: "text-green-600",
        },
        {
          title: "Productos Activos",
          value: productosActCount.toString(),
          description: "",
          icon: "🌸",
          color: "text-floral-pink",
        },
        {
          title: "Clientes Nuevos",
          value: clientesNuevosCount.toString(),
          description: "Registrados esta semana",
          icon: "👥",
          color: "text-purple-600",
        },
      ]);

      // Pedidos recientes: mapear cliente
      setPedidosRecientes(
        (pedidosRecRes.data || []).map((p: any) => ({
          id: p.id,
          estado: p.estado,
          total: p.total,
          created_at: p.created_at,
          cliente: p.clientes_pedidos?.nombre || "—",
        }))
      );

      // Agregar cantidades por producto
      const ventaPorProducto: Record<string, number> = {};
      detallesRes.data?.forEach((d: any) => {
        ventaPorProducto[d.producto_id] =
          (ventaPorProducto[d.producto_id] || 0) + d.cantidad;
      });

      const productoIds = Object.keys(ventaPorProducto);
      const productosInfoRes = await supabase
        .from("productos")
        .select("id, nombre, precio")
        .in("id", productoIds);

      const fusionados =
        productosInfoRes.data?.map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          vendidos: ventaPorProducto[p.id] || 0,
        })) || [];

      const masVendidos = fusionados
        .filter((p) => p.vendidos > 0)
        .sort((a, b) => b.vendidos - a.vendidos)
        .slice(0, 3);

      const menosVendidos = fusionados
        .filter((p) => p.vendidos > 0)
        .sort((a, b) => a.vendidos - b.vendidos)
        .slice(0, 3);

      setProductosMasVendidos(masVendidos);
      setProductosMenosVendidos(menosVendidos);
    };

    fetchDashboard();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Bienvenida */}
        <div className="bg-gradient-to-r from-floral-rose to-floral-peach p-6 rounded-lg">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
            ¡Buen día, {nombre}! 🌸
          </h2>
          <p className="text-gray-600">
            Aquí tienes un resumen de tu florería para hoy.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <span className="text-2xl">{stat.icon}</span>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pedidos Recientes, Más Vendidos y Menos Vendidos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pedidos Recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Pedidos Recientes
              </CardTitle>
              <CardDescription>Últimos pedidos recibidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pedidosRecientes.map((pedido: any) => (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {`FP-${pedido.id.toString().padStart(6, "0")}`}
                        </span>
                        {getEstadoBadge(pedido.estado)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {pedido.cliente}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-floral-pink">
                        S/. {pedido.total}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(pedido.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Más Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔥 Más Vendidos
              </CardTitle>
              <CardDescription>
                Los productos estrella esta semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productosMasVendidos.map((prod, idx) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{prod.nombre}</p>
                        <p className="text-xs text-green-700">
                          {prod.vendidos} vendidos
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      S/. {prod.precio}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menos Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Menos Vendidos
              </CardTitle>
              <CardDescription>Productos que necesitan atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productosMenosVendidos.map((prod, idx) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                        ⚠️
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{prod.nombre}</p>
                        <p className="text-xs text-orange-700">
                          Solo {prod.vendidos} vendidos
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-orange-600">
                      S/. {prod.precio}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Sugerencia:</strong> Considera promociones
                  especiales para estos productos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/admin/pedidos"
                className="p-4 bg-floral-rose hover:bg-floral-rose-dark rounded-lg text-center transition-colors block"
              >
                <div className="text-2xl mb-2">➕</div>
                <p className="text-sm font-semibold">Nuevo Pedido</p>
              </Link>
              <Link
                to="/admin/productos"
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors block"
              >
                <div className="text-2xl mb-2">🌸</div>
                <p className="text-sm font-semibold">Agregar Producto</p>
              </Link>
              <Link
                to="/admin/inventario"
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors block"
              >
                <div className="text-2xl mb-2">📦</div>
                <p className="text-sm font-semibold">Actualizar Stock</p>
              </Link>
              <Link
                to="/admin/reportes"
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors block"
              >
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-semibold">Ver Reportes</p>
              </Link>
              <Link
                to="/admin/configuracion"
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors block"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <p className="text-sm font-semibold">Configurar Pagos</p>
              </Link>
              <Link
                to="/admin/ventas"
                className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors block"
              >
                <div className="text-2xl mb-2">💰</div>
                <p className="text-sm font-semibold">Ver Ventas</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;

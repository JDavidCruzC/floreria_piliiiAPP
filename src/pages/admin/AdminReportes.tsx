
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const AdminReportes = () => {
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalPedidos: 0,
    ventaPromedio: 0,
    clientesUnicos: 0
  });
  const [ventasPorDia, setVentasPorDia] = useState<any[]>([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tipoEntrega = [
    { name: "Delivery", value: 65, color: "#ff6b9d" },
    { name: "Retiro Local", value: 35, color: "#4a9b8e" }
  ];

  const metodosPago = [
    { name: "Yape", value: 45, color: "#8b5cf6" },
    { name: "Plin", value: 30, color: "#06b6d4" },
    { name: "Efectivo", value: 25, color: "#10b981" }
  ];

  // Cargar estadísticas reales desde Supabase
  const cargarEstadisticas = async () => {
    try {
      // Obtener pedidos confirmados
      const { data: pedidos, error: errorPedidos } = await supabase
        .from('pedidos')
        .select('*')
        .in('estado', ['confirmado', 'preparando', 'en_delivery', 'entregado']);

      if (errorPedidos) throw errorPedidos;

      // Obtener clientes únicos
      const { data: clientes, error: errorClientes } = await supabase
        .from('clientes_pedidos')
        .select('id');

      if (errorClientes) throw errorClientes;

      // Calcular estadísticas
      const totalVentas = pedidos?.reduce((sum, p) => sum + Number(p.total), 0) || 0;
      const totalPedidos = pedidos?.length || 0;
      const ventaPromedio = totalPedidos > 0 ? Math.round(totalVentas / totalPedidos) : 0;
      const clientesUnicos = clientes?.length || 0;

      setStats({
        totalVentas,
        totalPedidos,
        ventaPromedio,
        clientesUnicos
      });

      // Generar datos de ventas por día (últimos 7 días)
      const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const ventasPorDiaData = diasSemana.map((dia, index) => {
        const pedidosDelDia = pedidos?.filter(p => {
          const fecha = new Date(p.created_at);
          return fecha.getDay() === index;
        }) || [];
        
        return {
          dia,
          ventas: pedidosDelDia.reduce((sum, p) => sum + Number(p.total), 0),
          pedidos: pedidosDelDia.length
        };
      });

      setVentasPorDia(ventasPorDiaData);

      // Productos más vendidos desde detalles de pedidos
      const { data: detalles, error: errorDetalles } = await supabase
        .from('pedido_detalles')
        .select(`
          cantidad,
          productos (nombre)
        `);

      if (!errorDetalles && detalles) {
        const productosVentas = detalles.reduce((acc, detalle) => {
          const nombre = detalle.productos?.nombre || 'Producto desconocido';
          acc[nombre] = (acc[nombre] || 0) + detalle.cantidad;
          return acc;
        }, {} as Record<string, number>);

        const totalProductosVendidos = Object.values(productosVentas).reduce((sum, cant) => sum + cant, 0);
        
        const productosRanking = Object.entries(productosVentas)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 4)
          .map(([producto, cantidad]) => ({
            producto,
            cantidad,
            porcentaje: Math.round((cantidad / totalProductosVendidos) * 100)
          }));

        setProductosMasVendidos(productosRanking);
      }

    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  return (
    <AdminLayout title="Reportes y Estadísticas">
      <div className="space-y-6">
        {/* Header con filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                📊 Panel de Reportes
              </span>
              <div className="flex gap-4">
                <Select defaultValue="semana">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hoy">Hoy</SelectItem>
                    <SelectItem value="semana">Esta semana</SelectItem>
                    <SelectItem value="mes">Este mes</SelectItem>
                    <SelectItem value="ano">Este año</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-floral-green hover:bg-floral-green-light text-white">
                  📄 Exportar PDF
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Análisis de ventas y rendimiento de Florería Pili
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
             <CardContent className="p-6 text-center">
               <div className="text-3xl mb-2">💰</div>
               <p className="text-3xl font-bold text-blue-600">S/. {stats.totalVentas}</p>
               <p className="text-sm text-blue-700">Ventas Totales</p>
               <p className="text-xs text-blue-600">Datos reales</p>
             </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100">
             <CardContent className="p-6 text-center">
               <div className="text-3xl mb-2">📋</div>
               <p className="text-3xl font-bold text-green-600">{stats.totalPedidos}</p>
               <p className="text-sm text-green-700">Pedidos Completados</p>
               <p className="text-xs text-green-600">Datos reales</p>
             </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
             <CardContent className="p-6 text-center">
               <div className="text-3xl mb-2">💳</div>
               <p className="text-3xl font-bold text-purple-600">S/. {stats.ventaPromedio}</p>
               <p className="text-sm text-purple-700">Venta Promedio</p>
               <p className="text-xs text-purple-600">Datos reales</p>
             </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-pink-50 to-pink-100">
             <CardContent className="p-6 text-center">
               <div className="text-3xl mb-2">👥</div>
               <p className="text-3xl font-bold text-pink-600">{stats.clientesUnicos}</p>
               <p className="text-sm text-pink-700">Clientes Únicos</p>
               <p className="text-xs text-pink-600">Datos reales</p>
             </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de ventas por día */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📈 Ventas por Día
              </CardTitle>
              <CardDescription>
                Evolución de ventas durante la semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'ventas' ? `S/. ${value}` : value,
                      name === 'ventas' ? 'Ventas' : 'Pedidos'
                    ]}
                  />
                  <Bar dataKey="ventas" fill="#ff6b9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de pedidos por día */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Pedidos por Día
              </CardTitle>
              <CardDescription>
                Número de pedidos recibidos diariamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ventasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="pedidos" 
                    stroke="#4a9b8e" 
                    strokeWidth={3}
                    dot={{ fill: "#4a9b8e", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Productos más vendidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌸 Productos Más Vendidos
            </CardTitle>
            <CardDescription>
              Ranking de productos con mejor rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productosMasVendidos.map((producto, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-floral-pink text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{producto.producto}</p>
                      <p className="text-sm text-gray-600">{producto.cantidad} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-floral-pink">{producto.porcentaje}%</p>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-floral-pink h-2 rounded-full" 
                        style={{ width: `${producto.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tipo de entrega */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚚 Tipo de Entrega
              </CardTitle>
              <CardDescription>
                Distribución entre delivery y retiro local
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={tipoEntrega}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tipoEntrega.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {tipoEntrega.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Métodos de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💳 Métodos de Pago
              </CardTitle>
              <CardDescription>
                Preferencias de pago de los clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={metodosPago}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metodosPago.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {metodosPago.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de insights */}
        <Card className="bg-gradient-to-r from-floral-rose to-floral-peach">
          <CardHeader>
            <CardTitle className="text-gray-800">
              💡 Insights de la Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-2">📈 Tendencias Positivas:</p>
                <ul className="space-y-1">
                  <li>• Los fines de semana generan 40% más ventas</li>
                  <li>• Los ramos de rosas son el producto estrella</li>
                  <li>• El delivery representa el 65% de entregas</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">🎯 Oportunidades:</p>
                <ul className="space-y-1">
                  <li>• Promover arreglos personalizados (menor demanda)</li>
                  <li>• Incentivar el retiro local con descuentos</li>
                  <li>• Crear promociones para días de semana</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReportes;

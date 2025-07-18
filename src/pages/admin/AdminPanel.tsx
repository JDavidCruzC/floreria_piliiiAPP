import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";

const statsData = [
  {
    title: "Pedidos Hoy",
    value: "12",
    description: "+3 desde ayer",
    icon: "📋",
    color: "text-blue-600"
  },
  {
    title: "Ventas del Día",
    value: "S/. 1,240",
    description: "+15% vs ayer",
    icon: "💰",
    color: "text-green-600"
  },
  {
    title: "Productos Activos",
    value: "24",
    description: "3 con stock bajo",
    icon: "🌸",
    color: "text-floral-pink"
  },
  {
    title: "Clientes Nuevos",
    value: "8",
    description: "Esta semana",
    icon: "👥",
    color: "text-purple-600"
  }
];

const pedidosRecientes = [
  { id: "FP-001234", cliente: "María González", estado: "pendiente", total: 65, tiempo: "10 min" },
  { id: "FP-001235", cliente: "Carlos Ruiz", estado: "preparando", total: 45, tiempo: "25 min" },
  { id: "FP-001236", cliente: "Ana Torres", estado: "entregado", total: 80, tiempo: "1 hora" },
  { id: "FP-001237", cliente: "Luis Mendoza", estado: "pendiente", total: 35, tiempo: "5 min" },
  { id: "FP-001238", cliente: "Sofia Paz", estado: "preparando", total: 95, tiempo: "30 min" }
];

const productosMasVendidos = [
  { nombre: "Ramo de Rosas Rojas", vendidos: 24, precio: 45, emoji: "🌹" },
  { nombre: "Caja Floral Elegante", vendidos: 18, precio: 65, emoji: "📦" },
  { nombre: "Arreglo Personalizado", vendidos: 15, precio: 80, emoji: "🎨" }
];

const productosMenosVendidos = [
  { nombre: "Ramo de Girasoles", vendidos: 3, precio: 35, emoji: "🌻" },
  { nombre: "Amigurumi Unicornio", vendidos: 2, precio: 25, emoji: "🦄" },
  { nombre: "Arreglo de Orquídeas", vendidos: 1, precio: 120, emoji: "🌺" }
];

const AdminPanel = () => {
  const getEstadoBadge = (estado: string) => {
    const classes = {
      pendiente: "bg-yellow-100 text-yellow-800",
      preparando: "bg-blue-100 text-blue-800", 
      entregado: "bg-green-100 text-green-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${classes[estado as keyof typeof classes]}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Bienvenida */}
        <div className="bg-gradient-to-r from-floral-rose to-floral-peach p-6 rounded-lg">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
            ¡Buen día, Fiorela! 🌸
          </h2>
          <p className="text-gray-600">
            Aquí tienes un resumen de tu florería para hoy.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pedidos recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Pedidos Recientes
              </CardTitle>
              <CardDescription>
                Últimos pedidos recibidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pedidosRecientes.map((pedido) => (
                  <div key={pedido.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{pedido.id}</span>
                        {getEstadoBadge(pedido.estado)}
                      </div>
                      <p className="text-sm text-gray-600">{pedido.cliente}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-floral-pink">S/. {pedido.total}</p>
                      <p className="text-xs text-gray-500">{pedido.tiempo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Productos más vendidos */}
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
                {productosMasVendidos.map((producto, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm flex items-center gap-1">
                          {producto.emoji} {producto.nombre}
                        </p>
                        <p className="text-xs text-green-700">{producto.vendidos} vendidos</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-600">S/. {producto.precio}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Productos menos vendidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Menos Vendidos
              </CardTitle>
              <CardDescription>
                Productos que necesitan atención
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productosMenosVendidos.map((producto, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                        ⚠️
                      </div>
                      <div>
                        <p className="font-semibold text-sm flex items-center gap-1">
                          {producto.emoji} {producto.nombre}
                        </p>
                        <p className="text-xs text-orange-700">Solo {producto.vendidos} vendidos</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-orange-600">S/. {producto.precio}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Sugerencia:</strong> Considera promociones especiales para estos productos
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
              <Link to="/admin/pedidos" className="p-4 bg-floral-rose hover:bg-floral-rose-dark rounded-lg text-center transition-colors block">
                <div className="text-2xl mb-2">➕</div>
                <p className="text-sm font-semibold">Nuevo Pedido</p>
              </Link>
              <Link to="/admin/productos" className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors block">
                <div className="text-2xl mb-2">🌸</div>
                <p className="text-sm font-semibold">Agregar Producto</p>
              </Link>
              <Link to="/admin/inventario" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors block">
                <div className="text-2xl mb-2">📦</div>
                <p className="text-sm font-semibold">Actualizar Stock</p>
              </Link>
              <Link to="/admin/reportes" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors block">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-semibold">Ver Reportes</p>
              </Link>
              <Link to="/admin/configuracion" className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors block">
                <div className="text-2xl mb-2">⚙️</div>
                <p className="text-sm font-semibold">Configurar Pagos</p>
              </Link>
              <Link to="/admin/ventas" className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors block">
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

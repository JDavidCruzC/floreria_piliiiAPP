
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FloralIcon from './FloralIcon';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const menuItems = [
  { path: "/admin/panel", label: "Dashboard", icon: "📊" },
  { path: "/admin/pedidos", label: "Pedidos", icon: "📋" },
  { path: "/admin/ventas", label: "Ventas", icon: "💰" },
  { path: "/admin/productos", label: "Productos", icon: "🌸" },
  { path: "/admin/inventario", label: "Inventario", icon: "📦" },
  { path: "/admin/reportes", label: "Reportes", icon: "📈" },
  { path: "/admin/usuarios", label: "Usuarios", icon: "👥" },
  { path: "/admin/reclamaciones", label: "Reclamaciones", icon: "📝" }
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-serif font-bold floral-text-gradient">
                🌸 Florería Pili - Admin
              </h1>
              {title && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-600 font-medium">{title}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Bienvenida, Fiorela 👋
              </span>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Cerrar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-80px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-floral-rose text-floral-pink font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

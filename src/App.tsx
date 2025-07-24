import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClienteInicio from "./pages/cliente/ClienteInicio";
import ClienteCatalogo from "./pages/cliente/ClienteCatalogo";
import ClienteDetalle from "./pages/cliente/ClienteDetalle";
import ClientePersonalizar from "./pages/cliente/ClientePersonalizar";
import ClienteCatalogoPersonalizar from "./pages/cliente/ClienteCatalogoPersonalizar";
import ClientePersonalizarAvanzado from "./pages/cliente/ClientePersonalizarAvanzado";
import ClienteCarrito from "./pages/cliente/ClienteCarrito";
import ClientePago from "./pages/cliente/ClientePago";
import ClienteConfirmacion from "./pages/cliente/ClienteConfirmacion";
import ClienteReclamaciones from "./pages/cliente/ClienteReclamaciones";
import ClienteContacto from "./pages/cliente/ClienteContacto";
import ClienteSeguimientoDelivery from "./pages/cliente/ClienteSeguimientoDelivery";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminInventario from "./pages/admin/AdminInventario";
import AdminReportes from "./pages/admin/AdminReportes";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminVentas from "./pages/admin/AdminVentas";
import AdminReclamaciones from "./pages/admin/AdminReclamaciones";
import AdminModelos from "./pages/admin/AdminModelos";
import AdminConfiguracion from "./pages/admin/AdminConfiguracion";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryPanel from "./pages/delivery/DeliveryPanel";
import DeliveryRuta from "./pages/delivery/DeliveryRuta";
import UniversalLogin from "./pages/UniversalLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Ruta de Login Universal */}
          <Route path="/login" element={<UniversalLogin />} />
          
          {/* Rutas del Cliente - App Móvil */}
          <Route path="/cliente" element={<ClienteInicio />} />
          <Route path="/cliente/catalogo" element={<ClienteCatalogo />} />
          <Route path="/cliente/personalizar-catalogo" element={<ClienteCatalogoPersonalizar />} />
          <Route path="/cliente/personalizar-avanzado/:categoria" element={<ClientePersonalizarAvanzado />} />
          <Route path="/cliente/producto/:id" element={<ClienteDetalle />} />
          <Route path="/cliente/personalizar/:id" element={<ClientePersonalizar />} />
          <Route path="/cliente/carrito" element={<ClienteCarrito />} />
          <Route path="/cliente/pago" element={<ClientePago />} />
          <Route path="/cliente/confirmacion" element={<ClienteConfirmacion />} />
          <Route path="/cliente/seguimiento" element={<ClienteSeguimientoDelivery />} />
          <Route path="/cliente/reclamaciones" element={<ClienteReclamaciones />} />
          <Route path="/cliente/contacto" element={<ClienteContacto />} />
          
          {/* Rutas del Admin - Panel Web */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/admin/pedidos" element={<AdminPedidos />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/inventario" element={<AdminInventario />} />
          <Route path="/admin/ventas" element={<AdminVentas />} />
          <Route path="/admin/reportes" element={<AdminReportes />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/reclamaciones" element={<AdminReclamaciones />} />
          <Route path="/admin/modelos" element={<AdminModelos />} />
          <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
          
          {/* Rutas del Personal de Delivery */}
          <Route path="/delivery" element={<DeliveryLogin />} />
          <Route path="/delivery/panel" element={<DeliveryPanel />} />
          <Route path="/delivery/ruta/:id" element={<DeliveryRuta />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

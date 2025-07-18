
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck } from "lucide-react";

interface Order {
  id: string;
  cliente: string;
  productos: string;
  estado: string;
  total: number;
  fecha: string;
  metodo: string;
  direccion: string;
  tieneGeolocalizacion: boolean;
}

interface OrdersTableProps {
  pedidos: Order[];
  cambiarEstado: (pedidoId: string, nuevoEstado: string) => void;
  asignarDelivery: (pedidoId: string) => void;
}

const OrdersTable = ({ pedidos, cambiarEstado, asignarDelivery }: OrdersTableProps) => {
  const getEstadoBadge = (estado: string) => {
    const config = {
      pendiente: { variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
      preparando: { variant: "secondary", color: "bg-blue-100 text-blue-800" },
      entregado: { variant: "secondary", color: "bg-green-100 text-green-800" },
      cancelado: { variant: "secondary", color: "bg-red-100 text-red-800" }
    };
    
    return (
      <Badge className={config[estado as keyof typeof config]?.color || "bg-gray-100 text-gray-800"}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell className="font-mono text-sm">
                  {pedido.id}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{pedido.cliente}</p>
                    <div className="flex items-center text-xs text-gray-500 gap-1">
                      <MapPin size={12} />
                      {pedido.direccion}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{pedido.productos}</p>
                  <p className="text-xs text-gray-500">Pago: {pedido.metodo}</p>
                </TableCell>
                <TableCell>
                  {getEstadoBadge(pedido.estado)}
                </TableCell>
                <TableCell className="font-bold text-floral-pink">
                  S/. {pedido.total}
                </TableCell>
                <TableCell className="text-sm">
                  {pedido.fecha}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {pedido.estado === "pendiente" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cambiarEstado(pedido.id, "preparando")}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        🔄 Preparar
                      </Button>
                    )}
                    {pedido.estado === "preparando" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cambiarEstado(pedido.id, "entregado")}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          ✅ Entregar
                        </Button>
                        {pedido.tieneGeolocalizacion && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => asignarDelivery(pedido.id)}
                            className="flex items-center gap-1 text-amber-600 border-amber-600 hover:bg-amber-50"
                          >
                            <Truck size={14} /> Delivery
                          </Button>
                        )}
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      👁️
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;

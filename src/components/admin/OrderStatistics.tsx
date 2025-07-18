
import { Card, CardContent } from "@/components/ui/card";

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

interface OrderStatisticsProps {
  pedidos: Order[];
}

const OrderStatistics = ({ pedidos }: OrderStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-2xl font-bold text-yellow-600">
            {pedidos.filter(p => p.estado === "pendiente").length}
          </p>
          <p className="text-sm text-gray-600">Pendientes</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl mb-2">🔄</div>
          <p className="text-2xl font-bold text-blue-600">
            {pedidos.filter(p => p.estado === "preparando").length}
          </p>
          <p className="text-sm text-gray-600">Preparando</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl mb-2">✅</div>
          <p className="text-2xl font-bold text-green-600">
            {pedidos.filter(p => p.estado === "entregado").length}
          </p>
          <p className="text-sm text-gray-600">Entregados</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl mb-2">💰</div>
          <p className="text-2xl font-bold text-floral-pink">
            S/. {pedidos.reduce((sum, p) => sum + p.total, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Ventas</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStatistics;

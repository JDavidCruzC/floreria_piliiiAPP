// src/components/admin/OrderFilters.tsx
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderFiltersProps {
  busqueda: string;
  setBusqueda: (v: string) => void;
  filtroEstado: string;
  setFiltroEstado: (v: string) => void;
}

type Cliente = {
  id: string;
  nombre: string;
  telefono: string;
  direccion: string;
};

type Producto = {
  id: string;
  nombre: string;
  stock: number;
  precio: number;
};

export default function OrderFilters({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
}: OrderFiltersProps) {
  const [modalPedido, setModalPedido] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const { toast } = useToast();

  // Formulario nuevo cliente
  const [clienteForm, setClienteForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  // Formulario nuevo pedido
  const [pedidoForm, setPedidoForm] = useState({
    cliente_id: "",
    metodo_pago: "Efectivo",
    necesita_delivery: false,
    delivery_address: "",
    comprobante_file: null as File | null,
    notas: "",
    fecha_entrega: "",
    hora_entrega: "",
    items: [] as { producto_id: string; cantidad: number }[],
  });

  // Carga inicial de clientes y productos
  useEffect(() => {
    cargarClientes();
    cargarProductos();
  }, []);

  const cargarClientes = async () => {
    const { data } = await supabase
      .from("clientes_pedidos")
      .select("id, nombre, telefono, direccion")
      .order("nombre");
    setClientes(data || []);
  };

  const cargarProductos = async () => {
    const { data } = await supabase
      .from("productos")
      .select("id, nombre, stock, precio")
      .eq("activo", true)
      .order("nombre");
    const prods = (data as Producto[]) || [];
    setProductos(prods);
    setPedidoForm((f) => ({
      ...f,
      items: prods.map((p) => ({ producto_id: p.id, cantidad: 0 })),
    }));
  };

  // Reset formulario al cerrar modal de pedido
  useEffect(() => {
    if (!modalPedido) {
      setPedidoForm((f) => ({
        cliente_id: "",
        metodo_pago: "Efectivo",
        necesita_delivery: false,
        delivery_address: "",
        comprobante_file: null,
        notas: "",
        fecha_entrega: "",
        hora_entrega: "",
        items: productos.map((p) => ({ producto_id: p.id, cantidad: 0 })),
      }));
    }
  }, [modalPedido, productos]);

  // Crear cliente
  const crearCliente = async () => {
    if (!clienteForm.nombre || !clienteForm.telefono || !clienteForm.direccion) {
      toast({ title: "Faltan datos", description: "Completa todos los campos", variant: "destructive" });
      return;
    }
    const { data: cli, error } = await supabase
      .from("clientes_pedidos")
      .insert(clienteForm)
      .select("id, nombre")
      .single();
    if (error || !cli) {
      toast({ title: "Error", description: "No se pudo crear cliente", variant: "destructive" });
    } else {
      toast({ title: "Cliente creado", description: cli.nombre });
      setModalCliente(false);
      cargarClientes();
      setPedidoForm((f) => ({ ...f, cliente_id: cli.id, delivery_address: cli.direccion }));
    }
  };

  // Subir comprobante y obtener URL
  const uploadComprobante = async (): Promise<string> => {
    if (!pedidoForm.comprobante_file) return "";
    const file = pedidoForm.comprobante_file;
    const path = `comprobantes/${Date.now()}_${file.name}`;
    await supabase.storage.from("comprobantes").upload(path, file);
    const { publicURL } = supabase.storage.from("comprobantes").getPublicUrl(path);
    return publicURL;
  };

  // Total calculado con delivery
  const totalCalculado = useMemo(() => {
    const base = pedidoForm.items.reduce((sum, it) => {
      if (it.cantidad <= 0) return sum;
      const prod = productos.find((p) => p.id === it.producto_id);
      return prod ? sum + it.cantidad * prod.precio : sum;
    }, 0);
    return base + (pedidoForm.necesita_delivery ? 10 : 0);
  }, [pedidoForm.items, pedidoForm.necesita_delivery, productos]);

  // Crear pedido
  const crearPedido = async () => {
    if (
      !pedidoForm.cliente_id ||
      !pedidoForm.fecha_entrega ||
      !pedidoForm.hora_entrega
    ) {
      toast({
        title: "Faltan datos",
        description: "Selecciona cliente, fecha y hora",
        variant: "destructive",
      });
      return;
    }
    try {
      const usuario = JSON.parse(localStorage.getItem("floreria_user") || "{}");
      const numero = `FP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const comprobante_url = await uploadComprobante();
      const { data: ped, error: errP } = await supabase
        .from("pedidos")
        .insert({
          numero_pedido: numero,
          cliente_id: pedidoForm.cliente_id,
          estado: "pendiente",
          total: totalCalculado,
          metodo_pago: pedidoForm.metodo_pago,
          comprobante_pago: comprobante_url,
          notas: pedidoForm.notas,
          fecha_entrega: pedidoForm.fecha_entrega,
          hora_entrega: pedidoForm.hora_entrega,
          creado_por: usuario.id,
        })
        .select("id")
        .single();
      if (errP || !ped) throw errP;
      const detalles = pedidoForm.items
        .filter((i) => i.cantidad > 0)
        .map((i) => ({
          pedido_id: ped.id,
          producto_id: i.producto_id,
          cantidad: i.cantidad,
          precio_unitario:
            productos.find((p) => p.id === i.producto_id)?.precio || 0,
        }));
      if (detalles.length) {
        await supabase.from("pedido_detalles").insert(detalles);
      }
      toast({ title: "Pedido creado", description: numero });
      setModalPedido(false);
      window.dispatchEvent(new Event("reload-pedidos"));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "No se pudo crear pedido", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📋 Pedidos Activos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Buscar */}
          <div className="flex-1">
            <Input
              placeholder="Buscar código o cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          {/* Filtrar */}
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="preparando">Preparando</SelectItem>
              <SelectItem value="entregado">Entregados</SelectItem>
            </SelectContent>
          </Select>
          {/* Nuevo Pedido */}
          <Dialog open={modalPedido} onOpenChange={setModalPedido}>
            <DialogTrigger asChild>
              <Button className="bg-floral-pink hover:bg-floral-pink-dark text-white">
                ➕ Nuevo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent  className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 mx-4 my-8 rounded-lg"  style={{ boxSizing: "border-box" }}>

              <DialogHeader>
                <DialogTitle>Nuevo Pedido</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Cliente + Nuevo Cliente */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="cli-select">Cliente</Label>
                    <Select
                      value={pedidoForm.cliente_id}
                      onValueChange={(v) => {
                        const cli = clientes.find((c) => c.id === v);
                        setPedidoForm((f) => ({
                          ...f,
                          cliente_id: v,
                          delivery_address: cli?.direccion || "",
                        }));
                      }}
                    >
                      <SelectTrigger id="cli-select">
                        <SelectValue placeholder="Selecciona cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModalCliente(true)}
                  >
                    ➕ Cliente
                  </Button>
                </div>

                {/* Mostrar celular */}
                {pedidoForm.cliente_id && (
                  <div>
                    <Label>Celular</Label>
                    <Input
                      value={
                        clientes.find((c) => c.id === pedidoForm.cliente_id)
                          ?.telefono || ""
                      }
                      disabled
                    />
                  </div>
                )}

                {/* Productos */}
                <div>
                  <Label>Productos</Label>
                  <div className="space-y-2 max-h-60 overflow-auto p-2 border rounded">
                    {pedidoForm.items.map((it, idx) => {
                      const prod = productos.find(
                        (p) => p.id === it.producto_id
                      )!;
                      return (
                        <div
                          key={it.producto_id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="font-semibold">{prod.nombre}</p>
                            <p className="text-xs text-gray-500">
                              S/. {prod.precio.toFixed(2)} — stock: {prod.stock}
                            </p>
                          </div>
                          <Input
                            type="number"
                            min={0}
                            max={prod.stock}
                            value={it.cantidad}
                            onChange={(e) => {
                              const val = Math.max(
                                0,
                                Math.min(prod.stock, +e.target.value)
                              );
                              setPedidoForm((f) => {
                                const items = [...f.items];
                                items[idx].cantidad = val;
                                return { ...f, items };
                              });
                            }}
                            className="w-20"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total calculado */}
                <div>
                  <Label>Total</Label>
                  <p className="text-xl font-bold">
                    S/. {totalCalculado.toFixed(2)}
                    {pedidoForm.necesita_delivery && (
                      <span className="text-sm text-gray-500 ml-2">
                        (+S/.10 delivery)
                      </span>
                    )}
                  </p>
                </div>

                {/* Delivery toggle + dirección automática (solo lectura) */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={pedidoForm.necesita_delivery}
                    onCheckedChange={(v) =>
                      setPedidoForm((f) => ({
                        ...f,
                        necesita_delivery: !!v,
                      }))
                    }
                  />
                  <Label>Requiere delivery</Label>
                </div>

                {pedidoForm.necesita_delivery && pedidoForm.cliente_id && (
                  <div>
                    <Label>Dirección de entrega (del cliente)</Label>
                    <Textarea
                      disabled
                      value={
                        clientes.find((c) => c.id === pedidoForm.cliente_id)?.direccion || ""
                      }
                    />
                  </div>
                )}


                {/* Método de pago */}
                <div>
                  <Label htmlFor="mpago">Método de pago</Label>
                  <Select
                    value={pedidoForm.metodo_pago}
                    onValueChange={(v) =>
                      setPedidoForm((f) => ({ ...f, metodo_pago: v }))
                    }
                  >
                    <SelectTrigger id="mpago">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="Plin">Plin</SelectItem>
                      <SelectItem value="Yape">Yape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Comprobante */}
                <div>
                  <Label htmlFor="comprobante">Comprobante</Label>
                  <Input
                    id="comprobante"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      setPedidoForm((f) => ({
                        ...f,
                        comprobante_file: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>

                {/* Notas */}
                <div>
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    value={pedidoForm.notas}
                    onChange={(e) =>
                      setPedidoForm((f) => ({ ...f, notas: e.target.value }))
                    }
                  />
                </div>

                {/* Fecha y hora */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_entrega">Fecha de entrega</Label>
                    <Input
                      id="fecha_entrega"
                      type="date"
                      value={pedidoForm.fecha_entrega}
                      onChange={(e) =>
                        setPedidoForm((f) => ({
                          ...f,
                          fecha_entrega: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="hora_entrega">Hora de entrega</Label>
                    <Input
                      id="hora_entrega"
                      type="time"
                      value={pedidoForm.hora_entrega}
                      onChange={(e) =>
                        setPedidoForm((f) => ({
                          ...f,
                          hora_entrega: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Botón Crear */}
                <Button
                  onClick={crearPedido}
                  className="w-full bg-floral-pink hover:bg-floral-pink-dark text-white"
                >
                  Crear Pedido
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Sub‑modal Nuevo Cliente */}
          <Dialog open={modalCliente} onOpenChange={setModalCliente}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nuevo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cli-nombre">Nombre</Label>
                  <Input
                    id="cli-nombre"
                    value={clienteForm.nombre}
                    onChange={(e) =>
                      setClienteForm((c) => ({ ...c, nombre: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cli-tel">Teléfono</Label>
                  <Input
                    id="cli-tel"
                    value={clienteForm.telefono}
                    onChange={(e) =>
                      setClienteForm((c) => ({ ...c, telefono: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cli-dir">Dirección</Label>
                  <Textarea
                    id="cli-dir"
                    value={clienteForm.direccion}
                    onChange={(e) =>
                      setClienteForm((c) => ({ ...c, direccion: e.target.value }))
                    }
                  />
                </div>
                <Button
                  onClick={crearCliente}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Crear Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

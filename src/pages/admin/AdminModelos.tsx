
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";

const AdminModelos = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ramos");
  
  // Estados para modelos de ramos
  const [modelosRamos, setModelosRamos] = useState({
    tipos: [
      { id: "clasico", nombre: "Ramo Clásico", precio: 0, forma: "circular" },
      { id: "cascada", nombre: "Ramo Cascada", precio: 15, forma: "cascada" }
    ],
    flores: [
      { id: "rosas", nombre: "Rosas", precio: 0, colores: ["#FF0000", "#FFFFFF"], emoji: "🌹" }
    ]
  });

  // Estados para modelos de amigurumis
  const [modelosAmigurumis, setModelosAmigurumis] = useState({
    tipos: [
      { id: "oso", nombre: "Osito", precio: 0, emoji: "🧸", partes: ["cabeza", "cuerpo", "brazos", "piernas"] }
    ],
    colores: [
      { id: "rosa", nombre: "Rosa", precio: 0, hex: "#FFB6C1", disponible: true }
    ]
  });

  // Estados para formularios
  const [nuevoTipoRamo, setNuevoTipoRamo] = useState({
    nombre: "",
    precio: 0,
    forma: "circular"
  });

  const [nuevaFlor, setNuevaFlor] = useState({
    nombre: "",
    precio: 0,
    emoji: "",
    colores: ""
  });

  const [nuevoTipoAmigurumi, setNuevoTipoAmigurumi] = useState({
    nombre: "",
    precio: 0,
    emoji: "",
    partes: ""
  });

  const [nuevoColorAmigurumi, setNuevoColorAmigurumi] = useState({
    nombre: "",
    precio: 0,
    hex: "#FFB6C1",
    disponible: true
  });

  // Funciones para agregar modelos de ramos
  const agregarTipoRamo = () => {
    if (!nuevoTipoRamo.nombre) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive"
      });
      return;
    }

    const id = nuevoTipoRamo.nombre.toLowerCase().replace(/\s+/g, '_');
    const nuevoTipo = {
      id,
      ...nuevoTipoRamo
    };

    setModelosRamos(prev => ({
      ...prev,
      tipos: [...prev.tipos, nuevoTipo]
    }));

    setNuevoTipoRamo({ nombre: "", precio: 0, forma: "circular" });
    
    toast({
      title: "Tipo de ramo agregado",
      description: `${nuevoTipoRamo.nombre} agregado exitosamente`
    });
  };

  const agregarFlor = () => {
    if (!nuevaFlor.nombre || !nuevaFlor.emoji) {
      toast({
        title: "Error",
        description: "Nombre y emoji son requeridos",
        variant: "destructive"
      });
      return;
    }

    const id = nuevaFlor.nombre.toLowerCase().replace(/\s+/g, '_');
    const coloresArray = nuevaFlor.colores.split(',').map(c => c.trim()).filter(c => c);
    
    const nuevaFlorObj = {
      id,
      nombre: nuevaFlor.nombre,
      precio: nuevaFlor.precio,
      emoji: nuevaFlor.emoji,
      colores: coloresArray.length > 0 ? coloresArray : ["#FFB6C1"]
    };

    setModelosRamos(prev => ({
      ...prev,
      flores: [...prev.flores, nuevaFlorObj]
    }));

    setNuevaFlor({ nombre: "", precio: 0, emoji: "", colores: "" });
    
    toast({
      title: "Flor agregada",
      description: `${nuevaFlor.nombre} agregada exitosamente`
    });
  };

  // Funciones para agregar modelos de amigurumis
  const agregarTipoAmigurumi = () => {
    if (!nuevoTipoAmigurumi.nombre || !nuevoTipoAmigurumi.emoji) {
      toast({
        title: "Error",
        description: "Nombre y emoji son requeridos",
        variant: "destructive"
      });
      return;
    }

    const id = nuevoTipoAmigurumi.nombre.toLowerCase().replace(/\s+/g, '_');
    const partesArray = nuevoTipoAmigurumi.partes.split(',').map(p => p.trim()).filter(p => p);
    
    const nuevoTipo = {
      id,
      nombre: nuevoTipoAmigurumi.nombre,
      precio: nuevoTipoAmigurumi.precio,
      emoji: nuevoTipoAmigurumi.emoji,
      partes: partesArray.length > 0 ? partesArray : ["cabeza", "cuerpo"]
    };

    setModelosAmigurumis(prev => ({
      ...prev,
      tipos: [...prev.tipos, nuevoTipo]
    }));

    setNuevoTipoAmigurumi({ nombre: "", precio: 0, emoji: "", partes: "" });
    
    toast({
      title: "Tipo de amigurumi agregado",
      description: `${nuevoTipoAmigurumi.nombre} agregado exitosamente`
    });
  };

  const agregarColorAmigurumi = () => {
    if (!nuevoColorAmigurumi.nombre) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive"
      });
      return;
    }

    const id = nuevoColorAmigurumi.nombre.toLowerCase().replace(/\s+/g, '_');
    const nuevoColor = {
      id,
      ...nuevoColorAmigurumi
    };

    setModelosAmigurumis(prev => ({
      ...prev,
      colores: [...prev.colores, nuevoColor]
    }));

    setNuevoColorAmigurumi({ nombre: "", precio: 0, hex: "#FFB6C1", disponible: true });
    
    toast({
      title: "Color agregado",
      description: `${nuevoColorAmigurumi.nombre} agregado exitosamente`
    });
  };

  // Funciones para eliminar modelos
  const eliminarTipoRamo = (id: string) => {
    setModelosRamos(prev => ({
      ...prev,
      tipos: prev.tipos.filter(t => t.id !== id)
    }));
    toast({
      title: "Tipo eliminado",
      description: "Tipo de ramo eliminado exitosamente"
    });
  };

  const eliminarFlor = (id: string) => {
    setModelosRamos(prev => ({
      ...prev,
      flores: prev.flores.filter(f => f.id !== id)
    }));
    toast({
      title: "Flor eliminada",
      description: "Flor eliminada exitosamente"
    });
  };

  const eliminarTipoAmigurumi = (id: string) => {
    setModelosAmigurumis(prev => ({
      ...prev,
      tipos: prev.tipos.filter(t => t.id !== id)
    }));
    toast({
      title: "Tipo eliminado",
      description: "Tipo de amigurumi eliminado exitosamente"
    });
  };

  const eliminarColorAmigurumi = (id: string) => {
    setModelosAmigurumis(prev => ({
      ...prev,
      colores: prev.colores.filter(c => c.id !== id)
    }));
    toast({
      title: "Color eliminado",
      description: "Color eliminado exitosamente"
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Modelos</h1>
          <Button 
            onClick={() => {
              toast({
                title: "Modelos guardados",
                description: "Todos los cambios han sido guardados exitosamente"
              });
            }}
            className="bg-floral-green hover:bg-floral-green-light"
          >
            💾 Guardar Cambios
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ramos">🌸 Modelos de Ramos</TabsTrigger>
            <TabsTrigger value="amigurumis">🧸 Modelos de Amigurumis</TabsTrigger>
          </TabsList>

          <TabsContent value="ramos" className="space-y-6">
            {/* Tipos de Ramos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌸 Tipos de Ramos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulario para agregar nuevo tipo */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={nuevoTipoRamo.nombre}
                      onChange={(e) => setNuevoTipoRamo(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Ramo Elegante"
                    />
                  </div>
                  <div>
                    <Label>Precio Extra (S/.)</Label>
                    <Input
                      type="number"
                      value={nuevoTipoRamo.precio}
                      onChange={(e) => setNuevoTipoRamo(prev => ({ ...prev, precio: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Forma</Label>
                    <Select value={nuevoTipoRamo.forma} onValueChange={(value) => setNuevoTipoRamo(prev => ({ ...prev, forma: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circular">Circular</SelectItem>
                        <SelectItem value="cascada">Cascada</SelectItem>
                        <SelectItem value="compacto">Compacto</SelectItem>
                        <SelectItem value="libre">Libre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={agregarTipoRamo} className="w-full">
                      ➕ Agregar
                    </Button>
                  </div>
                </div>

                {/* Lista de tipos existentes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modelosRamos.tipos.map((tipo) => (
                    <div key={tipo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{tipo.nombre}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          (S/. {tipo.precio}) - {tipo.forma}
                        </span>
                      </div>
                      <Button
                        onClick={() => eliminarTipoRamo(tipo.id)}
                        variant="destructive"
                        size="sm"
                      >
                        🗑️
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tipos de Flores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌺 Tipos de Flores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulario para agregar nueva flor */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={nuevaFlor.nombre}
                      onChange={(e) => setNuevaFlor(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Rosas Premium"
                    />
                  </div>
                  <div>
                    <Label>Precio Extra (S/.)</Label>
                    <Input
                      type="number"
                      value={nuevaFlor.precio}
                      onChange={(e) => setNuevaFlor(prev => ({ ...prev, precio: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Emoji</Label>
                    <Input
                      value={nuevaFlor.emoji}
                      onChange={(e) => setNuevaFlor(prev => ({ ...prev, emoji: e.target.value }))}
                      placeholder="🌹"
                    />
                  </div>
                  <div>
                    <Label>Colores (separados por coma)</Label>
                    <Input
                      value={nuevaFlor.colores}
                      onChange={(e) => setNuevaFlor(prev => ({ ...prev, colores: e.target.value }))}
                      placeholder="#FF0000, #FFFFFF, #FFB6C1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={agregarFlor} className="w-full">
                      ➕ Agregar
                    </Button>
                  </div>
                </div>

                {/* Lista de flores existentes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modelosRamos.flores.map((flor) => (
                    <div key={flor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{flor.emoji}</span>
                        <div>
                          <span className="font-medium">{flor.nombre}</span>
                          <span className="text-sm text-gray-500 ml-2">(S/. {flor.precio})</span>
                          <div className="flex gap-1 mt-1">
                            {flor.colores.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                            {flor.colores.length > 3 && (
                              <span className="text-xs text-gray-400">+{flor.colores.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => eliminarFlor(flor.id)}
                        variant="destructive"
                        size="sm"
                      >
                        🗑️
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amigurumis" className="space-y-6">
            {/* Tipos de Amigurumis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧸 Tipos de Amigurumis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulario para agregar nuevo tipo */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={nuevoTipoAmigurumi.nombre}
                      onChange={(e) => setNuevoTipoAmigurumi(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Dragón"
                    />
                  </div>
                  <div>
                    <Label>Precio Extra (S/.)</Label>
                    <Input
                      type="number"
                      value={nuevoTipoAmigurumi.precio}
                      onChange={(e) => setNuevoTipoAmigurumi(prev => ({ ...prev, precio: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Emoji</Label>
                    <Input
                      value={nuevoTipoAmigurumi.emoji}
                      onChange={(e) => setNuevoTipoAmigurumi(prev => ({ ...prev, emoji: e.target.value }))}
                      placeholder="🐉"
                    />
                  </div>
                  <div>
                    <Label>Partes (separadas por coma)</Label>
                    <Input
                      value={nuevoTipoAmigurumi.partes}
                      onChange={(e) => setNuevoTipoAmigurumi(prev => ({ ...prev, partes: e.target.value }))}
                      placeholder="cabeza, cuerpo, alas, cola"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={agregarTipoAmigurumi} className="w-full">
                      ➕ Agregar
                    </Button>
                  </div>
                </div>

                {/* Lista de tipos existentes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modelosAmigurumis.tipos.map((tipo) => (
                    <div key={tipo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tipo.emoji}</span>
                        <div>
                          <span className="font-medium">{tipo.nombre}</span>
                          <span className="text-sm text-gray-500 ml-2">(S/. {tipo.precio})</span>
                          <div className="text-xs text-gray-400">
                            Partes: {tipo.partes.join(", ")}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => eliminarTipoAmigurumi(tipo.id)}
                        variant="destructive"
                        size="sm"
                      >
                        🗑️
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Colores de Amigurumis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎨 Colores Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulario para agregar nuevo color */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={nuevoColorAmigurumi.nombre}
                      onChange={(e) => setNuevoColorAmigurumi(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Violeta"
                    />
                  </div>
                  <div>
                    <Label>Precio Extra (S/.)</Label>
                    <Input
                      type="number"
                      value={nuevoColorAmigurumi.precio}
                      onChange={(e) => setNuevoColorAmigurumi(prev => ({ ...prev, precio: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Color Hex</Label>
                    <Input
                      type="color"
                      value={nuevoColorAmigurumi.hex}
                      onChange={(e) => setNuevoColorAmigurumi(prev => ({ ...prev, hex: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="disponible"
                      checked={nuevoColorAmigurumi.disponible}
                      onChange={(e) => setNuevoColorAmigurumi(prev => ({ ...prev, disponible: e.target.checked }))}
                    />
                    <Label htmlFor="disponible">Disponible</Label>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={agregarColorAmigurumi} className="w-full">
                      ➕ Agregar
                    </Button>
                  </div>
                </div>

                {/* Lista de colores existentes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {modelosAmigurumis.colores.map((color) => (
                    <div key={color.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <span className="font-medium">{color.nombre}</span>
                          <span className="text-sm text-gray-500 ml-2">(S/. {color.precio})</span>
                          <div className="text-xs text-gray-400">
                            {color.disponible ? "✅ Disponible" : "❌ No disponible"}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => eliminarColorAmigurumi(color.id)}
                        variant="destructive"
                        size="sm"
                      >
                        🗑️
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminModelos;

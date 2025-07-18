
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom roles enum
CREATE TYPE user_role AS ENUM ('gerente', 'vendedor', 'delivery', 'marketing');

-- Create custom order status enum
CREATE TYPE order_status AS ENUM ('pendiente', 'confirmado', 'preparando', 'en_delivery', 'entregado', 'cancelado');

-- Create custom delivery status enum
CREATE TYPE delivery_status AS ENUM ('asignado', 'en_ruta', 'entregado', 'fallido');

-- Usuarios del sistema (empleados)
CREATE TABLE usuarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol user_role NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Productos
CREATE TABLE productos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    stock INTEGER DEFAULT 0,
    imagen_url TEXT,
    personalizable BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clientes (para pedidos sin registro)
CREATE TABLE clientes_pedidos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pedidos
CREATE TABLE pedidos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    cliente_id UUID REFERENCES clientes_pedidos(id),
    estado order_status DEFAULT 'pendiente',
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50),
    comprobante_pago TEXT,
    notas TEXT,
    fecha_entrega DATE,
    hora_entrega TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detalles de pedidos
CREATE TABLE pedido_detalles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    personalizacion JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries
CREATE TABLE deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pedido_id UUID REFERENCES pedidos(id),
    usuario_delivery_id UUID REFERENCES usuarios(id),
    estado delivery_status DEFAULT 'asignado',
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_entrega TIMESTAMP WITH TIME ZONE,
    ubicacion_actual JSONB,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuraciones del sistema
CREATE TABLE configuraciones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auditoría de acciones
CREATE TABLE auditoria (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id),
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(50),
    registro_id UUID,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuraciones_updated_at BEFORE UPDATE ON configuraciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuarios iniciales con contraseñas hasheadas (se actualizarán via API)
INSERT INTO usuarios (codigo, password_hash, nombre, rol, activo) VALUES
('ADMIN001', '$2b$10$placeholder', 'Fiorela Pili', 'gerente', true),
('VEND001', '$2b$10$placeholder', 'María González', 'vendedor', true),
('FLOR001', '$2b$10$placeholder', 'Carlos Delivery', 'delivery', true),
('FLOR002', '$2b$10$placeholder', 'Luis Repartidor', 'delivery', false),
('MARK001', '$2b$10$placeholder', 'Ana Marketing', 'marketing', true);

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria, stock, personalizable, activo) VALUES
('Ramo de Rosas Rojas', 'Hermoso ramo de 12 rosas rojas frescas', 45.00, 'ramos', 20, true, true),
('Caja Floral Elegante', 'Caja con arreglo floral mixto', 65.00, 'cajas', 15, true, true),
('Arreglo Personalizado', 'Arreglo floral completamente personalizable', 80.00, 'personalizados', 10, true, true),
('Ramo de Girasoles', 'Ramo alegre de girasoles frescos', 35.00, 'ramos', 12, false, true),
('Amigurumi Unicornio', 'Peluche artesanal de unicornio', 25.00, 'amigurumis', 8, false, true),
('Arreglo de Orquídeas', 'Elegante arreglo con orquídeas', 120.00, 'premium', 5, false, true);

-- Insertar configuraciones iniciales
INSERT INTO configuraciones (clave, valor, descripcion) VALUES
('qr_pago_yape', '123456789', 'Número de teléfono para pagos Yape'),
('qr_pago_plin', '987654321', 'Número de teléfono para pagos Plin'),
('qr_pago_bcp', '1234567890123456', 'Número de cuenta BCP'),
('delivery_costo', '10.00', 'Costo de delivery en soles'),
('horario_apertura', '08:00', 'Hora de apertura'),
('horario_cierre', '20:00', 'Hora de cierre');

-- Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (se pueden refinar según necesidades)
CREATE POLICY "Usuarios pueden ver su propia información" ON usuarios FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Productos visibles para todos" ON productos FOR SELECT USING (activo = true);
CREATE POLICY "Configuraciones visibles para usuarios autenticados" ON configuraciones FOR SELECT TO authenticated USING (true);

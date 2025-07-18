
-- Crear tabla de reclamaciones faltante
CREATE TABLE reclamaciones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    numero_reclamo VARCHAR(20) UNIQUE NOT NULL,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100),
    cliente_telefono VARCHAR(20),
    tipo_reclamo VARCHAR(50) NOT NULL,
    pedido_relacionado VARCHAR(20),
    descripcion TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    respuesta TEXT,
    usuario_asignado_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para updated_at en reclamaciones
CREATE TRIGGER update_reclamaciones_updated_at BEFORE UPDATE ON reclamaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar clientes de ejemplo
INSERT INTO clientes_pedidos (nombre, telefono, direccion, email) VALUES
('María González', '987654321', 'Av. Lima 123, San Isidro', 'maria.gonzalez@email.com'),
('Carlos Ruiz', '912345678', 'Jr. Flores 456, Miraflores', 'carlos.ruiz@email.com'),
('Ana Torres', '965432109', 'Calle Rosa 789, Surco', 'ana.torres@email.com'),
('Luis Mendoza', '987123456', 'Av. Principal 321, San Borja', 'luis.mendoza@email.com'),
('Sofia Paz', '954321087', 'Jr. Jardín 654, La Molina', 'sofia.paz@email.com');

-- Insertar pedidos de ejemplo
INSERT INTO pedidos (numero_pedido, cliente_id, estado, total, metodo_pago, fecha_entrega, hora_entrega, notas) VALUES
('FP-001234', (SELECT id FROM clientes_pedidos WHERE nombre = 'María González'), 'pendiente', 65.00, 'yape', CURRENT_DATE, '14:00', 'Entregar en recepción'),
('FP-001235', (SELECT id FROM clientes_pedidos WHERE nombre = 'Carlos Ruiz'), 'preparando', 45.00, 'plin', CURRENT_DATE, '16:30', 'Llamar antes de llegar'),
('FP-001236', (SELECT id FROM clientes_pedidos WHERE nombre = 'Ana Torres'), 'entregado', 80.00, 'transferencia', CURRENT_DATE - 1, '11:00', 'Entregado exitosamente'),
('FP-001237', (SELECT id FROM clientes_pedidos WHERE nombre = 'Luis Mendoza'), 'pendiente', 35.00, 'yape', CURRENT_DATE, '18:00', NULL),
('FP-001238', (SELECT id FROM clientes_pedidos WHERE nombre = 'Sofia Paz'), 'preparando', 95.00, 'plin', CURRENT_DATE + 1, '10:00', 'Pedido especial');

-- Insertar detalles de pedidos
INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario, personalizacion) VALUES
-- Pedido FP-001234 (María González - S/65.00)
((SELECT id FROM pedidos WHERE numero_pedido = 'FP-001234'), (SELECT id FROM productos WHERE nombre = 'Ramo de Rosas Rojas'), 1, 45.00, '{"color": "rojo", "dedicatoria": "Para mamá"}'),
((SELECT id FROM pedidos WHERE numero_pedido = 'FP-001234'), (SELECT id FROM productos WHERE nombre = 'Amigurumi Unicornio'), 1, 25.00, NULL),

-- Pedido FP-001235 (Carlos Ruiz - S/45.00)
((SELECT id FROM pedidos WHERE numero_pedido = 'FP-001235'), (SELECT id FROM productos WHERE nombre = 'Ramo de Rosas Rojas'), 1, 45.00, '{"color": "blanco"}'),

-- Pedido FP-001236 (Ana Torres - S/80.00)
((SELECT id FROM pedidos WHERE numero_pedido = 'FP-001236'), (SELECT id FROM productos WHERE nombre = 'Arreglo Personalizado'), 1, 80.00, '{"flores": "mixtas", "colores": "pasteles"}'),

-- Pedido FP-001237 (Luis Mendoza - S/35.00)
((SELECT id FROM pedidos WHERE numero_pedido = 'FP-001237'), (SELECT id FROM productos WHERE nombre = 'Ramo de Girasoles'), 1, 35.00, NULL),

-- Pedido FP-001238 (Sofia Paz - S/95.00)
((SELECT id FROM pedidos WHERE numero_pedido = 'FP-001238'), (SELECT id FROM productos WHERE nombre = 'Caja Floral Elegante'), 1, 65.00, '{"tamaño": "grande"}'),
((SELECT id FROM pedidos WHERE numero_pedido = 'FP-001238'), (SELECT id FROM productos WHERE nombre = 'Amigurumi Unicornio'), 1, 25.00, '{"color": "rosado"}');

-- Insertar reclamaciones de ejemplo
INSERT INTO reclamaciones (numero_reclamo, cliente_nombre, cliente_email, cliente_telefono, tipo_reclamo, pedido_relacionado, descripcion, estado) VALUES
('REC-001', 'Pedro López', 'pedro.lopez@email.com', '987456123', 'calidad', 'FP-001230', 'Las flores llegaron marchitas', 'pendiente'),
('REC-002', 'Carmen Silva', 'carmen.silva@email.com', '965741852', 'delivery', 'FP-001225', 'El pedido llegó 3 horas tarde', 'en_proceso'),
('REC-003', 'Roberto Vega', 'roberto.vega@email.com', '912789456', 'producto', 'FP-001220', 'El arreglo no coincide con la foto', 'resuelto');

-- Insertar configuraciones adicionales para el sistema
INSERT INTO configuraciones (clave, valor, descripcion) VALUES
('empresa_nombre', 'Florería Pili', 'Nombre de la empresa'),
('empresa_telefono', '987-654-321', 'Teléfono principal de contacto'),
('empresa_email', 'info@floreriapili.com', 'Email de contacto principal'),
('empresa_direccion', 'Av. Principal 123, Lima', 'Dirección principal'),
('facebook_url', 'https://facebook.com/floreriapili', 'URL de Facebook'),
('instagram_url', 'https://instagram.com/floreriapili', 'URL de Instagram'),
('tiktok_url', 'https://tiktok.com/@floreriapili', 'URL de TikTok'),
('youtube_url', 'https://youtube.com/@floreriapili', 'URL de YouTube'),
('whatsapp_numero', '+51987654321', 'Número de WhatsApp'),
('horario_lunes_viernes', '9:00 AM - 7:00 PM', 'Horarios de lunes a viernes'),
('horario_sabados', '9:00 AM - 6:00 PM', 'Horarios de sábados'),
('horario_domingos', '10:00 AM - 4:00 PM', 'Horarios de domingos'),
('delivery_minimo', '30.00', 'Monto mínimo para delivery'),
('delivery_gratuito', '100.00', 'Monto para delivery gratuito');

-- Insertar deliveries de ejemplo
INSERT INTO deliveries (pedido_id, usuario_delivery_id, estado, fecha_inicio, ubicacion_actual, notas) VALUES
((SELECT id FROM pedidos WHERE numero_pedido = 'FP-001235'), (SELECT id FROM usuarios WHERE codigo = 'FLOR001'), 'en_ruta', NOW() - INTERVAL '30 minutes', '{"lat": -12.0464, "lng": -77.0428, "direccion": "Av. Lima 456"}', 'En camino al destino'),
((SELECT id FROM pedidos WHERE numero_pedido = 'FP-001236'), (SELECT id FROM usuarios WHERE codigo = 'FLOR001'), 'entregado', NOW() - INTERVAL '2 hours', '{"lat": -12.0464, "lng": -77.0428, "direccion": "Calle Rosa 789"}', 'Entregado exitosamente');

-- Actualizar stock de productos basado en ventas
UPDATE productos SET stock = stock - 3 WHERE nombre = 'Ramo de Rosas Rojas';
UPDATE productos SET stock = stock - 2 WHERE nombre = 'Amigurumi Unicornio';
UPDATE productos SET stock = stock - 1 WHERE nombre = 'Arreglo Personalizado';
UPDATE productos SET stock = stock - 1 WHERE nombre = 'Ramo de Girasoles';
UPDATE productos SET stock = stock - 1 WHERE nombre = 'Caja Floral Elegante';

![Encabezado Florería Pili](/public/encabezado.png)

🌸 **Florería Pili App — Gestión y Ventas de Flores en Línea**🌸
-----------------------------------------------------------------

Sistema web completo para la gestión de una florería, desarrollado con tecnologías modernas como **React**, **Supabase**, **Tailwind CSS** y arquitectura escalable en la nube.  
Ideal para administración, ventas y marketing de una florería, integrando funcionalidades para usuarios internos y clientes.

---

###  Características

* Gestión de usuarios por rol: `gerente`, `admin`, `vendedor`, `delivery`, `marketing`
* Catálogo de productos florales para venta directa
* Gestión de pedidos y seguimiento de entregas
* Contacto vía WhatsApp, correo y teléfono desde la app
* Redes sociales integradas
* Inicio de sesión seguro con contraseñas cifradas
* Paneles de administración con accesos restringidos según el rol

---

### Arquitectura General
```
Florería Pili App
├── Cliente (Web)
│ └── React + Tailwind + Vite
├── Backend
│ └── Supabase (DB + Auth + Storage)
├── Infraestructura
│ └── Supabase Hosting + GitHub Pages 
```
---

### Roles y Accesos

| Rol          | Acceso a Gestión de Usuarios | Acceso a Pedidos | Acceso al Dashboard |
|--------------|------------------------------|------------------|----------------------|
| `gerente`    | ✅                            | ✅                | ✅                    |
| `admin`      | ✅                            | ✅                | ✅                    |
| `vendedor`   | ❌                            | ✅                | ✅                    |
| `delivery`   | ❌                            | ✅(solo asignados)| ✅                    |
| `marketing`  | ❌                            | ❌                | ✅                    |

---

### Requisitos

* Node.js 18+
* Proyecto de Supabase configurado
* Editor como VS Code
* Navegador actualizado

---

### Instalación

1. **Clona el proyecto**
```bash
git clone https://github.com/tu_usuario/floreria_piliiiAPP.git
cd floreria_piliiiAPP
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura Supabase**
- Crea un proyecto en https://supabase.com
- Configura las variables en .env:
```bash
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJ...
```
4. Inicia el entorno
```bash
npm run dev
```
### Seguridad
Las contraseñas se encriptan con bcryptjs antes de almacenarse en Supabase.

Al iniciar sesión, se valida el hash y se protege el acceso según el rol.

El sistema filtra vistas y accesos dinámicamente según permisos.

### Estructura del Proyecto
```bash
floreria_piliiiAPP/
├── src/
│   ├── components/         # Componentes reutilizables (Card, Button...)
│   ├── pages/              # Páginas (cliente, admin, login, contacto...)
│   ├── layouts/            # MobileLayout, AdminLayout
│   ├── integrations/       # Supabase client
│   └── hooks/              # use-toast, use-auth...
├── public/
│   └── imgs/encabezado.png
├── .env
├── package.json
├── tailwind.config.js
└── index.html

```
### Funcionalidades Futuras
- Facturación electrónica (SUNAT)
- Integración con pasarelas de pago (Yape, Plin, Culqi)
- Notificaciones push
- Dashboard de métricas de ventas y marketing

### Contribuir
- Haz un fork del proyecto.
- Crea una nueva rama (git checkout -b feature/nueva-funcionalidad)
- Haz tus cambios y commitea (git commit -m 'Agrega nueva funcionalidad')
- Haz push (git push origin feature/nueva-funcionalidad)
- Abre un Pull Request

### Licencia
MIT License — ¡Libertad para compartir, modificar y desplegar!

### Créditos
El presente proyecto, 🌸 Florería Pili App — Gestión y Ventas de Flores en Línea 🌸, fue desarrollado con dedicación y entusiasmo por estudiantes de la Universidad Nacional de Moquegua (UNAM Ilo), para apoyar a pequeñas empresas peruanas en su proceso de digitalización y mejora de ventas mediante herramientas tecnológicas modernas.
Agradecemos especialmente a:
- Nuestros profesores por su guía y apoyo durante todo el proceso.
- Las pequeñas empresas que nos inspiraron a crear soluciones reales y útiles.
- Familiares y compañeros por su constante apoyo y motivación.

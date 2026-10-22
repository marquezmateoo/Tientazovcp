# 🧉 TIENTAZO · Tienda de Mates Artesanales

> **Raíz criolla · Espíritu de hoy**  
> Villa Carlos Paz, Córdoba, Argentina.  
> **Contacto:** Mateo Márquez · [marquezmateo219@gmail.com](mailto:marquezmateo219@gmail.com) · WhatsApp: [+54 9 3541 61-3365](https://wa.me/5493541613365)

---

## 📋 Descripción del Proyecto

Tienda online moderna, limpia y de alto rendimiento diseñada especialmente para **TIENTAZO**, marca de mates artesanales de calabaza gruesa seleccionada, forrados en cuero vacuno con costura criolla a tiento y virolas labradas.

### 🌟 Funcionalidades Principales
- **Sectores de Navegación Rápida:** Acceso con scroll suave a *Mates*, *Bombillas*, *Termos*, *Canastas y Materas*, *Yerberas*, *Combos* y *Yerbas*.
- **Checkout directo a WhatsApp:** Los pedidos se envían con el desglose exacto de productos, datos del cliente, método de pago y dirección directamente al WhatsApp de Mateo (**3541613365**).
- **Guía de Curado Tradicional:** Paso a paso fotográfico para curar mate de calabaza, técnicas y limpieza de mates de acero inoxidable.
- **Panel de Gestión / CMS Integrado:** Permite modificar en tiempo real precios, fotos, textos de la portada, stock, números de contacto y datos bancarios (alias/CBU).
- **Exportación de Catálogo:** Descarga directa de productos en formato CSV para Tiendanube o WooCommerce.
- **Respaldo Completo:** Exportación e importación de la tienda y pedidos en formato JSON.

---

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Clonar o descargar el repositorio
```bash
git clone https://github.com/TU_USUARIO/tientazo-tienda.git
cd tientazo-tienda
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor local
```bash
npm run dev
```
Abrí tu navegador en `http://localhost:3000` o la URL que indique la consola.

### 4. Compilar para producción
```bash
npm run build
```
Los archivos optimizados quedarán en la carpeta `dist/`.

---

## 📦 Cómo Subir este Proyecto a tu GitHub

Seguí estos pasos en tu terminal:

```bash
# 1. Iniciar git en la carpeta del proyecto
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el commit inicial
git commit -m "Tienda Tientazo - Mates Artesanales Villa Carlos Paz"

# 4. Establecer la rama principal
git branch -M main

# 5. Conectar con tu repositorio remoto de GitHub (reemplazá con tu URL)
git remote add origin https://github.com/TU_USUARIO/tientazo-tienda.git

# 6. Subir el código a GitHub
git push -u origin main
```

---

## 🌐 Cómo Desplegar Gratis en Internet (Vercel / Netlify)

### Opción A: Vercel (Recomendado, 30 segundos)
1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con tu cuenta de GitHub.
2. Hacé click en **"Add New..."** → **"Project"**.
3. Seleccioná el repositorio `tientazo-tienda`.
4. Vercel detectará automáticamente que es un proyecto **Vite**.
5. Hacé click en **"Deploy"**. En 30 segundos tu tienda estará online con dominio gratis (ej: `tientazo.vercel.app`) y certificado SSL (HTTPS). Podés conectar tu propio dominio (ej: `tientazo.com.ar`) en la pestaña *Settings → Domains*.

### Opción B: Netlify
1. Entrá a [netlify.com](https://netlify.com) y elegí **"Add new site"** → **"Import an existing project"**.
2. Conectá GitHub y elegí tu repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click en **"Deploy site"**.

---

## 📂 Estructura Limpia del Proyecto

```text
├── index.html            # Entry point HTML con fuentes y meta SEO
├── package.json          # Dependencias y scripts
├── vite.config.ts        # Configuración de Vite y Tailwind
├── tsconfig.json         # Configuración de TypeScript
├── public/               # Archivos estáticos y logos
│   └── assets/           # Logos oficiales TIENTAZO en PNG transparente
└── src/
    ├── main.tsx          # Punto de entrada de React 19
    ├── App.tsx           # Estructura de la aplicación
    ├── index.css         # Estilos globales y directivas de Tailwind CSS
    ├── types/
    │   └── store.ts      # Tipos TypeScript (Producto, Orden, Configuración)
    ├── data/
    │   └── defaultStore.ts # Catálogo inicial, fotos reales y configuración
    ├── context/
    │   └── StoreContext.tsx# Estado global, persistencia local y normalización WhatsApp
    └── components/
        ├── Header.tsx           # Barra de navegación principal y logo
        ├── AnnouncementBar.tsx  # Barra superior de avisos y promociones
        ├── Hero.tsx             # Portada fotográfica con foto real de Carlos Paz
        ├── SectorsGrid.tsx      # Sectores con navegación directa a categorías
        ├── ProductGrid.tsx      # Grilla de productos con filtros y modal de compra
        ├── ProductCard.tsx      # Tarjeta individual con precio y cuotas
        ├── ProductDetailModal.tsx # Vista detallada de cada mate
        ├── CuringGuide.tsx      # Guía tradicional de curado paso a paso
        ├── CarlosPazStory.tsx   # Historia y sello de Villa Carlos Paz
        ├── Testimonials.tsx     # Opiniones de clientes
        ├── CartDrawer.tsx       # Carrito y checkout directo al WhatsApp 3541613365
        ├── AdminDrawer.tsx      # Panel CMS para editar productos, precios y datos
        └── Footer.tsx           # Pie de página con datos de contacto y enlaces
```

---

## 📞 Datos de Contacto del Negocio
- **Responsable:** Mateo Márquez
- **Teléfono WhatsApp:** 3541613365 (`+54 9 3541 61-3365`)
- **Email:** `marquezmateo219@gmail.com`
- **Ubicación:** Villa Carlos Paz, Córdoba, Argentina.

# ARTECREAM – Heladería Artesanal de Autor 🍨

Sitio web oficial de **ARTECREAM**, heladería artesanal gourmet de autor concebida bajo principios de **Interacción Humano-Computador (HCI)** y diseño visual editorial. El proyecto rescata la despensa viva de Colombia mediante la técnica tradicional de mantecación lenta, celebrando frutos silvestres autóctonos y el trabajo campesino.

---

## 🧭 Estructura y Arquitectura del Proyecto

El código está estructurado siguiendo principios de **Separación de Responsabilidades (SoC)** y código modular limpio:

```text
HCI-ArteCream/
├── assets/
│   └── images/              # Recursos visuales (Logo, Hero, fotos de sabores y favicon)
├── css/
│   └── styles.css           # Estilos base, utilidades responsivas y personalización de scroll
├── js/
│   ├── data/
│   │   └── flavors.js       # Única fuente de verdad: Catálogo de sabores, precios y notas de origen
│   ├── modules/
│   │   ├── cart.js          # Servicio de carrito, persistencia (localStorage), drawer y toasts
│   │   ├── responsive.js    # Motor responsivo: Breakpoints, ScrollSpy, menú móvil y gestos táctiles
│   │   └── user.js          # Club de Cata: Perfil de usuario, membresía y puntos
│   ├── app.js               # Controlador de la vista principal (index.html)
│   ├── product.js           # Controlador de la vista de producto (pages/producto.html)
│   └── tailwind-config.js   # Tokens de diseño y colores centralizados de Tailwind CSS
├── pages/
│   └── producto.html        # Vista de detalle de sabor parametrizada (?id=...)
├── 404.html                 # Pantalla 404 de error con branding para GitHub Pages
├── index.html               # Landing page principal
├── DESIGN.md                # Guía de tokens de diseño y tipografías (Material Design 3)
└── README.md                # Documentación del proyecto
```

---

## 🎨 Sistema de Diseño y Tipografía

El diseño sigue una estética editorial de alta gama descrita en [`DESIGN.md`](./DESIGN.md):

* **Color Primario:** Vinotinto profundo (`#5b0023` / `#7a1b38`).
* **Superficies:** Crema cálido (`#fff8f6` / `#fff0ee` / `#ffe9e5`).
* **Tipografía Display / Títulos:** *EB Garamond* (Serif clásico y refinado).
* **Tipografía UI / Lectura:** *Montserrat* (Sans-serif moderno y legible).
* **Iconografía:** *Google Material Symbols Outlined*.

---

## 🚀 Funcionalidades Clave

1. **Catálogo de Autor Dinámico:**
   * Las cartas de sabores en la página de inicio se generan dinámicamente desde `js/data/flavors.js` con tags de origen colombiano (*Guayaba Veleña*, *Chocó Biogeográfico*, *Mora de Castilla*, *Eje Cafetero*).
2. **Cesta Térmica Deslizable (*Slide-over Drawer*):**
   * Panel lateral interactivo con subtotal calculado en pesos colombianos (`$ COP`), control de unidades (`+` / `-`) y persistencia en `localStorage`.
3. **Membresía "Club de Cata":**
   * Formulario de registro express (sin contraseñas) que entrega una tarjeta de socio virtual con puntos acumulados.
4. **Página Dinámica de Producto:**
   * `pages/producto.html?id=lulo` lee los parámetros de la URL para desplegar notas de cata y recomendaciones sin duplicar páginas HTML.
5. **Navegación Inteligente:**
   * *ScrollSpy* con `IntersectionObserver` que detecta la sección visible e ilumina el menú activo.
   * Desplazamiento suave con compensación del alto de cabecera fija.

---

## 💻 Ejecución Local

1. Clona o descarga el repositorio:
   ```bash
   git clone https://github.com/JohanYP/HCI-ArteCream.git
   ```
2. Abre `index.html` en tu navegador web o mediante la extensión **Live Server** en VS Code.
3. El proyecto no requiere instalación de dependencias ni compiladores (`Node.js`, `Webpack` o `Vite`). Corre 100% nativo con Vanilla JS y Tailwind CDN.

---

## 📦 Despliegue en GitHub Pages

El repositorio está optimizado para **GitHub Pages**:
* Incluye archivo `.nojekyll` para preservar rutas y carpetas.
* Incluye [404.html](./404.html) branded para manejar enlaces rotos o accesos directos.

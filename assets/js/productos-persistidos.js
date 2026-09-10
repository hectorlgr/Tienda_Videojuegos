/**
 * productos-persistidos.js
 * Igual que stock.js, pero para productos NUEVOS creados desde el
 * formulario del admin (admin_producto_nuevo.html).
 *
 * IMPORTANTE - orden de <script>: debe cargar DESPUÉS de data-productos.js
 * y ANTES de stock.js, carrito.js, productos.js y detalle-producto.js.
 * Así, cuando esos scripts lean PRODUCTOS, los productos nuevos ya están
 * agregados como si siempre hubieran estado ahí.
 */

const PRODUCTOS_NUEVOS_KEY = "productosNuevosAdmin";

function obtenerProductosNuevos() {
  const data = localStorage.getItem(PRODUCTOS_NUEVOS_KEY);
  return data ? JSON.parse(data) : [];
}

/** Genera un id nuevo: el mayor id existente en PRODUCTOS + 1 */
function generarNuevoId() {
  const idMaximo = PRODUCTOS.reduce((max, p) => Math.max(max, p.id), 0);
  return idMaximo + 1;
}

/** Guarda un producto nuevo (lo llama admin_producto_nuevo.js al enviar el formulario) */
function guardarProductoNuevo(producto) {
  const productos = obtenerProductosNuevos();
  productos.push(producto);
  localStorage.setItem(PRODUCTOS_NUEVOS_KEY, JSON.stringify(productos));
}

/** Fusiona los productos guardados dentro del arreglo PRODUCTOS en memoria */
function fusionarProductosPersistidos() {
  const nuevos = obtenerProductosNuevos();
  nuevos.forEach((p) => {
    const yaExiste = PRODUCTOS.some((existente) => existente.id === p.id);
    if (!yaExiste) {
      PRODUCTOS.push(p);
    }
  });
}

// Se ejecuta de inmediato, igual que stock.js, para que el resto de los
// scripts que cargan después ya vean el arreglo PRODUCTOS completo.
fusionarProductosPersistidos();

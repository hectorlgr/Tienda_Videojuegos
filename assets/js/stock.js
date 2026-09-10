/**
 * stock.js
 * Hace que los cambios de stock que haga el administrador sean
 * PERSISTENTES (localStorage) y se reflejen automáticamente en
 * PRODUCTOS cada vez que cualquier página carga.
 *
 * IMPORTANTE sobre el orden de los <script>: este archivo debe cargar
 * DESPUÉS de data-productos.js (necesita que PRODUCTOS ya exista) y
 * ANTES de carrito.js, productos.js y detalle-producto.js (para que
 * ellos lean el stock ya actualizado).
 *
 * Truco clave: en vez de crear una función nueva que todo el resto del
 * código tendría que llamar, este script MUTA directamente el campo
 * ".stock" de cada objeto dentro de PRODUCTOS. Así, todo el código que
 * ya existía (carrito.js, detalle-producto.js) sigue funcionando sin
 * tener que tocarlo: ellos leen producto.stock como siempre, solo que
 * ahora ese valor ya viene actualizado.
 */

const STOCK_KEY = "stockProductos";

/** La primera vez que se usa el sitio, guarda el stock inicial (el de data-productos.js) */
function inicializarStock() {
  if (localStorage.getItem(STOCK_KEY)) return;

  const stockInicial = {};
  PRODUCTOS.forEach((p) => {
    stockInicial[p.id] = p.stock;
  });
  localStorage.setItem(STOCK_KEY, JSON.stringify(stockInicial));
}

/** Sobrescribe el .stock de cada producto en PRODUCTOS con lo guardado en localStorage */
function sincronizarStockEnMemoria() {
  inicializarStock();
  const stockGuardado = JSON.parse(localStorage.getItem(STOCK_KEY));

  PRODUCTOS.forEach((p) => {
    if (stockGuardado[p.id] !== undefined) {
      p.stock = stockGuardado[p.id];
    }
  });
}

/** Usada por el panel admin para guardar un nuevo valor de stock */
function actualizarStockProducto(idProducto, nuevoStock) {
  inicializarStock();
  const stockGuardado = JSON.parse(localStorage.getItem(STOCK_KEY));

  stockGuardado[idProducto] = Math.max(0, Math.floor(Number(nuevoStock)) || 0);
  localStorage.setItem(STOCK_KEY, JSON.stringify(stockGuardado));

  sincronizarStockEnMemoria();
}

// Se ejecuta de inmediato (no espera DOMContentLoaded) para garantizar que
// el stock ya esté sincronizado ANTES de que corran los scripts que cargan
// después de este (carrito.js, productos.js, detalle-producto.js).
sincronizarStockEnMemoria();

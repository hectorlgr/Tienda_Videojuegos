/**
 * carrito.js
 * Lógica de carrito compartida entre productos.html y product.html.
 * Debe incluirse DESPUÉS de data-productos.js y ANTES de productos.js
 * (o del script propio de product.html).
 */

const CARRITO_KEY = "carritoTiendaJuegos";

/** Devuelve el carrito guardado en localStorage (array de {id, cantidad}) */
function obtenerCarrito() {
  const data = localStorage.getItem(CARRITO_KEY);
  return data ? JSON.parse(data) : [];
}

/** Guarda el carrito completo en localStorage */
function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

/**
 * Añade un producto al carrito (o suma cantidad si ya existe).
 * Respeta el stock disponible definido en PRODUCTOS.
 */
function agregarAlCarrito(idProducto, cantidad = 1) {
  const producto = PRODUCTOS.find((p) => p.id === idProducto);
  if (!producto) return { ok: false, mensaje: "Producto no encontrado" };

  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.id === idProducto);
  const cantidadActual = item ? item.cantidad : 0;

  if (cantidadActual + cantidad > producto.stock) {
    return { ok: false, mensaje: "Sin stock suficiente" };
  }

  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ id: idProducto, cantidad });
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();
  return { ok: true, mensaje: "Añadido al carrito" };
}

/** Suma la cantidad total de unidades en el carrito */
function totalUnidadesCarrito() {
  return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

/** Actualiza el contador visual del carrito en el header (clase .qty dentro del ícono de carrito) */
function actualizarContadorCarrito() {
  const contador = document.querySelector("#cart-qty");
  if (contador) {
    contador.textContent = totalUnidadesCarrito();
  }
}

/**
 * Muestra feedback visual en un botón "Añadir al carrito" sin usar alert().
 * Cambia texto/clase por un momento y luego vuelve al estado original.
 */
function mostrarFeedbackBoton(boton, mensaje, exito = true) {
  const textoOriginal = boton.innerHTML;
  boton.classList.add(exito ? "btn-feedback-ok" : "btn-feedback-error");
  boton.innerHTML = `<i class="fa ${exito ? "fa-check" : "fa-times"}"></i> ${mensaje}`;
  boton.disabled = true;

  setTimeout(() => {
    boton.innerHTML = textoOriginal;
    boton.classList.remove("btn-feedback-ok", "btn-feedback-error");
    boton.disabled = false;
  }, 1400);
}

// Al cargar cualquier página que incluya este script, refresca el contador.
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);

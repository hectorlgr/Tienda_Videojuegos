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

// ==========================================
// RENDERIZADO Y LÓGICA DE LA VISTA CARRITO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const contenedorItems = document.getElementById('contenedor-items-carrito');
  if (!contenedorItems) return; // Solo se ejecuta si estamos en carrito.html

  const selectorRegion = document.getElementById('region-envio');
  const txtSubtotal = document.getElementById('resumen-subtotal');
  const txtEnvio = document.getElementById('resumen-envio');
  const txtTotal = document.getElementById('resumen-total');

  if (typeof DATOS_REGIONES !== 'undefined') {
    DATOS_REGIONES.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.costoEnvio;
      opt.textContent = `${item.nombre} ($${item.costoEnvio.toLocaleString("es-CL")})`;
      selectorRegion.appendChild(opt);
    });
  }

  // Utilidad de formato si no existe globalmente
  const formatearCLP = (valor) => "$" + valor.toLocaleString("es-CL");

  const renderizarVistaCarrito = () => {
    const carrito = obtenerCarrito();
    contenedorItems.innerHTML = '';
    let subtotal = 0;

    if (carrito.length === 0) {
      contenedorItems.innerHTML = '<div class="alert alert-info">Tu carrito está vacío.</div>';
      actualizarTotales(0);
      return;
    }

    carrito.forEach(item => {
      const producto = PRODUCTOS.find(p => p.id === item.id);
      if (!producto) return;

      const totalItem = producto.precio * item.cantidad;
      subtotal += totalItem;

      // Inyección de la tarjeta individual (basada en el mockup)
      contenedorItems.innerHTML += `
        <div class="card shadow-sm border-0 mb-3">
          <div class="card-body d-flex align-items-center">
            <img src="../../${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded me-3" style="width: 80px; height: 80px; object-fit: cover;">
            <div class="flex-grow-1">
              <h6 class="fw-bold mb-1">${producto.nombre}</h6>
              <p class="text-muted small mb-0">${producto.categoria.toUpperCase()}</p>
            </div>
            <div class="fw-bold me-4">${formatearCLP(producto.precio)}</div>

            <!-- Controles de Cantidad -->
            <div class="d-flex align-items-center me-4">
              <button class="btn btn-sm btn-outline-secondary btn-restar" data-id="${producto.id}"><i class="fa fa-minus"></i></button>
              <span class="mx-3 fw-bold">${item.cantidad}</span>
              <button class="btn btn-sm btn-outline-secondary btn-sumar" data-id="${producto.id}"><i class="fa fa-plus"></i></button>
            </div>

            <button class="btn btn-sm btn-danger btn-eliminar" data-id="${producto.id}"><i class="fa fa-trash"></i></button>
          </div>
        </div>
      `;
    });

    actualizarTotales(subtotal);
    asignarEventosBotones();
  };

  const actualizarTotales = (subtotal) => {
    const costoEnvio = parseInt(selectorRegion.value) || 0;
    const totalGeneral = subtotal + costoEnvio;

    txtSubtotal.textContent = formatearCLP(subtotal);
    txtEnvio.textContent = costoEnvio > 0 ? formatearCLP(costoEnvio) : "$0";
    txtTotal.textContent = formatearCLP(totalGeneral);
  };

  const modificarCantidad = (id, cambio) => {
    let carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === id);
    const producto = PRODUCTOS.find(p => p.id === id);

    if (item && producto) {
      item.cantidad += cambio;
      if (item.cantidad <= 0) {
        carrito = carrito.filter(i => i.id !== id);
      } else if (item.cantidad > producto.stock) {
        alert("No hay más stock disponible de este producto.");
        item.cantidad = producto.stock;
      }
      guardarCarrito(carrito);
      renderizarVistaCarrito();
      actualizarContadorCarrito(); // Del código original
    }
  };

  const asignarEventosBotones = () => {
    document.querySelectorAll('.btn-sumar').forEach(btn => {
      btn.addEventListener('click', (e) => modificarCantidad(Number(e.currentTarget.dataset.id), 1));
    });

    document.querySelectorAll('.btn-restar').forEach(btn => {
      btn.addEventListener('click', (e) => modificarCantidad(Number(e.currentTarget.dataset.id), -1));
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const carrito = obtenerCarrito().filter(i => i.id !== id);
        guardarCarrito(carrito);
        renderizarVistaCarrito();
        actualizarContadorCarrito();
      });
    });
  };

  // Recalcular total al cambiar la región
  selectorRegion.addEventListener('change', renderizarVistaCarrito);

  // Inicializar
  renderizarVistaCarrito();
});
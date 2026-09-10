/**
 * productos.js
 * Renderiza el grid de productos en productos.html a partir de PRODUCTOS
 * (data-productos.js), aplica el filtro por categoría del aside, y conecta
 * el click en cada tarjeta con la página de detalle (product.html?id=X).
 */

const contenedorGrid = document.querySelector("#products-grid");
const checkboxesCategoria = document.querySelectorAll(".category-filter");
const inputBusqueda = document.querySelector("#search-input");
const selectBusquedaCategoria = document.querySelector("#search-category");
const formBusqueda = document.querySelector("#search-form");



/** Construye el HTML de una tarjeta de producto (reutiliza clases de Electro) */
function crearTarjetaProducto(producto) {
  const etiquetaFormato =
    producto.categoria === "juego"
      ? `<span class="new">${producto.formato === "digital" ? "DIGITAL" : "FÍSICO"}</span>`
      : "";

  return `
    <div class="col-md-4 col-6" data-categoria="${producto.categoria}">
      <div class="product">
        <div class="product-img">
          <a href="product.html?id=${producto.id}">
            <img src="../../${producto.imagen}" alt="${producto.nombre}">
          </a>
          <div class="product-label">${etiquetaFormato}</div>
        </div>
        <div class="product-body">
          <p class="product-category">${NOMBRE_CATEGORIA[producto.categoria]}</p>
          <h3 class="product-name">
            <a href="product.html?id=${producto.id}">${producto.nombre}</a>
          </h3>
          <h4 class="product-price">${formatearPrecio(producto.precio)}</h4>
        </div>
        <div class="add-to-cart">
          <button class="add-to-cart-btn" data-id="${producto.id}">
            <i class="fa fa-shopping-cart"></i> Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  `;
}

/** Devuelve las categorías actualmente marcadas en el aside */
function categoriasSeleccionadas() {
  const marcadas = Array.from(checkboxesCategoria)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);
  return marcadas; // arreglo vacío = mostrar todas
}

/**
 * Escapa caracteres especiales de regex en el texto que escribe el usuario,
 * para que símbolos como "." "*" "(" no rompan la expresión regular.
 * Ej: si el usuario escribe "C.O.D" no debe interpretarse "." como
 * "cualquier caracter", sino como un punto literal.
 */
function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Filtra productos cuyo nombre EMPIEZA con el texto ingresado,
 * sin distinguir mayúsculas/minúsculas (como la búsqueda de PCFactory,
 * Falabella, etc. mientras vas escribiendo).
 *
 * ^        -> ancla el inicio del string (por eso es "empieza por" y no
 *             "contiene en cualquier parte")
 * flag "i" -> ignora mayúsculas/minúsculas (Insensitive)
 */
function filtrarPorTexto(productos, texto) {
  const termino = texto.trim();
  if (termino === "") return productos;

  const patron = new RegExp("^" + escaparRegex(termino), "i");
  return productos.filter((p) => patron.test(p.nombre));
}

/** Renderiza el grid según los filtros actuales (categoría + texto) */
function renderizarProductos() {
  const seleccion = categoriasSeleccionadas();
  const categoriaDelSelect = selectBusquedaCategoria
    ? selectBusquedaCategoria.value
    : "0";
  const texto = inputBusqueda ? inputBusqueda.value : "";

  let productosFiltrados = PRODUCTOS;

  // 1) filtro por categoría: prioriza los checkboxes del aside;
  //    si no hay ninguno marcado, usa el <select> del buscador (si no es "Todas")
  if (seleccion.length > 0) {
    productosFiltrados = productosFiltrados.filter((p) =>
      seleccion.includes(p.categoria)
    );
  } else if (categoriaDelSelect !== "0") {
    productosFiltrados = productosFiltrados.filter(
      (p) => p.categoria === categoriaDelSelect
    );
  }

  // 2) filtro por texto (regex "empieza por", case-insensitive)
  productosFiltrados = filtrarPorTexto(productosFiltrados, texto);

  contenedorGrid.innerHTML = productosFiltrados.length
    ? productosFiltrados.map(crearTarjetaProducto).join("")
    : `<div class="col-md-12"><p class="text-center" style="padding:40px 0;">
         No se encontraron productos que coincidan con tu búsqueda.
       </p></div>`;

  // Reasigna los eventos de "Añadir al carrito" cada vez que se re-renderiza
  document.querySelectorAll(".add-to-cart-btn").forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      evento.preventDefault();
      const id = Number(boton.dataset.id);
      const resultado = agregarAlCarrito(id, 1);
      mostrarFeedbackBoton(boton, resultado.mensaje, resultado.ok);
    });
  });
}

// Vuelve a renderizar cada vez que se marca/desmarca una categoría
checkboxesCategoria.forEach((cb) => {
  cb.addEventListener("change", renderizarProductos);
});

// Búsqueda en tiempo real: se filtra en cada tecla, no hace falta apretar el botón
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", renderizarProductos);
}

if (selectBusquedaCategoria) {
  selectBusquedaCategoria.addEventListener("change", renderizarProductos);
}

// Si igual apreta "Buscar" o Enter, evitamos que la página se recargue
if (formBusqueda) {
  formBusqueda.addEventListener("submit", (evento) => {
    evento.preventDefault();
    renderizarProductos();
  });
}

document.addEventListener("DOMContentLoaded", renderizarProductos);
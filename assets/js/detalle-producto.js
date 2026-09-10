/**
 * producto-detalle.js
 * Renderiza product.html a partir del parámetro ?id= de la URL.
 * Reutiliza PRODUCTOS y formatearPrecio() (data-productos.js) y
 * agregarAlCarrito() / mostrarFeedbackBoton() (carrito.js).
 * Debe incluirse DESPUÉS de esos dos archivos.
 */

/** Lee ?id=X de la URL actual y lo devuelve como número */
function obtenerIdDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

/** Busca el producto por id dentro de PRODUCTOS */
function buscarProducto(id) {
  return PRODUCTOS.find((p) => p.id === id);
}

/** Si el id no viene en la URL o no existe, se muestra este mensaje en vez del detalle */
function renderizarNoEncontrado() {
  document.querySelector("#product-detalle-container").innerHTML = `
    <div class="row">
      <div class="col-md-12">
        <p class="text-center" style="padding:60px 0;">
          No encontramos el producto que buscas.
          <a href="productos.html">Volver al catálogo</a>
        </p>
      </div>
    </div>
  `;
}

/** Rellena el breadcrumb: Inicio > Categoría > Nombre del producto */
function renderizarBreadcrumb(producto) {
  document.querySelector("#breadcrumb-categoria").textContent =
    NOMBRE_CATEGORIA[producto.categoria];
  document.querySelector("#breadcrumb-nombre").textContent = producto.nombre;
}

/**
 * Rellena imagen principal + miniaturas.
 * NOTA: en PRODUCTOS cada producto solo tiene UNA imagen ("imagen"),
 * no una galería. Por eso las 3 miniaturas muestran la misma foto;
 * si más adelante agregas varias imágenes por producto (ej. un arreglo
 * producto.imagenes[]), solo hay que cambiar esta función para recorrerlo.
 */
function renderizarGaleria(producto) {
  const imgPrincipal = document.querySelector("#main-image-src");
  imgPrincipal.src = "../../" + producto.imagen;
  imgPrincipal.alt = producto.nombre;

  const miniaturas = document.querySelectorAll("#product-imgs .product-preview");
  miniaturas.forEach((miniatura, indice) => {
    const img = miniatura.querySelector("img");
    img.src = "../../" + producto.imagen;
    img.alt = `${producto.nombre} - vista${indice + 1}`;

    miniatura.addEventListener("click", () => {
      imgPrincipal.src = img.src;
      miniaturas.forEach((m) => m.classList.remove("slick-current"));
      miniatura.classList.add("slick-current");
    });
  });

  if (miniaturas[0]) miniaturas[0].classList.add("slick-current");
}

/** Rellena nombre, precio, disponibilidad y descripción larga */
function renderizarInfo(producto) {
  document.querySelector("#detalle-nombre").textContent = producto.nombre;
  document.querySelector("#detalle-precio").textContent = formatearPrecio(producto.precio);
  document.querySelector("#detalle-descripcion").textContent = producto.descripcionLarga;

  const disponibilidad = document.querySelector("#detalle-disponibilidad");
  if (producto.stock > 0) {
    disponibilidad.textContent = "En stock";
  } else {
    disponibilidad.textContent = "Sin stock";
    disponibilidad.style.color = "#e74c3c";
  }
}

/** Configura los botones +/- y los límites del selector de cantidad según el stock */
function configurarSelectorCantidad(producto) {
  const input = document.querySelector("#cantidad-input");
  const btnUp = document.querySelector(".qty-up");
  const btnDown = document.querySelector(".qty-down");

  const maximo = producto.stock > 0 ? producto.stock : 1;
  input.max = maximo;
  input.value = 1;
  input.disabled = producto.stock <= 0;

  btnUp.addEventListener("click", () => {
    const actual = Number(input.value) || 1;
    if (actual < maximo) input.value = actual + 1;
  });

  btnDown.addEventListener("click", () => {
    const actual = Number(input.value) || 1;
    if (actual > 1) input.value = actual - 1;
  });

  // Corrige si el usuario escribe un valor fuera de rango a mano
  input.addEventListener("change", () => {
    let valor = Math.floor(Number(input.value)) || 1;
    if (valor < 1) valor = 1;
    if (valor > maximo) valor = maximo;
    input.value = valor;
  });
}

/** Conecta el botón "Añadir al carrito" con carrito.js (sin alert, con feedback visual) */
function configurarBotonAgregar(producto) {
  const boton = document.querySelector("#btn-agregar-carrito");
  if (producto.stock <= 0) {
    boton.disabled = true;
    return;
  }

  boton.addEventListener("click", () => {
    const cantidad = Number(document.querySelector("#cantidad-input").value) || 1;
    const resultado = agregarAlCarrito(producto.id, cantidad);
    mostrarFeedbackBoton(boton, resultado.mensaje, resultado.ok);
  });
}

/** Muestra hasta 4 productos de la misma categoría (excluyendo el actual) */
function renderizarRelacionados(producto) {
  const relacionados = PRODUCTOS.filter(
    (p) => p.categoria === producto.categoria && p.id !== producto.id
  ).slice(0, 4);

  const contenedor = document.querySelector("#related-products-grid");

  if (relacionados.length === 0) {
    contenedor.closest(".section").style.display = "none";
    return;
  }

  contenedor.innerHTML = relacionados
    .map(
      (p) => `
      <div class="col-md-3 col-6">
        <div class="product">
          <div class="product-img">
            <a href="product.html?id=${p.id}">
              <!-- AÑADE LOS ../../ AQUÍ ADENTRO -->
              <img src="../../${p.imagen}" alt="${p.nombre}">
            </a>
          </div>
          <div class="product-body">
            <p class="product-category">${NOMBRE_CATEGORIA[p.categoria]}</p>
            <h3 class="product-name">
              <a href="product.html?id=${p.id}">${p.nombre}</a>
            </h3>
            <h4 class="product-price">${formatearPrecio(p.precio)}</h4>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function iniciar() {
  const id = obtenerIdDesdeURL();
  const producto = buscarProducto(id);

  if (!producto) {
    renderizarNoEncontrado();
    return;
  }

  document.title = `${producto.nombre} - Tienda de Videojuegos`;
  renderizarBreadcrumb(producto);
  renderizarGaleria(producto);
  renderizarInfo(producto);
  configurarSelectorCantidad(producto);
  configurarBotonAgregar(producto);
  renderizarRelacionados(producto);
}

document.addEventListener("DOMContentLoaded", iniciar);
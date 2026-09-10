/**
 * admin_producto_nuevo.js
 * Validaciones del formulario "Nuevo Producto" según las reglas de la
 * rúbrica, y guardado del producto vía guardarProductoNuevo()
 * (productos-persistidos.js).
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNuevoProducto");

  const codigo = document.getElementById("codigo");
  const categoria = document.getElementById("categoria");
  const grupoFormato = document.getElementById("grupoFormato");
  const formato = document.getElementById("formato");
  const nombre = document.getElementById("nombreProducto");
  const descripcion = document.getElementById("descripcionProducto");
  const contadorDescripcion = document.getElementById("contadorDescripcion");
  const precio = document.getElementById("precio");
  const stock = document.getElementById("stockProducto");
  const stockCritico = document.getElementById("stockCritico");
  const imagen = document.getElementById("imagenProducto");
  const mensajeExito = document.getElementById("mensajeExito");

  // ---------- Helper de feedback (mismo patrón que validaciones.js) ----------
  const setFeedback = (input, idFeedback, esValido, mensajeError = "") => {
    const contenedor = document.getElementById(idFeedback);
    if (!esValido) {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      if (contenedor) contenedor.textContent = mensajeError;
    } else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      if (contenedor) contenedor.textContent = "";
    }
    return esValido;
  };

  // ---------- Mostrar/ocultar y exigir "Formato" solo si categoría = Juego ----------
  categoria.addEventListener("change", () => {
    const esJuego = categoria.value === "juego";
    grupoFormato.style.display = esJuego ? "flex" : "none";
    if (!esJuego) {
      formato.value = "";
      formato.classList.remove("is-valid", "is-invalid");
    }
    validarCategoria();
  });

  // ---------- Validaciones individuales ----------

  // Código: requerido, texto, mínimo 3 caracteres, sin máximo
  const validarCodigo = () => {
    const valor = codigo.value.trim();
    if (!valor) return setFeedback(codigo, "errorCodigo", false, "El código es obligatorio.");
    if (valor.length < 3) return setFeedback(codigo, "errorCodigo", false, "El código debe tener al menos 3 caracteres.");
    return setFeedback(codigo, "errorCodigo", true);
  };

  // Categoría: requerida
  const validarCategoria = () => {
    if (!categoria.value) return setFeedback(categoria, "errorCategoria", false, "Selecciona una categoría.");
    return setFeedback(categoria, "errorCategoria", true);
  };

  // Formato: requerido SOLO si la categoría es "Juego"
  const validarFormato = () => {
    if (categoria.value !== "juego") return true; // no aplica a otras categorías
    if (!formato.value) return setFeedback(formato, "errorFormato", false, "Selecciona el formato del juego.");
    return setFeedback(formato, "errorFormato", true);
  };

  // Nombre: requerido, máximo 100
  const validarNombre = () => {
    const valor = nombre.value.trim();
    if (!valor) return setFeedback(nombre, "errorNombreProducto", false, "El nombre es obligatorio.");
    if (valor.length > 100) return setFeedback(nombre, "errorNombreProducto", false, "Máximo 100 caracteres.");
    return setFeedback(nombre, "errorNombreProducto", true);
  };

  // Descripción: opcional, máximo 500 (con contador en vivo)
  const validarDescripcion = () => {
    const valor = descripcion.value;
    contadorDescripcion.textContent = valor.length;
    if (valor.length > 500) return setFeedback(descripcion, "errorDescripcionProducto", false, "Máximo 500 caracteres.");
    return setFeedback(descripcion, "errorDescripcionProducto", true);
  };

  // Precio: requerido, mínimo 0 (0 = producto FREE), admite decimales, sin máximo
  const validarPrecio = () => {
    const valor = precio.value.trim();
    if (valor === "") return setFeedback(precio, "errorPrecio", false, "El precio es obligatorio.");
    const numero = Number(valor);
    if (Number.isNaN(numero)) return setFeedback(precio, "errorPrecio", false, "Ingresa un número válido.");
    if (numero < 0) return setFeedback(precio, "errorPrecio", false, "El precio no puede ser negativo (mínimo 0, para productos gratuitos).");
    return setFeedback(precio, "errorPrecio", true);
  };

  // Stock: requerido, mínimo 0, SOLO números enteros, sin máximo
  const validarStock = () => {
    const valor = stock.value.trim();
    if (valor === "") return setFeedback(stock, "errorStockProducto", false, "El stock es obligatorio.");
    const numero = Number(valor);
    if (!Number.isInteger(numero)) return setFeedback(stock, "errorStockProducto", false, "El stock debe ser un número entero.");
    if (numero < 0) return setFeedback(stock, "errorStockProducto", false, "El stock no puede ser negativo.");
    return setFeedback(stock, "errorStockProducto", true);
  };

  // Stock crítico: opcional, mínimo 0, solo enteros
  const validarStockCritico = () => {
    const valor = stockCritico.value.trim();
    if (valor === "") return setFeedback(stockCritico, "errorStockCritico", true); // opcional: vacío es válido
    const numero = Number(valor);
    if (!Number.isInteger(numero)) return setFeedback(stockCritico, "errorStockCritico", false, "Debe ser un número entero.");
    if (numero < 0) return setFeedback(stockCritico, "errorStockCritico", false, "No puede ser negativo.");
    return setFeedback(stockCritico, "errorStockCritico", true);
  };

  // ---------- Validación en tiempo real ----------
  codigo.addEventListener("input", validarCodigo);
  nombre.addEventListener("input", validarNombre);
  descripcion.addEventListener("input", validarDescripcion);
  precio.addEventListener("input", validarPrecio);
  stock.addEventListener("input", validarStock);
  stockCritico.addEventListener("input", validarStockCritico);
  formato.addEventListener("change", validarFormato);

  // ---------- Envío del formulario ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    mensajeExito.classList.add("d-none");

    const okCodigo = validarCodigo();
    const okCategoria = validarCategoria();
    const okFormato = validarFormato();
    const okNombre = validarNombre();
    const okDescripcion = validarDescripcion();
    const okPrecio = validarPrecio();
    const okStock = validarStock();
    const okStockCritico = validarStockCritico();

    const todoValido =
      okCodigo && okCategoria && okFormato && okNombre &&
      okDescripcion && okPrecio && okStock && okStockCritico;

    if (!todoValido) return;

    const nuevoProducto = {
      id: generarNuevoId(),
      codigo: codigo.value.trim(),
      nombre: nombre.value.trim(),
      categoria: categoria.value,
      precio: Number(precio.value),
      stock: Number(stock.value),
      stockCritico: stockCritico.value.trim() !== "" ? Number(stockCritico.value) : null,
      imagen: imagen.value.trim() || "assets/img/Logo_Checkpoint.png",
      descripcionCorta: descripcion.value.trim().slice(0, 120) || "Producto agregado por el administrador.",
      descripcionLarga: descripcion.value.trim() || "Sin descripción disponible.",
    };

    if (categoria.value === "juego") {
      nuevoProducto.formato = formato.value;
    }

    guardarProductoNuevo(nuevoProducto);

    mensajeExito.textContent = `"${nuevoProducto.nombre}" se guardó correctamente (código ${nuevoProducto.codigo}).`;
    mensajeExito.classList.remove("d-none");

    form.reset();
    grupoFormato.style.display = "none";
    contadorDescripcion.textContent = "0";
    form.querySelectorAll(".is-valid").forEach((el) => el.classList.remove("is-valid"));
  });
});

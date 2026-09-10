/**
 * admin_stock.js
 * Pinta la tabla de stock en admin_stock.html a partir de PRODUCTOS
 * (ya sincronizado con el stock guardado, ver stock.js), y conecta el
 * botón "Guardar" de cada fila con actualizarStockProducto().
 */

const tablaStock = document.querySelector("#tabla-stock");

function filaProducto(producto) {
  const sinStock = producto.stock <= 0;

  return `
    <tr class="${sinStock ? "table-danger" : ""}" data-fila-id="${producto.id}">
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${NOMBRE_CATEGORIA[producto.categoria]}</td>
      <td>${formatearPrecio(producto.precio)}</td>
      <td>
        <span class="fw-bold">${producto.stock}</span>
        ${sinStock ? '<span class="badge bg-danger ms-2">Sin stock</span>' : ""}
      </td>
      <td style="max-width: 120px;">
        <input
          type="number"
          min="0"
          class="form-control form-control-sm input-nuevo-stock"
          data-id="${producto.id}"
          value="${producto.stock}"
        >
      </td>
      <td>
        <button class="btn btn-sm btn-dark btn-guardar-stock" data-id="${producto.id}">
          Guardar
        </button>
      </td>
    </tr>
  `;
}

function renderizarTablaStock() {
  tablaStock.innerHTML = PRODUCTOS.map(filaProducto).join("");

  document.querySelectorAll(".btn-guardar-stock").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      const input = document.querySelector(`.input-nuevo-stock[data-id="${id}"]`);
      const nuevoValor = input.value;

      actualizarStockProducto(id, nuevoValor);

      // Feedback simple sin alert(): la fila se re-pinta con el valor guardado
      renderizarTablaStock();
      const filaActualizada = document.querySelector(`tr[data-fila-id="${id}"]`);
      if (filaActualizada) {
        filaActualizada.classList.add("table-success");
        setTimeout(() => filaActualizada.classList.remove("table-success"), 800);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", renderizarTablaStock);

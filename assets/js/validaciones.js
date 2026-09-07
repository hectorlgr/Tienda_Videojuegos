document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formContacto');
  if (!form) return;

  const nombre = document.getElementById('nombre');
  const correo = document.getElementById('correo');
  const comentario = document.getElementById('comentario');
  const contador = document.getElementById('contadorCaracteres');

  // Expresión regular estándar compatible con RFC 2822 para emails
  const rfc2822Regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  // Funciones auxiliares para mostrar/limpiar errores de Bootstrap
  const mostrarError = (input, mensajeId, texto) => {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    const contenedorError = document.getElementById(mensajeId);
    if (contenedorError) contenedorError.textContent = texto;
  };

  const mostrarExito = (input, mensajeId) => {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const contenedorError = document.getElementById(mensajeId);
    if (contenedorError) contenedorError.textContent = '';
  };

  // 1. Validación de Nombre
  const validarNombre = () => {
    const valor = nombre.value.trim();
    if (!valor) {
      mostrarError(nombre, 'errorNombre', 'El nombre es obligatorio.');
      return false;
    }
    if (valor.length > 100) {
      mostrarError(nombre, 'errorNombre', 'El nombre no puede superar los 100 caracteres.');
      return false;
    }
    mostrarExito(nombre, 'errorNombre');
    return true;
  };

  // 2. Validación de Correo (RFC 2822)
  const validarCorreo = () => {
    const valor = correo.value.trim();
    if (!valor) {
      mostrarError(correo, 'errorCorreo', 'El correo es obligatorio.');
      return false;
    }
    if (valor.length > 100) {
      mostrarError(correo, 'errorCorreo', 'El correo no puede superar los 100 caracteres.');
      return false;
    }
    if (!rfc2822Regex.test(valor)) {
      mostrarError(correo, 'errorCorreo', 'Ingresa un formato de correo electrónico válido.');
      return false;
    }
    mostrarExito(correo, 'errorCorreo');
    return true;
  };

  // 3. Validación de Comentario y actualización de contador
  const validarComentario = () => {
    const valor = comentario.value.trim();
    if (contador) contador.textContent = comentario.value.length;

    if (!valor) {
      mostrarError(comentario, 'errorComentario', 'El comentario es obligatorio.');
      return false;
    }
    if (valor.length > 500) {
      mostrarError(comentario, 'errorComentario', 'El comentario no puede superar los 500 caracteres.');
      return false;
    }
    mostrarExito(comentario, 'errorComentario');
    return true;
  };

  // Validaciones en tiempo real al escribir o salir del campo
  nombre.addEventListener('input', validarNombre);
  correo.addEventListener('input', validarCorreo);
  comentario.addEventListener('input', validarComentario);

  // Control del evento Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const comentarioValido = validarComentario();

    if (nombreValido && correoValido && comentarioValido) {
      alert('¡Mensaje enviado con éxito!');
      form.reset();
      nombre.classList.remove('is-valid');
      correo.classList.remove('is-valid');
      comentario.classList.remove('is-valid');
      if (contador) contador.textContent = '0';
    }
  });
});
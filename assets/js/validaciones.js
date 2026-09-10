// VALIDACIONES CONTACTO
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

// VALIDACIONES REGISTRO
document.addEventListener('DOMContentLoaded', () => {
  const formRegistro = document.getElementById('formRegistro');
  if (!formRegistro) return;

  const run = document.getElementById('run');
  const nombre = document.getElementById('nombreRegistro');
  const apellidos = document.getElementById('apellidos');
  const correo = document.getElementById('correoRegistro');
  const region = document.getElementById('region');
  const comuna = document.getElementById('comuna');
  const direccion = document.getElementById('direccion');

  // Arreglo complementario de regiones y comunas
  const regionesYComunas = [
    {
      region: "Región Metropolitana de Santiago",
      comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Ñuñoa", "La Florida"]
    }
  ];

  // Poblar select de regiones dinámicamente
  regionesYComunas.forEach((item, index) => {
    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = item.region;
    region.appendChild(opt);
  });

  // Cambio dinámico de comunas dependientes
  region.addEventListener('change', () => {
    comuna.innerHTML = '<option value="">Selecciona comuna...</option>';
    if (region.value === "") {
      comuna.disabled = true;
      return;
    }
    const comunasDisponibles = regionesYComunas[region.value].comunas;
    comunasDisponibles.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      comuna.appendChild(opt);
    });
    comuna.disabled = false;
  });

  // Algoritmo oficial Módulo 11 para Dígito Verificador chileno
  const validarRutChileno = (rutCompleto) => {
    const limpio = rutCompleto.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length < 7 || limpio.length > 9) return false;

    const cuerpo = limpio.slice(0, -1);
    const dvIngresado = limpio.slice(-1);

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado = '';
    if (resto === 11) dvEsperado = '0';
    else if (resto === 10) dvEsperado = 'K';
    else dvEsperado = resto.toString();

    return dvIngresado === dvEsperado;
  };

  const setFeedback = (input, idFeedback, esValido, mensajeError = '') => {
    const contenedor = document.getElementById(idFeedback);
    if (!esValido) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (contenedor) contenedor.textContent = mensajeError;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (contenedor) contenedor.textContent = '';
    }
    return esValido;
  };

  // Función para dar formato: XX.XXX.XXX-X
const formatearRUN = (valor) => {
  // 1. Limpiar caracteres dejando solo números y la letra K
  let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();

  if (limpio.length === 0) return '';
  if (limpio.length === 1) return limpio;

  // 2. Separar cuerpo y dígito verificador
  let dv = limpio.slice(-1);
  let cuerpo = limpio.slice(0, -1);

  // 3. Aplicar puntos al cuerpo cada 3 dígitos
  let cuerpoFormateado = '';
  while (cuerpo.length > 3) {
    cuerpoFormateado = '.' + cuerpo.slice(-3) + cuerpoFormateado;
    cuerpo = cuerpo.slice(0, -3);
  }
  cuerpoFormateado = cuerpo + cuerpoFormateado;

  // 4. Retornar con el guion integrado
  return `${cuerpoFormateado}-${dv}`;
};

  const validarRUN = () => {
    const valor = run.value.trim();
    if (!valor) return setFeedback(run, 'errorRun', false, 'El RUN es obligatorio.');
    if (!validarRutChileno(valor)) return setFeedback(run, 'errorRun', false, 'El RUN o Dígito Verificador no es válido.');
    return setFeedback(run, 'errorRun', true);
  };

  const validarNombreReg = () => {
    const valor = nombre.value.trim();
    if (!valor) return setFeedback(nombre, 'errorNombreRegistro', false, 'El nombre es obligatorio.');
    if (valor.length > 50) return setFeedback(nombre, 'errorNombreRegistro', false, 'Máximo 50 caracteres permitidos.');
    return setFeedback(nombre, 'errorNombreRegistro', true);
  };

  const validarApellidos = () => {
    const valor = apellidos.value.trim();
    if (!valor) return setFeedback(apellidos, 'errorApellidos', false, 'Los apellidos son obligatorios.');
    if (valor.length > 100) return setFeedback(apellidos, 'errorApellidos', false, 'Máximo 100 caracteres permitidos.');
    return setFeedback(apellidos, 'errorApellidos', true);
  };

  const validarCorreoReg = () => {
    const valor = correo.value.trim();
    const rfc2822Regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!valor) return setFeedback(correo, 'errorCorreoRegistro', false, 'El correo es obligatorio.');
    if (valor.length > 100) return setFeedback(correo, 'errorCorreoRegistro', false, 'Máximo 100 caracteres permitidos.');
    if (!rfc2822Regex.test(valor)) return setFeedback(correo, 'errorCorreoRegistro', false, 'Formato de correo no válido.');
    return setFeedback(correo, 'errorCorreoRegistro', true);
  };

  const validarDireccion = () => {
    const valor = direccion.value.trim();
    if (!valor) return setFeedback(direccion, 'errorDireccion', false, 'La dirección es obligatoria.');
    if (valor.length > 300) return setFeedback(direccion, 'errorDireccion', false, 'Máximo 300 caracteres permitidos.');
    return setFeedback(direccion, 'errorDireccion', true);
  };

  const validarRegionComuna = () => {
    const regValida = region.value !== "";
    const comValida = comuna.value !== "";
    setFeedback(region, 'errorRegion', regValida, 'Selecciona una región.');
    setFeedback(comuna, 'errorComuna', comValida, 'Selecciona una comuna.');
    return regValida && comValida;
  };

  // Validaciones en tiempo real
  run.addEventListener('input', () => {
    // Guarda la posición actual y formatea el valor
    run.value = formatearRUN(run.value);

    // Ejecuta la validación
    validarRUN();
    });
  nombre.addEventListener('input', validarNombreReg);
  apellidos.addEventListener('input', validarApellidos);
  correo.addEventListener('input', validarCorreoReg);
  direccion.addEventListener('input', validarDireccion);
  region.addEventListener('change', validarRegionComuna);
  comuna.addEventListener('change', validarRegionComuna);

  // Envío final
  formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const okRun = validarRUN();
    const okNom = validarNombreReg();
    const okApe = validarApellidos();
    const okMail = validarCorreoReg();
    const okUbicacion = validarRegionComuna();
    const okDir = validarDireccion();

    if (okRun && okNom && okApe && okMail && okUbicacion && okDir) {
      alert('¡Registro exitoso!');
      formRegistro.reset();
      comuna.disabled = true;
      document.querySelectorAll('#formRegistro .is-valid').forEach(el => el.classList.remove('is-valid'));
    }
  });
});

// ==========================================
// VALIDACIONES Y LÓGICA DE INICIO DE SESIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('formLogin');
  if (!formLogin) return;

  const correo = document.getElementById('correoLogin');
  const password = document.getElementById('passwordLogin');

  // Regex para RFC 2822 (Correo)
  const rfc2822Regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  // Regex para Contraseña: Letras, números, caracteres especiales y longitud de 4 a 10
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

  const setFeedback = (input, idFeedback, esValido, mensajeError = '') => {
    const contenedor = document.getElementById(idFeedback);
    if (!esValido) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (contenedor) contenedor.textContent = mensajeError;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (contenedor) contenedor.textContent = '';
    }
    return esValido;
  };

  const validarCorreoLogin = () => {
    const valor = correo.value.trim();
    if (!valor) return setFeedback(correo, 'errorCorreoLogin', false, 'El correo es requerido.');
    if (valor.length > 100) return setFeedback(correo, 'errorCorreoLogin', false, 'Máximo 100 caracteres permitidos.');
    if (!rfc2822Regex.test(valor)) return setFeedback(correo, 'errorCorreoLogin', false, 'Formato de correo inválido.');
    return setFeedback(correo, 'errorCorreoLogin', true);
  };

  const validarPasswordLogin = () => {
    const valor = password.value.trim();
    if (!valor) return setFeedback(password, 'errorPasswordLogin', false, 'La contraseña es requerida.');
    if (valor.length < 8) return setFeedback(password, 'errorPasswordLogin', false, 'Debe tener al menos 8 caracteres.');
    if (!passwordRegex.test(valor)) return setFeedback(password, 'errorPasswordLogin', false, 'Debe contener al menos una mayuscula, una minuscula, un numero y contener un carácter especial.');
    return setFeedback(password, 'errorPasswordLogin', true);
  };

  correo.addEventListener('input', validarCorreoLogin);
  password.addEventListener('input', validarPasswordLogin);

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const okCorreo = validarCorreoLogin();
    const okPass = validarPasswordLogin();

    if (okCorreo && okPass) {
      const usuario = buscarUsuario(correo.value.trim(), password.value.trim());

      if (!usuario) {
        setFeedback(password, 'errorPasswordLogin', false, 'Correo o contraseña incorrectos.');
        return;
      }

      // Sesión activa mientras no haya backend real (se borra al cerrar la pestaña)
      sessionStorage.setItem('usuarioActivo', JSON.stringify({
        correo: usuario.correo,
        nombre: usuario.nombre,
        tipoUsuario: usuario.tipoUsuario,
      }));

      formLogin.reset();
      document.querySelectorAll('#formLogin .is-valid').forEach(el => el.classList.remove('is-valid'));

      // Redirige según el ROL del usuario, nunca según un botón que la persona eligió
      switch (usuario.tipoUsuario) {
        case 'administrador':
          window.location.href = '../admin/admin_stock.html';
          break;
        case 'vendedor':
          window.location.href = '../admin/admin_ordenes.html';
          break;
        default:
          window.location.href = '../../index.html';
      }
    }
  });
});
/**
 * admin-guard.js
 * Protege las páginas del panel administrativo (pages/admin/*.html).
 * Debe ser el PRIMER script en cargar en cada página protegida.
 *
 * Uso:
 *   <script src="../../assets/js/admin-guard.js" data-roles="administrador"></script>
 *   <script src="../../assets/js/admin-guard.js" data-roles="administrador,vendedor"></script>
 */
(function () {
  const scriptActual = document.currentScript;
  const rolesPermitidos = (scriptActual.dataset.roles || "administrador")
    .split(",")
    .map((r) => r.trim());

  const sesionGuardada = sessionStorage.getItem("usuarioActivo");
  const sesion = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  const tieneAcceso = sesion && rolesPermitidos.includes(sesion.tipoUsuario);

  if (!tieneAcceso) {
    window.location.replace("../usuario/login.html");
  }
})();

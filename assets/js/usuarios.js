/**
 * usuarios.js
 * Usuarios "de prueba" mientras el proyecto no tiene backend/base de datos real.
 * Cuando lleguen a la etapa de backend, esto se reemplaza por una consulta
 * real a la base de datos; por ahora simula esa tabla de usuarios.
 *
 * tipoUsuario: "administrador" | "vendedor" | "cliente"
 */

const USUARIOS = [
  {
    correo: "admin@checkpointstore.cl",
    password: "Admin123!",
    tipoUsuario: "administrador",
    nombre: "Administrador General",
  },
  {
    correo: "vendedor@checkpointstore.cl",
    password: "Vendedor123!",
    tipoUsuario: "vendedor",
    nombre: "Vendedor Tienda",
  },
  {
    correo: "cliente@checkpointstore.cl",
    password: "Cliente123!",
    tipoUsuario: "cliente",
    nombre: "Cliente Demo",
  },
];

/** Busca un usuario por correo y contraseña exactos */
function buscarUsuario(correo, password) {
  return USUARIOS.find(
    (u) => u.correo.toLowerCase() === correo.toLowerCase() && u.password === password
  );
}

const ordenes = [
  {
    rut: "19.011.022-K",
    nombre: "Luisa",
    apellido: "Gómez",
    correo: "luisa@gmail.com",
    region: "Región Metropolitana",
    comuna: "Providencia",
    direccion: "Av. Nueva Providencia 1234",
    monto: 650000,
    estado: "Pendiente"
  },
  {
    rut: "17.345.678-9",
    nombre: "Carlos",
    apellido: "Pérez",
    correo: "carlos@gmail.com",
    region: "Región de Valparaíso",
    comuna: "Viña del Mar",
    direccion: "Calle Los Pinos 456",
    monto: 1200000,
    estado: "Pagado"
  },
  {
    rut: "20.123.456-7",
    nombre: "Ana",
    apellido: "Rojas",
    correo: "ana@gmail.com",
    region: "Región del Biobío",
    comuna: "Concepción",
    direccion: "Av. Paicaví 789",
    monto: 800000,
    estado: "Enviado"
  },
  {
    rut: "18.987.654-3",
    nombre: "Pedro",
    apellido: "López",
    correo: "pedro@gmail.com",
    region: "Región de Ñuble",
    comuna: "Chillán",
    direccion: "Camino Viejo 321",
    monto: 950000,
    estado: "Entregado"
  },
  {
    rut: "21.456.789-5",
    nombre: "María",
    apellido: "Fernández",
    correo: "maria@gmail.com",
    region: "Región de la Araucanía",
    comuna: "Temuco",
    direccion: "Av. Alemania 222",
    monto: 720000,
    estado: "Pendiente"
  },
  {
    rut: "22.987.654-2",
    nombre: "José",
    apellido: "Ramírez",
    correo: "jose@gmail.com",
    region: "Región de Antofagasta",
    comuna: "Antofagasta",
    direccion: "Av. Angamos 999",
    monto: 1500000,
    estado: "Pagado"
  },
  {
    rut: "23.111.222-8",
    nombre: "Camila",
    apellido: "Torres",
    correo: "camila@gmail.com",
    region: "Región de Los Lagos",
    comuna: "Puerto Montt",
    direccion: "Av. Los Héroes 55",
    monto: 890000,
    estado: "Enviado"
  }
];


const tabla = document.getElementById("tabla-ordenes");

ordenes.forEach(o => {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${o.rut}</td>
    <td>${o.nombre}</td>
    <td>${o.apellido}</td>
    <td>${o.correo}</td>
    <td>${o.region}</td>
    <td>${o.comuna}</td>
    <td>${o.direccion}</td>
    <td>$${o.monto.toLocaleString()}</td>
    <td><span class="badge bg-${getColor(o.estado)}">${o.estado}</span></td>
    <td><button class="btn btn-sm btn-primary">Ver Detalle</button></td>
  `;
  tabla.appendChild(fila);
});

function getColor(estado) {
  switch (estado) {
    case "Pendiente": return "warning";
    case "Pagado": return "info";
    case "Enviado": return "secondary";
    case "Entregado": return "success";
    default: return "light";
  }
}


/**
 * data-productos.js
 * Arreglo único de productos de la tienda. Este mismo archivo se debe
 * incluir tanto en la página de listado (productos.html) como en la
 * página de detalle (product.html), ya que ambas leen desde aquí.
 *
 * categoria: "juego" | "consola" | "accesorio" | "figura"
 * formato:   solo aplica a categoria "juego" -> "digital" | "fisico"
 *
 * NOTA: uso categoría en minúscula ("juego", no "Juego") para que calce
 * tal cual con los checkboxes del aside y con NOMBRE_CATEGORIA en
 * productos.js. Si en otro archivo tuyo la categoría va con mayúscula,
 * ajusta uno de los dos lados para que coincidan exactamente.
 */

/** Etiqueta legible para cada categoría */
const NOMBRE_CATEGORIA = {
  juego: "Juego",
  consola: "Consola",
  accesorio: "Accesorio",
  figura: "Figura",
};


const PRODUCTOS = [
  // Juegos
  {
    id: 1,
    nombre: "Elden Ring",
    categoria: "juego",
    formato: "fisico",
    plataforma: "PS5 / Xbox Series X / PC",
    precio: 45000,
    stock: 15,
    imagen: "img/cara_elden_ring.jpg",
    descripcionCorta: "El aclamado juego de rol y acción de FromSoftware.",
    descripcionLarga: "Elden Ring es un juego de rol y acción en mundo abierto desarrollado por FromSoftware. Esta edición física incluye disco y caja original, con soporte para PS5, Xbox Series X y PC."
  },
  {
    id: 2,
    nombre: "Super Mario Odyssey",
    categoria: "juego",
    formato: "digital",
    plataforma: "Nintendo Switch",
    precio: 50000,
    stock: 999,
    imagen: "img/cara_super_mario_odyssey.jpg",
    descripcionCorta: "Aventura 3D clásica para Nintendo Switch.",
    descripcionLarga: "Super Mario Odyssey es una aventura de plataformas 3D para Nintendo Switch. Esta es la versión digital: el código de descarga llega asociado a tu cuenta al instante tras la compra."
  },

  // Consolas
  {
    id: 3,
    nombre: "PlayStation 5",
    categoria: "consola",
    precio: 550000,
    stock: 6,
    imagen: "img/cara_ps5.jpg",
    descripcionCorta: "Consola de nueva generación con lector de discos.",
    descripcionLarga: "PlayStation 5 con lector de discos incluido, SSD ultrarrápido y soporte para juegos en 4K. Compatible con la mayoría de títulos de PS4."
  },
  {
    id: 4,
    nombre: "Nintendo Switch OLED",
    categoria: "consola",
    precio: 350000,
    stock: 9,
    imagen: "img/cara_nintendo_switch_oled.jpg",
    descripcionCorta: "Consola híbrida con pantalla OLED vibrante.",
    descripcionLarga: "Nintendo Switch OLED combina modo portátil y de escritorio, con una pantalla OLED de colores más vivos y mayor contraste que el modelo estándar."
  },

  // Accesorios
  {
    id: 5,
    nombre: "Control DualSense",
    categoria: "accesorio",
    compatibilidad: "PlayStation 5",
    precio: 65000,
    stock: 30,
    imagen: "img/cara_dualsense.jpg",
    descripcionCorta: "Mando inalámbrico para PS5 con respuesta háptica.",
    descripcionLarga: "Control DualSense inalámbrico para PlayStation 5, con retroalimentación háptica y gatillos adaptativos que responden a la acción del juego."
  },
  {
    id: 6,
    nombre: "Guitarra Guitar Hero",
    categoria: "accesorio",
    compatibilidad: "Xbox 360 / Xbox One / PC",
    precio: 40000,
    stock: 8,
    imagen: "img/cara_guitarra_guitar_hero.jpg",
    descripcionCorta: "Guitarra de Guitar Hero para jugar en Xbox 360, Xbox One y PC.",
    descripcionLarga: "Guitarra inalámbrica compatible con Xbox 360, Xbox One y PC, ideal para los juegos de la saga Guitar Hero y Rock Band."
  },

  // Figuras
  {
    id: 7,
    nombre: "Amiibo Bowser",
    categoria: "figura",
    franquicia: "Super Mario / Nintendo",
    precio: 25000,
    stock: 20,
    imagen: "img/cara_amiibo_bowser.jpg",
    descripcionCorta: "Figura interactiva compatible con juegos de Nintendo Switch.",
    descripcionLarga: "Amiibo de Bowser, compatible con distintos juegos de Nintendo Switch que soportan funciones de Amiibo, como desbloqueo de contenido o personajes."
  },
  {
    id: 8,
    nombre: "Funko Pop Kratos",
    categoria: "figura",
    franquicia: "God of War",
    precio: 15000,
    stock: 25,
    imagen: "img/cara_funko_pop_kratos.jpg",
    descripcionCorta: "Figura coleccionable de Kratos de God of War.",
    descripcionLarga: "Figura coleccionable Funko Pop de Kratos, protagonista de la saga God of War. Ideal para exhibir junto a otros coleccionables de la franquicia."
  }
];

/**
 * Utilidad simple para formatear precios en pesos chilenos.
 * La usan tanto productos.js como product.html.
 */
function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CL");
}
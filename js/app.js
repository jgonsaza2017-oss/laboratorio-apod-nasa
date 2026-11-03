// Configuracion de idioma en Day.js
dayjs.locale("es");

// Elementos del DOM
const tituloApod = document.getElementById("apod-titulo");
const fechaApod = document.getElementById("apod-fecha");
const imagenApod = document.getElementById("apod-imagen");
const enlaceVideo = document.getElementById("enlace-video");
const explicacionApod = document.getElementById("apod-explicacion");
const btnFavorito = document.getElementById("btn-favorito");

const formularioBusqueda = document.getElementById("formulario-busqueda");
const inputFecha = document.getElementById("input-fecha");
const mensajeEstado = document.getElementById("mensaje-estado");
const listaFavoritos = document.getElementById("lista-favoritos");

// Variables globales del taller
let apodActual = null;
let favoritos = JSON.parse(localStorage.getItem("favoritos_apod")) || [];

// Restringir el calendario para no elegir dias futuros
inputFecha.max = dayjs().format("YYYY-MM-DD");

// Mostrar mensajes al usuario
function mostrarMensaje(texto, esError = true) {
  mensajeEstado.textContent = texto;
  mensajeEstado.style.color = esError ? "#ff6b6b" : "#4bb543";
}

function limpiarMensaje() {
  mensajeEstado.textContent = "";
}

// 1. Obtener la APOD desde la API de la NASA
async function obtenerApod(fechaNasa = null) {
  limpiarMensaje();
  tituloApod.textContent = "Cargando...";
  fechaApod.textContent = "";
  imagenApod.style.display = "none";
  enlaceVideo.style.display = "none";
  btnFavorito.style.display = "none";
  explicacionApod.innerHTML = "";

  // Si enviamos fecha buscamos con esa, si no, traemos la de hoy
  const url = fechaNasa
    ? `https://science.nasa.gov/wp-json/wp/v2/apod-basic/${fechaNasa}`
    : `https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=1`;

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error("No hay APOD para esa fecha");
    }

    const datos = await respuesta.json();

    // La de hoy viene en un arreglo [0], la fecha puntual es un objeto
    const apod = Array.isArray(datos) ? datos[0] : datos;
    apodActual = apod;

    pintarApod(apod);
  } catch (error) {
    tituloApod.textContent = "Error al cargar la APOD";
    mostrarMensaje(error.message, true);
  }
}

// Mostrar los datos en el HTML
function pintarApod(apod) {
  tituloApod.textContent = apod.title;
  fechaApod.textContent = dayjs(apod.date).format("D [de] MMMM [de] YYYY");

  // Mostrar imagen con hdurl
  if (apod.hdurl) {
    imagenApod.src = apod.hdurl;
    imagenApod.alt = apod.title;
    imagenApod.style.display = "block";
  }

  // Si es un video, mostrar boton al permalink
  if (apod.media_type === "video") {
    enlaceVideo.href = apod.permalink;
    enlaceVideo.style.display = "inline";
  } else {
    enlaceVideo.style.display = "none";
  }

  // Explicacion con innerHTML porque viene con etiquetas HTML
  explicacionApod.innerHTML = apod.explanation;
  btnFavorito.style.display = "inline-block";
}

// 2. Evento del buscador con validaciones
formularioBusqueda.addEventListener("submit", (e) => {
  e.preventDefault();
  limpiarMensaje();

  const fechaSeleccionada = inputFecha.value;

  // Validacion 1: Campo vacio
  if (!fechaSeleccionada) {
    mostrarMensaje("Por favor, selecciona una fecha.");
    return;
  }

  // Validacion 2: Fecha futura
  if (dayjs(fechaSeleccionada).isAfter(dayjs(), "day")) {
    mostrarMensaje("No se pueden consultar fechas futuras.");
    return;
  }

  // Validacion 3: Anterior al 16 de junio de 1995
  if (dayjs(fechaSeleccionada).isBefore(dayjs("1995-06-16"), "day")) {
    mostrarMensaje("La primera APOD fue el 16 de junio de 1995.");
    return;
  }

  // Convertir formato a YYMMDD que pide la API
  const formatoNasa = dayjs(fechaSeleccionada).format("YYMMDD");
  obtenerApod(formatoNasa);
});

// 3. Manejo de Favoritos con LocalStorage
function guardarEnFavoritos() {
  if (!apodActual) return;

  // Validar si ya existe con some
  const existe = favoritos.some((item) => item.date === apodActual.date);

  if (existe) {
    mostrarMensaje("Esta APOD ya está guardada en favoritos.");
    return;
  }

  // Guardamos solo lo necesario
  const nuevoFav = {
    date: apodActual.date,
    title: apodActual.title
  };

  favoritos.push(nuevoFav);
  localStorage.setItem("favoritos_apod", JSON.stringify(favoritos));
  mostrarMensaje("¡Guardada en favoritos!", false);

  mostrarFavoritos();
}

function mostrarFavoritos() {
  listaFavoritos.innerHTML = "";

  favoritos.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.title}</strong>
      <span>${dayjs(item.date).format("D [de] MMMM [de] YYYY")}</span>
    `;

    // Cargar la APOD al hacer clic
    li.addEventListener("click", () => {
      const formatoNasa = dayjs(item.date).format("YYMMDD");
      obtenerApod(formatoNasa);
    });

    listaFavoritos.appendChild(li);
  });
}

btnFavorito.addEventListener("click", guardarEnFavoritos);

// Carga inicial
mostrarFavoritos();
obtenerApod();
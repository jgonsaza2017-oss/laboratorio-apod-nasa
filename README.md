# Explorador APOD de la NASA

Proyecto desarrollado para el módulo de JavaScript y consumo de APIs de **Generation Colombia (Cohorte 15)**.

## Funcionalidades
* **Foto del día:** Carga automática de la Astronomy Picture of the Day al abrir la aplicación, mostrando título, fecha formateada en español, imagen o video y explicación científica.
* **Búsqueda por fecha:** Permite consultar registros desde el 16 de junio de 1995 hasta la fecha actual, convirtiendo el formato a `AAMMDD` para consultar la API de la NASA.
* **Validaciones de fecha:** Verificación de campos vacíos, fechas futuras y fechas anteriores al inicio del registro de APOD.
* **Favoritos persistentes:** Guardado de elementos en `localStorage` evitando duplicados y permitiendo recargar la foto al hacer clic en un elemento guardado.

## Tecnologías utilizadas
* HTML5 semántico
* CSS3 (Grid y Flexbox)
* JavaScript moderno (ES6+, Fetch API, async/await, localStorage)
* [Day.js](https://day.js.org/) (instalado vía npm para formateo y validación de fechas)
* API pública de la NASA (APOD)

## Instalación y ejecución
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jgonsaza2017-oss/laboratorio-apod-nasa.git
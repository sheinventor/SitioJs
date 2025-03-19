function searchFunction() {
    let query = document.getElementById("search").value.trim();
    if (query) {
        window.location.href = `resultados.html?q=${encodeURIComponent(query)}`;
    }
}

// Función para activar/desactivar el menú en móviles
function toggleMenu() {
    document.getElementById("nav-links").classList.toggle("show");
    nav.classList.toggle("active");
}

// Función para incluir la barra de navegación en todas las páginas
document.addEventListener("DOMContentLoaded", function() {
    fetch("/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
        })
        .catch(error => console.error("Error cargando la barra de navegación:", error));
});


document.addEventListener('DOMContentLoaded', () => {
    fetch('json/textos.json')  // Cargar el JSON con los textos y rutas
        .then(response => response.json())
        .then(data => {
            cargarGaleriaProyectos(data.proyectos);
            cargarGaleriaComics(data.comics);
        })
        .catch(error => console.error("Error al cargar los datos JSON:", error));
});



// Función para cargar la galería de proyectos
function cargarGaleriaProyectos(proyectos) {
    const galleryProjets = document.getElementById('gallery-projets');
    galleryProjets.innerHTML = ""; // Limpiar contenido antes de agregar

    proyectos.forEach((proyecto) => {
        const div = document.createElement('div');
        div.classList.add("project-item");

        div.innerHTML = `
            <h3>${proyecto.nombre}</h3>
            <img src="${proyecto.imagen}" alt="${proyecto.nombre}" class="preview-image">
            <p>${proyecto.descripcion}</p>
        `;

        div.addEventListener('click', () => mostrarGaleriaCompleta(proyecto.carpeta));

        galleryProjets.appendChild(div);
    });
}

// Función para cargar la galería de cómics (corregida)
function cargarGaleriaComics(comics) {
    const galleryComics = document.getElementById('gallery-comics');
    galleryComics.innerHTML = ""; // Limpiar contenido antes de agregar

    comics.forEach((comic) => {
        const div = document.createElement('div');
        div.classList.add("comic-item");

        // Construir ruta de la imagen de portada
        const rutaImagen = `Comics/comics/${comic.carpeta}/0.jpg`;

        div.innerHTML = `
            <h3>${comic.nombre}</h3>
            <img src="${rutaImagen}" alt="${comic.nombre}" class="preview-image">
            <p>${comic.descripcion}</p>
        `;

        // Mostrar error si la imagen no se encuentra
        div.querySelector("img").onerror = function() {
            console.error(`No se pudo cargar la imagen: ${rutaImagen}`);
            this.src = "img/error.jpg"; // Imagen por defecto si no existe
        };

        div.addEventListener('click', () => mostrarGaleriaCompleta(`Comics/comics/${comic.carpeta}`));

        galleryComics.appendChild(div);
    });
}

// Función para mostrar la galería completa al hacer clic en una imagen
function mostrarGaleriaCompleta(carpeta) {
    const modal = document.getElementById('modal-galeria');
    const modalContent = document.getElementById('modal-content');

    if (!modal || !modalContent) {
        console.error("Error: No se encontró el modal en el DOM.");
        return;
    }

    modalContent.innerHTML = ""; // Limpiar contenido previo

    for (let i = 0; i < 10; i++) { // Ajusta el número máximo de imágenes si es necesario
        const img = new Image();
        img.src = `${carpeta}/${i}.jpg`; // Ruta corregida
        img.alt = `Imagen ${i}`;
        img.onerror = () => img.remove(); // Si la imagen no existe, se elimina
        modalContent.appendChild(img);
    }

    modal.style.display = "block"; // Mostrar el modal
}

// Cerrar el modal al hacer clic fuera de la imagen
document.getElementById('modal-galeria').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = "none";
    }
});

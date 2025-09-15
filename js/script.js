function mostrarSeccion(id) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(sec => sec.classList.remove('activa'));

    const activa = document.getElementById(id);
    if (activa) activa.classList.add('activa');

    const botonesMenu = document.querySelectorAll('.menu li');
    botonesMenu.forEach(btn => btn.classList.remove('activo'));

    const botonActivo = document.querySelector(`.menu li[onclick*="${id}"]`);
    if (botonActivo) botonActivo.classList.add('activo');
}

window.onload = function () {
    /* -------------------- Fondo animado (sin cambios) -------------------- */
    const canvas = document.getElementById("fondoAnimado");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particulas = [];
    const total = 100;
    for (let i = 0; i < total; i++) {
        particulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedY: Math.random() * -0.5 - 0.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    function animar() {
        ctx.clearRect(0 , 0, canvas.width, canvas.height);
        for (let i = 0; i < particulas.length; i++) {
            const p = particulas[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 100, 0, ${p.opacity})`;
            ctx.fill();
            p.y += p.speedY;
            if (p.y < 0) {
                p.y = canvas.height;
                p.x = Math.random() * canvas.width;
            }
        }
        requestAnimationFrame(animar);
    }

    /* -------------------- Referencias DOM -------------------- */
    const modalMapa = document.getElementById("modalMapa");
    const abrirMapa = document.getElementById("abrirMapa");
    const cerrarMapa = document.querySelector(".cerrar");

    // abrir / cerrar modal
    abrirMapa.addEventListener("click", () => {
        modalMapa.classList.add("show");
        modalMapa.style.display = "block";
        document.body.style.overflow = "hidden";
    });

    cerrarMapa.addEventListener("click", () => {
        modalMapa.classList.remove("show");
        setTimeout(() => modalMapa.style.display = "none", 400);
        document.body.style.overflow = "";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modalMapa) {
            modalMapa.classList.remove("show");
            setTimeout(() => modalMapa.style.display = "none", 400);
            document.body.style.overflow = "";
        }
    });

    const nodos = document.querySelectorAll('.nodo');
    const infoPanel = document.getElementById('infoPanel');
    const tituloRegion = document.getElementById('tituloRegion');
    const descripcionRegion = document.getElementById('descripcionRegion');
    const cerrarPanel = document.getElementById('cerrarPanel');
    const imagenesRegion = document.getElementById('imagenesRegion');

    const regiones = {
        "Demacia": { desc: "Una nación orgullosa y militarizada.", color: "#e6e6e6", img: "img/Demacia.png" },
        "Noxus": { desc: "Un imperio expansionista que valora la fuerza y la astucia.", color: "#b30000", img: "img/Noxus.png" },
        "Freljord": { desc: "Una tierra helada en guerra constante entre tribus.", color: "#3399ff", img: "img/freljord.png" },
        "Ionia": { desc: "Una tierra espiritual, invadida y marcada por la guerra.", color: "#cc66ff", img: "img/Jonia.png" },
        "Piltover & Zaun": { desc: "Ciudades hermanas: una brillante, la otra corrupta bajo tierra.", color: "#33cc33", img: "img/ZaunYPiltover.png" },
        "Bilgewater": { desc: "Un puerto pirata lleno de cazadores de monstruos marinos.", color: "#006666", img: "img/Bilgewater.png" },
        "Shurima": { desc: "Un antiguo imperio desértico que busca renacer.", color: "#d4af37", img: "img/shurima.png" },
        "Targon": { desc: "Montañas míticas donde mortales se enfrentan a lo divino.", color: "#ccccff", img: "img/Targon.png" },
        "Ixtal": { desc: "Una civilización aislada, maestra en la magia elemental.", color: "#228b22", img: "img/ixtal1.png" },
        "Islas de la Sombra": { desc: "Un lugar maldito donde reina la niebla negra.", color: "#444444", img: "img/shadow_isles.png" }
    };

    /* -------------------- MOVEMOS infoPanel al overlay (modalMapa) para evitar recortes -------------------- */
    if (modalMapa && infoPanel && infoPanel.parentElement !== modalMapa) {
        modalMapa.appendChild(infoPanel);          // ahora el panel está dentro del overlay
        infoPanel.style.position = 'absolute';     // absoluto RELATIVO al overlay
        infoPanel.style.zIndex = '11000';
        infoPanel.style.display = 'none';
    }

    /* -------------------- Handler de nodos -------------------- */
    nodos.forEach(nodo => {
        const color = nodo.dataset.color || "red";
        nodo.style.backgroundColor = color;
        nodo.style.boxShadow = `0 0 10px ${color}`;

        nodo.addEventListener('click', (e) => {
            e.stopPropagation(); // evita propagación indeseada

            const nombre = nodo.dataset.info;
            const region = regiones[nombre];

            // Rellenar contenido del panel
            if (region) {
                tituloRegion.textContent = nombre;
                tituloRegion.style.color = region.color;
                descripcionRegion.textContent = region.desc || "";

                imagenesRegion.innerHTML = "";
                const listaImgs = region.imgs || (region.img ? [region.img] : []);
                listaImgs.forEach(src => {
                    const img = document.createElement("img");
                    img.src = src;
                    img.style.width = "200px";
                    img.style.margin = "10px";
                    img.style.borderRadius = "12px";
                    imagenesRegion.appendChild(img);
                });

                infoPanel.style.setProperty("--glow-color", region.color);
                infoPanel.classList.add("glow");
            }

            // ---------------- Posicionar el panel en relación al overlay (modalMapa) ----------------
            // Mostrar (necesario para medir tamaño real)
            infoPanel.style.display = 'block';
            infoPanel.classList.remove('show'); // reinicia animación si existía

            const rect = nodo.getBoundingClientRect();     // coords del nodo (viewport)
            const modalRect = modalMapa.getBoundingClientRect(); // coords del overlay (viewport)

            // Propuesta: intentar a la derecha; si no cabe, a la izquierda
            let leftViewport = rect.right + 12;
            let topViewport  = rect.top - 10;

            // Convertir a coordenadas RELATIVAS al overlay (modalMapa)
            let leftRel = leftViewport - modalRect.left;
            let topRel  = topViewport - modalRect.top;

            infoPanel.style.left = `${leftRel}px`;
            infoPanel.style.top  = `${topRel}px`;

            // Medir y ajustar dentro del overlay
            requestAnimationFrame(() => {
                const panelRect = infoPanel.getBoundingClientRect();

                // Si se sale por la derecha -> colocarlo a la izquierda del nodo
                if (panelRect.right > modalRect.right - 12) {
                    const leftViewportLeft = rect.left - panelRect.width - 12;
                    leftRel = Math.max(leftViewportLeft - modalRect.left, 12);
                    infoPanel.style.left = `${leftRel}px`;
                }

                // Si se sale por la izquierda -> ajustarlo al borde
                if (panelRect.left < modalRect.left + 12) {
                    infoPanel.style.left = `12px`;
                }

                // Si se sale por abajo -> subirlo dentro del overlay
                if (panelRect.bottom > modalRect.bottom - 12) {
                    const topRelBottom = modalRect.height - panelRect.height - 12;
                    infoPanel.style.top = `${Math.max(topRelBottom, 12)}px`;
                }

                // Si se sale por arriba -> bajarlo al borde superior
                if (panelRect.top < modalRect.top + 12) {
                    infoPanel.style.top = `12px`;
                }

                // Finalmente mostrar con clase (animación)
                infoPanel.classList.add('show');
            });
        });
    });

    // click fuera del panel lo cierra
    window.addEventListener('click', (e) => {
        if (!e.target.closest('#infoPanel') && !e.target.closest('.nodo')) {
            infoPanel.classList.remove('show');
            infoPanel.classList.remove('glow');
            setTimeout(() => { infoPanel.style.display = 'none'; }, 300);
        }
    });

    // clic en la X del panel
    cerrarPanel.addEventListener('click', () => {
        infoPanel.classList.remove('show');
        infoPanel.classList.remove('glow');
        setTimeout(() => { infoPanel.style.display = 'none'; }, 300);
    });

    animar();
};



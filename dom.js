document.addEventListener("keydown", function(event) {
    const imagen = document.getElementById("imagen");

    if (event.key === "ArrowRight") {
        document.getElementById("TituloImg").textContent="Pulse esc para que desaparezca la imagen";
        imagen.style.display = "block";
    } 
    else if (event.key === "Escape") {
        document.getElementById("TituloImg").textContent="Pulse la flecha de la derecha para que aparezca la imagen";
        imagen.style.display = "none";
    }
    else if (event.key === "ArrowUp") {
        crearTabla();
    }
    else if (event.key === "a" || event.key === "A") {
        const titulo = this.title
        document.getElementById("tituloPagina").textContent="El titulo de la página es: " + titulo;
    }
    else if (event.key === " ") {
        emailjs.init('Q9IXjfl3zt8i4LNh4')
        emailjs.send("service_s8eioru","template_js8cvxp");
        alert("El correo ha sido enviado");
    }
    else if (event.key === 'q' || event.key === 'Q'){
        fetch('/cgi-bin/programa.sh')
            .then(response => response.text())
            .then(data => alert("Script ejecutado: " + data))
            .catch(error => console.error('Error al ejecutar el script:', error));
    }
    else if(event.key === 'o' || event.key === 'O'){
        mostrarRegistros();
    }
    else if(event.key === '0'){
        const tabla = document.querySelector("#tablita");
        if (tabla) {
            const filas = tabla.getElementsByTagName("tr");
            for (var i = 0; i < filas.length; i++) {
                const celdas = filas[i].getElementsByTagName("td");
                for (var j = 0; j < celdas.length; j++) {
                    if (celdas[j].textContent.trim() === '4') {
                        celdas[j].style.color = 'green';
                    }
                }
            }
        }
    }
    else if(event.key === '2'){
        fetch('/cgi-bin/habilitado3min.sh')
        .then(response => response.text())
        .then(data => alert("Servicio shellinabox iniciado. Se detendrá en 3 minutos."))
        .catch(error => console.error('Error al iniciar el servicio:', error));
    }
});

function crearTabla() {
    var a = 0;
    const tabla = document.getElementById("tablita");
    tabla.innerHTML = ''; 

    const arrayNumbers = [1, 2, 3, 4, "X", 5, 6, 7, 8];
    const fragment2 = document.createDocumentFragment();
    const table = document.createElement("table");
    table.setAttribute("border", "1");

    for (var i = 0; i < 3; i++) {
        const tr = document.createElement("tr");
        for (var j = 0; j < 3; j++) {
            const td = document.createElement("td");
            const valor = arrayNumbers[a];
            if (valor === "X") {
                td.innerHTML = '\u00A0 \u00A0' + valor + '\u00A0 \u00A0';
                td.style.color = 'blue';
            } else {
                td.innerHTML = '\u00A0 \u00A0' + valor + '\u00A0 \u00A0';
            }
            tr.appendChild(td);
            a++;
        }
        fragment2.appendChild(tr);
    }
    table.appendChild(fragment2);
    tabla.appendChild(table);
}

const dbName = "estudiantesDB";
const dbVersion = 1;
let db;

const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("estudiantes", { keyPath: "id" });
    objectStore.transaction.oncomplete = function() {
        const estudianteStore = db.transaction("estudiantes", "readwrite").objectStore("estudiantes");
        const estudiantes = [
            { id: 1, nombre: "Felipe", semestre: 6, años: 20 },
            { id: 2, nombre: "Nicolas", semestre: 6, años: 20 },
            { id: 3, nombre: "Luis", semestre: 6, años: 21 },
            { id: 4, nombre: "Julian", semestre: 6, años: 20 },
            { id: 5, nombre: "Tomas", semestre: 6, años: 19 }
        ];
        estudiantes.forEach(estudiante => {
            estudianteStore.add(estudiante);
        });
    };
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onerror = function(event) {
    console.error("Error al abrir la base de datos:", event.target.errorCode);
};

function mostrarRegistros() {
    const tablaEstudiantes = document.getElementById("tablaRegistros");
    tablaEstudiantes.innerHTML = '';

    const transaction = db.transaction(["estudiantes"], "readonly");
    const objectStore = transaction.objectStore("estudiantes");
    
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const estudiantes = event.target.result;
        const fragment = document.createDocumentFragment();
        
        const table = document.createElement("table");
        table.setAttribute("border", "1");
        
        const headerRow = document.createElement("tr");
        const headers = ["ID", "Nombre", "Semestre", "Años"];
        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.innerHTML = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        estudiantes.forEach(estudiante => {
            const tr = document.createElement("tr");
            Object.values(estudiante).forEach(value => {
                const td = document.createElement("td");
                td.innerHTML = value;
                tr.appendChild(td);
            });
            fragment.appendChild(tr);
        });
        table.appendChild(fragment);
        tablaEstudiantes.appendChild(table);
    };
}
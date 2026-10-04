// ESTRUCTURA DE DATOS 
const MAX_ALUMNOS = 10;
const nombres = new Array(MAX_ALUMNOS);                                  // Arreglo unidimensional de largo 10
const notas = Array.from({ length: MAX_ALUMNOS }, () => [0, 0, 0]);      // Matriz de 10 filas y 3 columnas
let total = 0;                                                          // Contador de alumnos ingresados

// FUNCIONES DE CÁLCULO (ORDEN SUPERIOR)
// Calcula el promedio individual usando reduce
const calcularPromedioAlumno = (notasAlumno) => 
    notasAlumno.reduce((suma, nota) => suma + nota, 0) / notasAlumno.length;

// Calcula el promedio del curso por certamen (C1, C2, C3) usando map y reduce
const calcularPromediosCertamenes = () => [0, 1, 2].map(col => 
    notas.slice(0, total).reduce((suma, fila) => suma + fila[col], 0) / total
);

// ENTRADA DE DATOS Y VALIDACION
document.getElementById("form-alumno").addEventListener("submit", function(e) {
    e.preventDefault();

    if (total >= MAX_ALUMNOS) {
        alert("El curso ya está completo con el máximo de 10 alumnos.");
        return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const c1 = parseFloat(document.getElementById("certamen1").value);
    const c2 = parseFloat(document.getElementById("certamen2").value);
    const c3 = parseFloat(document.getElementById("certamen3").value);

    // Validación de datos correctos
    if (!nombre) {
        alert("Por favor, ingresa el nombre del alumno.");
        return;
    }
    if (isNaN(c1) || isNaN(c2) || isNaN(c3)) {
        alert("Por favor, ingresa las 3 notas.");
        return;
    }
    if ([c1, c2, c3].some(n => n < 1 || n > 100)) {
        alert("Las notas deben ser números válidos entre 1 y 100.");
        return;
    }

    // Almacenar en el arreglo y en la matriz
    nombres[total] = nombre;
    notas[total] = [c1, c2, c3];
    total++;

    // Presentar resultados y limpiar campos
    mostrarResultados();
    this.reset();
    document.getElementById("nombre").focus();
});
// PRESENTACIÓN DE RESULTADOS

function mostrarResultados() {
    // Cálculos con funciones de orden superior
    const promedios = nombres.slice(0, total).map((_, i) => calcularPromedioAlumno(notas[i]));
    const [promC1, promC2, promC3] = calcularPromediosCertamenes();
    const promFinal = promedios.reduce((acc, p) => acc + p, 0) / total;
    const aprobados = promedios.filter(p => p >= 55).length;
    const reprobados = promedios.filter(p => p < 55).length;

    // Ordenar alumnos según su promedio (de mayor a menor)
    const ordenados = nombres.slice(0, total)
        .map((nom, i) => ({ nombre: nom, promedio: promedios[i] }))
        .sort((a, b) => b.promedio - a.promedio);

    // Generar formato idéntico al de la imagen de referencia
    let html = "";
    for (let i = 0; i < total; i++) {
        html += `
            <p><strong>Nombre ${i + 1}:</strong> ${nombres[i]}</p>
            <p>C1: ${notas[i][0]}</p>
            <p>C2: ${notas[i][1]}</p>
            <p>C3: ${notas[i][2]}</p>
            <p>Promedio: ${promedios[i].toFixed(2)}</p>
        `;
    }

    html += `
        <br>
        <p>Promedio del curso C1: ${promC1.toFixed(2)}</p>
        <p>Promedio del curso C2: ${promC2.toFixed(2)}</p>
        <p>Promedio del curso C3: ${promC3.toFixed(2)}</p>
        <p><strong>Promedio Final Curso:</strong> ${promFinal.toFixed(2)}</p>
        <p><strong>Aprobados:</strong> ${aprobados}</p>
        <p><strong>Reprobados:</strong> ${reprobados}</p>
        <br>
        <p><strong>Alumnos Ordenados por Promedio:</strong></p>
        ${ordenados.map((al, idx) => `<p>${idx + 1}. ${al.nombre}: ${al.promedio.toFixed(2)}</p>`).join("")}
    `;

    const contenedor = document.getElementById("seccion-resultados");
    contenedor.innerHTML = html;
    contenedor.style.display = "block";
}

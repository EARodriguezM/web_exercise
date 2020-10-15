// Variables globales

const FormularioAsignaturaUI = document.getElementById('formularioAsignatura');
const FormularioEstudianteUI = document.getElementById('formularioEstudiante');
const FormularioNotaUI = document.getElementById('formularioNota');

const ListaDatosUI = document.getElementById('listaDatos');

const ListaAsignaturasUI = document.getElementById('listaAsignaturas');
const ListaEstudiantesUI = document.getElementById('listaEstudiantes');

const ListaNotasCorte1UI = document.getElementById('listaNotasCorte1');
const ListaNotasCorte2UI = document.getElementById('listaNotasCorte2');
const ListaNotasCorte3UI = document.getElementById('listaNotasCorte3');

let ListaAsignaturas = [];
let ListaEstudiantes = [];

let ListaCalificaciones = [];

// Funciones

//#region Asignatura
function crearAsignatura(codigo, asignatura) {

    let item = {
        codigo: codigo,
        asignatura: asignatura
    }
    return item;
}

function agregarAsignatura() {
    let item = crearAsignatura(FormularioAsignaturaUI['codigo'].value, FormularioAsignaturaUI['nombreAsignatura'].value);
    ListaAsignaturas.push(item);
    guardarAsignaturaDB();
    FormularioAsignaturaUI.reset();
}

function eliminarAsignatura(id) {
    let index = ListaAsignaturas.findIndex(e => e.codigo === id);
    ListaAsignaturas.splice(index, 1);
    guardarAsignaturaDB();
}

function consultarAsignaturas() {
    ListaAsignaturas = JSON.parse(localStorage.getItem('asignaturas'));
}

function guardarAsignaturaDB() {
    localStorage.setItem('asignaturas', JSON.stringify(ListaAsignaturas));
    llenarListaAsignaturasUI();
}

function llenarListaAsignaturasUI() {
    consultarAsignaturas();
    ListaAsignaturasUI.innerHTML = '';
    if (ListaAsignaturas === null) {
        ListaAsignaturas = [];
    } else {
        ListaAsignaturas.forEach(e => {
            ListaAsignaturasUI.innerHTML += `<tr><th scope="row">1</th><td>${e.codigo}</td><td>${e.asignatura}</td><td><button type="button" id="${e.codigo}" class="btn btn-danger btn-sm" onclick="eliminarAsignatura(this.id)"><i class="material-icons">delete</i></button></td></tr>`
        });
    }
}
//#endregion

//#region Estudiante
function crearEstudiante(codigo, nombre) {

    let item = {
        codigo: codigo,
        nombre: nombre
    }
    return item;
}

function agregarEstudiante() {
    let item = crearEstudiante(FormularioEstudianteUI['codigo'].value, FormularioEstudianteUI['nombreEstudiante'].value);
    ListaEstudiantes.push(item);
    guardarEstudiantesDB();
    FormularioEstudianteUI.reset();
}

function eliminarEstudiante(id) {
    let index = ListaEstudiantes.findIndex(e => e.codigo === id);
    ListaEstudiantes.splice(index, 1);
    guardarEstudiantesDB();
}

function consultarEstudiantes() {
    ListaEstudiantes = JSON.parse(localStorage.getItem('estudiantes'));
}

function guardarEstudiantesDB() {
    localStorage.setItem('estudiantes', JSON.stringify(ListaEstudiantes));
    llenarListaEstudiantesUI();
    //console.save(JSON.parse(localStorage.getItem('estudiantes')),"estudiantes");
}

function llenarListaEstudiantesUI() {
    consultarEstudiantes();
    ListaEstudiantesUI.innerHTML = '';

    if (ListaEstudiantes === null) {
        ListaEstudiantes = [];
    } else {
        ListaEstudiantes.forEach(e => {
            ListaEstudiantesUI.innerHTML += `<tr><th scope="row">1</th><td>${e.codigo}</td><td>${e.nombre}</td><td><button type="button" id="${e.codigo}" class="btn btn-danger btn-sm" onclick="eliminarEstudiante(this.id)"><i class="material-icons">delete</i></button></td></tr>`
        });
    }
}
//#endregion

//#region Calificacion
function crearCalificacion(asignatura, estudiante, cortes, definitiva) {

    let item = {
        asignatura: asignatura,
        estudiante: estudiante,
        cortes: cortes,
        definitiva: definitiva
    }
    return item;
}

function crearCorte(corte, notas, definitiva) {
    let item = {
        corte: corte,
        notas: notas,
        definitiva: definitiva
    }
    return item;
}

function crearNota(descripcion, porcentaje, nota) {
    let item = {
        descripcion: descripcion,
        porcentaje: porcentaje,
        nota: nota
    }
    return item;
}

let listaNotasCorte1TEMP = [];
let porcentajeCorte1TEMP = parseInt(0);
let listaNotasCorte2TEMP = [];
let porcentajeCorte2TEMP = parseInt(0);
let listaNotasCorte3TEMP = [];
let porcentajeCorte3TEMP = parseInt(0);

function agregarNota() {
    let estudianteCodigo = FormularioNotaUI['estudiante'].value;
    let asignaturaCodigo = FormularioNotaUI['asignatura'].value;

    let descripcion = FormularioNotaUI['descripcion'].value;
    let nota = parseFloat(FormularioNotaUI['nota'].value);
    let porcentaje = parseInt(FormularioNotaUI['porcentaje'].value);

    if (!validarIngreso(estudianteCodigo, asignaturaCodigo, descripcion, nota, porcentaje)) {
        $('#error').modal('show')
        let errorBody = document.getElementById('errorBody');
        errorBody.innerHTML = `<h5>Seleccione todos los campos para continuar</h5>`;
        return false;
    }

    if (!validarNota(nota)) {
        $('#error').modal('show')
        let errorBody = document.getElementById('errorBody');
        errorBody.innerHTML = `<h5>La nota se debe encontrar entre 0 y 5</h5>`;
        return false;
    }

    let notaCreada = crearNota(descripcion, porcentaje, nota);

    let corte;

    if (document.getElementById("list-corte-1").className.indexOf("active") >= 0) corte = "1";

    if (document.getElementById("list-corte-2").className.indexOf("active") >= 0) corte = "2";

    if (document.getElementById("list-corte-3").className.indexOf("active") >= 0) corte = "3";


    if (!validarPorcentaje(porcentaje, corte)) {
        $('#error').modal('show');
        let errorBody = document.getElementById('errorBody');
        errorBody.innerHTML = `<h5>El valor que esta intentando ingresar en el <b>CORTE ${corte}</b> hace que la suma de los porcentajes en la materia de mas de 100% </h5>`;
        return false;
    }
    FormularioNotaUI['descripcion'].value = '';
    FormularioNotaUI['nota'].value = '';
    FormularioNotaUI['porcentaje'].value = '';


    deshabilitarSelects()

    agregarNota_Corte(notaCreada, corte);
    llenarListaNotasUI();
}

function agregarNota_Corte(notaCreada, corte) {
    if (corte == "1") {
        listaNotasCorte1TEMP.push(notaCreada);
    }
    if (corte == "2") {
        listaNotasCorte2TEMP.push(notaCreada);
    }
    if (corte == "3") {
        listaNotasCorte3TEMP.push(notaCreada);
    }
}

function guardarCambios() {
    let corte = ["1", "2", "3"];
    let guardar = corte.every(e => {
        if (!validarPorcentaje(0, e)) {
            $('#error').modal('show');
            let errorBody = document.getElementById('errorBody');
            errorBody.innerHTML = `<h5>Esta intentando guardar cambios con una suma de porcentaje menor a 100% para el <b>CORTE ${e}</b></h5>`;
            return false;
        } else {
            return true;
        }
    })

    let estudianteCodigo = FormularioNotaUI['estudiante'].value;
    let asignaturaCodigo = FormularioNotaUI['asignatura'].value;


    let definitivaCorte1 = calculoDefinitivaCorte(listaNotasCorte1TEMP);
    let definitivaCorte2 = calculoDefinitivaCorte(listaNotasCorte2TEMP);
    let definitivaCorte3 = calculoDefinitivaCorte(listaNotasCorte3TEMP);

    let cortes = [crearCorte("1", listaNotasCorte1TEMP, definitivaCorte1), crearCorte("2", listaNotasCorte2TEMP, definitivaCorte2), crearCorte("3", listaNotasCorte3TEMP, definitivaCorte3)];

    let definitivaAsignatura = (definitivaCorte1 * 0.3) + (definitivaCorte2 * 0.3) + (definitivaCorte3 * 0.4);

    ListaCalificaciones.push(crearCalificacion(asignaturaCodigo, estudianteCodigo, cortes, definitivaAsignatura));

    if (guardar) guardarCalificaciónDB();
}

function eliminarNota(id,lista) {
    if (lista == 1) {
        porcentajeCorte1TEMP -= listaNotasCorte1TEMP[id].porcentaje;
        listaNotasCorte1TEMP.splice(id, 1);

    }
    if (lista == 2) {
        porcentajeCorte2TEMP -= listaNotasCorte2TEMP[id].porcentaje;
        listaNotasCorte2TEMP.splice(id, 1);
    }
    if (lista == 3) {
        porcentajeCorte3TEMP -= listaNotasCorte3TEMP[id].porcentaje;
        listaNotasCorte3TEMP.splice(id, 1);
    }
    
    llenarListaNotasUI();
}

function guardarCalificaciónDB() {
    localStorage.setItem('calificaciones', JSON.stringify(ListaCalificaciones));
    llenarListaDatosUI();
    limpiarFormularioCompletamente();
}

function consultarCalificaciones() {
    ListaCalificaciones = JSON.parse(localStorage.getItem('calificaciones'));
}

function llenarListaNotasUI() {
    ListaNotasCorte1UI.innerHTML = '';
    ListaNotasCorte2UI.innerHTML = '';
    ListaNotasCorte3UI.innerHTML = '';

    if (listaNotasCorte1TEMP === null) {
        listaNotasCorte1TEMP = [];
    } else {
        listaNotasCorte1TEMP.forEach((e,index) => {
            ListaNotasCorte1UI.innerHTML += `<tr>
            <th scope="row">1</th>
            <td>${e.descripcion}</td>
            <td>${e.porcentaje}</td>
            <td>${e.nota}</td>
            <td>
                <button type="button" id="${index}"
                    class="btn btn-danger btn-sm" onclick="eliminarNota(this.id,1)">
                    <i class="material-icons">
                        delete
                    </i>
                </button>
            </td>
        </tr>`
        });
    }
    if (listaNotasCorte2TEMP === null) {
        listaNotasCorte2TEMP = [];
    } else {
        listaNotasCorte2TEMP.forEach((e,index) => {
            ListaNotasCorte2UI.innerHTML += `<tr>
            <th scope="row">1</th>
            <td>${e.descripcion}</td>
            <td>${e.porcentaje}</td>
            <td>${e.nota}</td>
            <td>
                <button type="button" id="${index}"
                    class="btn btn-danger btn-sm" onclick="eliminarNota(this.id,2)">
                    <i class="material-icons">
                        delete
                    </i>
                </button>
            </td>
        </tr>`
        });
    }
    if (listaNotasCorte3TEMP === null) {
        listaNotasCorte3TEMP = [];
    } else {
        listaNotasCorte3TEMP.forEach((e,index) => {
            ListaNotasCorte3UI.innerHTML += `<tr>
            <th scope="row">1</th>
            <td>${e.descripcion}</td>
            <td>${e.porcentaje}</td>
            <td>${e.nota}</td>
            <td>
                <button type="button" id="${index}"
                    class="btn btn-danger btn-sm" onclick="eliminarNota(this.id,3)">
                    <i class="material-icons">
                        delete
                    </i>
                </button>
            </td>
        </tr>`
        });
    }

    deshabilitarSelects();
}

function mapearCortes(index) {
    ListaCalificaciones[index].cortes.forEach((e,index) => {
        e.notas.forEach((e2) => {
            let item = {
                descripcion: e2.descripcion,
                porcentaje: e2.porcentaje,
                nota: e2.nota
            }
            if (index == 0){listaNotasCorte1TEMP.push(item);porcentajeCorte1TEMP += e2.porcentaje;}
            if (index == 1){listaNotasCorte2TEMP.push(item);porcentajeCorte2TEMP += e2.porcentaje;}
            if (index == 2){listaNotasCorte3TEMP.push(item);porcentajeCorte3TEMP += e2.porcentaje;}
        })        
    })
    FormularioNotaUI['estudiante'].disabled = true;
    FormularioNotaUI['asignatura'].disabled = true;
    FormularioNotaUI['estudiante'].value = ListaCalificaciones[index].estudiante;
    FormularioNotaUI['asignatura'].value = ListaCalificaciones[index].asignatura;
    
}


function cargarEstudiantesEnSelect() {
    var combo = document.getElementById("estudiante");

    var option = document.createElement("option");
    combo.options.add(option, 0);
    combo.options[0].value = "0";
    combo.options[0].innerText = "Escoja...";

    ListaEstudiantes.forEach((e, i) => {
        var option = document.createElement("option");
        combo.options.add(option, i + 1);
        combo.options[i + 1].value = e.codigo;
        combo.options[i + 1].innerText = e.nombre;
    });
}

function cargarAsignaturasEnSelect() {
    var combo = document.getElementById("asignatura");

    var option = document.createElement("option");
    combo.options.add(option, 0);
    combo.options[0].value = "0";
    combo.options[0].innerText = "Escoja...";

    ListaAsignaturas.forEach((e, i) => {
        var option = document.createElement("option");
        combo.options.add(option, i + 1);
        combo.options[i + 1].value = e.codigo;
        combo.options[i + 1].innerText = e.asignatura;
    });
}


function limpiarFormularioCompletamente() {
    FormularioNotaUI['estudiante'].disabled = false;
    FormularioNotaUI['asignatura'].disabled = false;
    FormularioNotaUI['agregarNotaBoton'].disabled = false;
    FormularioNotaUI.reset();
    listaNotasCorte1TEMP = [];
    porcentajeCorte1TEMP = parseInt(0);
    listaNotasCorte2TEMP = [];
    porcentajeCorte2TEMP = parseInt(0);
    listaNotasCorte3TEMP = [];
    porcentajeCorte3TEMP = parseInt(0);
    ListaNotasCorte1UI.innerHTML = '';
    ListaNotasCorte2UI.innerHTML = '';
    ListaNotasCorte3UI.innerHTML = '';
    document.getElementById('cerrarCalificacion').disabled = false;
}

function deshabilitarSelects() {
    if (porcentajeCorte1TEMP != 100) {
        FormularioNotaUI['estudiante'].disabled = true;
        FormularioNotaUI['asignatura'].disabled = true;
        FormularioNotaUI['agregarNotaBoton'].disabled = false;
    } else {
        if (porcentajeCorte3TEMP != 100) {
            FormularioNotaUI['estudiante'].disabled = true;
            FormularioNotaUI['asignatura'].disabled = true;
            FormularioNotaUI['agregarNotaBoton'].disabled = false;
        } else {
            if ((porcentajeCorte2TEMP != 100)) {
                FormularioNotaUI['estudiante'].disabled = true;
                FormularioNotaUI['asignatura'].disabled = true;
                FormularioNotaUI['agregarNotaBoton'].disabled = false;
            } else {
                FormularioNotaUI['agregarNotaBoton'].disabled = true;
            }
        }
    }
}

function validarIngreso(estudianteCodigo, asignaturaCodigo, descripcion, nota, porcentaje) {
    if (estudianteCodigo == 0) {
        return false;
    }
    if (asignaturaCodigo == 0) {
        return false;
    }
    if (descripcion === "") {
        return false;
    }
    if (nota === "") {
        return false;
    }
    if (porcentaje === "") {
        return false;
    }
    return true;
}
function validarNota(nota) {
    if (nota > 5) {
        return false;
    }
    if (nota < 0) {
        return false;
    }
    return true;
}

function validarPorcentaje(porcentaje, corte) {
    if (porcentaje > 0) {
        if (corte === "1") {
            porcentajeCorte1TEMP += porcentaje;
            if (porcentajeCorte1TEMP > 100) {
                porcentajeCorte1TEMP -= porcentaje;
                return false;
            }
        }
        if (corte === "2") {
            porcentajeCorte2TEMP += porcentaje;
            if (porcentajeCorte2TEMP > 100) {
                porcentajeCorte2TEMP -= porcentaje;
                return false;
            }
        }
        if (corte === "3") {
            porcentajeCorte3TEMP += porcentaje;
            if (porcentajeCorte3TEMP > 100) {
                porcentajeCorte3TEMP -= porcentaje;
                return false;
            }
        }
    } else {
        if (corte === "1") {
            if (porcentajeCorte1TEMP < 100) {
                return false;
            }
        }
        if (corte === "2") {
            if (porcentajeCorte2TEMP < 100) {
                return false;
            }
        }
        if (corte === "3") {
            if (porcentajeCorte3TEMP < 100) {
                return false;
            }
        }
    }

    return true;
}

function calculoDefinitivaCorte(listaCorte) {
    let definitivaTemp = 0;
    listaCorte.forEach(e => {
        definitivaTemp += e.nota * (e.porcentaje / 100);
    })
    return definitivaTemp;
}

//#endregion

//#region Datos
function llenarListaDatosUI() {
    consultarCalificaciones();
    let listaDatos = mapearCalificacion();
    ListaDatosUI.innerHTML = '';

    if (listaDatos === null) {
        listaDatos = [];
    } else {
        listaDatos.forEach(e => {
            let estudianteNombre = ListaEstudiantes[ListaEstudiantes.findIndex(e2 => e2.codigo === e.estudiante)].nombre;
            let asignaturaNombre = ListaAsignaturas[ListaAsignaturas.findIndex(e2 => e2.codigo === e.asignatura)].asignatura;
            ListaDatosUI.innerHTML += `<tr>
            <th scope="row">1</th>
            <td>${estudianteNombre}</td>
            <td>${asignaturaNombre}</td>
            <td>${e.corte1}</td>
            <td>${e.corte2}</td>
            <td>${e.corte2}</td>
            <td>${e.definitiva}</td>
            <td>
                <button type="button" id="${e.index}" class="btn btn-success btn-sm" onclick="editarCalificaciones(this.id)">
                    <i class="material-icons">
                        edit
                    </i>
                </button>
                <button type="button" id="${e.index}" class="btn btn-danger btn-sm" onclick="eliminarCalificaciones(this.id)">
                    <i class="material-icons">
                        delete
                    </i>
                </button>
            </td>
        </tr>`
        });
    }
}

function editarCalificaciones(index) {
    limpiarFormularioCompletamente();
    mapearCortes(index);
    document.getElementById('cerrarCalificacion').disabled = true;
    ListaCalificaciones.splice(index, 1);
    $('#calificarEstudiante').modal('show');
    llenarListaNotasUI();
}

function eliminarCalificaciones(index) {
    ListaCalificaciones.splice(index, 1);
    guardarCalificaciónDB();
}

function mapearCalificacion() {
    let listaDatos = [];
    if (ListaCalificaciones != null){
    ListaCalificaciones.forEach((e,index) => {
        let item = {
            index: index,
            estudiante: e.estudiante,
            asignatura: e.asignatura,
            corte1: e.cortes[0].definitiva,
            corte2: e.cortes[1].definitiva,
            corte2: e.cortes[2].definitiva,
            definitiva: e.definitiva
        }
        listaDatos.push(item);
    })
    }else{ ListaCalificaciones = []}
    return listaDatos;
}


//#endregion

(function (console) {

    console.save = function (data, filename) {

        if (!data) {
            console.error('Console.save: No data')
            return;
        }

        if (!filename) return false;

        if (typeof data === "object") {
            data = JSON.stringify(data, undefined)
        }

        var blob = new Blob([data], { type: 'text/json' }),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)

// EventListener

document.addEventListener('DOMContentLoaded', llenarListaAsignaturasUI);
document.addEventListener('DOMContentLoaded', llenarListaEstudiantesUI);
document.addEventListener('DOMContentLoaded', llenarListaDatosUI);

document.addEventListener('DOMContentLoaded', cargarEstudiantesEnSelect);
document.addEventListener('DOMContentLoaded', cargarAsignaturasEnSelect);


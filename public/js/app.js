var students ={};
var jAlumnos = {};
$(document).ready(function () {
    $(".dropdown-trigger").dropdown();
    $('.datepicker').datepicker({ format: 'yyyy-mm-dd' });
    $('.modal').modal();
    $('.sidenav').sidenav();
    initAlumnos();

});

function initAlumnos() {
    var name;
    fetch('/alumnos', { method: 'GET' }).then((response) => {
        response.json().then((data) => {
            if (data.error)
                return data.error;
            data.forEach(alumno => {
                name = alumno.nombre+' '+alumno.a_Paterno+' '+alumno.a_Materno
                jAlumnos[name] = null;
                students[alumno._id] = name;
            });
        });
    });
}

function createChips(init=[]) {

    $('.chips-autocomplete').chips({
        data:init,
        autocompleteOptions: {
            data: jAlumnos,
            limit: Infinity,
            minLength: 1
        }
    });
}

function getBrothers(){
    var brothers = [];
    var names = [];
    const chips =document.getElementsByClassName('chip');

    Array.prototype.forEach.call(chips,chip =>{
        nombre = chip.firstChild.data;
        names.push(nombre);
    })
    $.each(students,(id,nombre)=>{
      if (names.includes(nombre))
        brothers.push(id);
    });
    return brothers;
}

function getChips(brothers = []) {
    chips = [];
    $.each(students, (index, value) => {
        if (brothers.includes(index))
            chips.push({ tag: value });
    })
    return chips;
}





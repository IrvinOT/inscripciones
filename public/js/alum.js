
var _id = 0;
$(document).ready(function () {
    var isCreate = true;
    const fAlumno = $('#formAlum');
    const iNombre = $('#nombre');
    const iPaterno = $('#aPaterno');
    const iMaterno = $('#aMaterno');
    // const iFechaNacimiento = $('#fechaNacimiento');
    // const iTutor = $('#tutor');
    const iGrupo = $('#grupo');
    const bAgregar = $('#btnAgregar');
    const bAddAlum = $('#addAlum');
    const bDelete = $('#btnDelete')

    createChips();
    
    fAlumno.submit((event) => {
        event.preventDefault();
    });

    bAgregar.click(() => {
        if (isCreate) {
            add();
        } else {
            update(_id);
        }
    });
    
    bDelete.click(() => {
        actionBtnDelete(_id);
    });

    bAddAlum.click(() => {
        createChips();
        clean();
        isCreate = true;
        bAgregar.html('Agregar');
        bDelete.hide();
    });
    $.each($('.edit'), (index, value) => {
        value.addEventListener('click', () => {
            isCreate = false;
            _id = value.id;
            setUser(_id);
            bDelete.show();
            bAgregar.html('Actualizar');
        })
    });
    function add() {
        var data = getJson();
        $.ajax({
            type: 'POST',
            data,
            contentType: 'application/json',
            url: '/alumno',
            success: (data) => {
                succesAction('registrado');
            },
            er
        });
    }

    function update(id) {
        const data = getJson();
        const url = `/alumno/${id}`
        $.ajax({
            type: 'PATCH',
            data,
            contentType: 'application/json',
            url,
            success: (res) => {
                succesAction('actualizado');
            }
        });
    }

    function actionBtnDelete(id) {

        var nombre = "";
        $.each(students, (alumnoId, alumnoNombre) => {
            if (alumnoId.localeCompare(id) == 0) {
                nombre = alumnoNombre
                return alumnoNombre
            }
        });
        $.confirm({
            title: "Eliminar",
            content: `Desea eliminar a ${nombre}`,
            buttons: {
                Eliminar: {
                    text: 'Eliminar',
                    btnClass: 'btn-error red',
                    action: () => {
                        remove(id);
                    }
                },
                cancelar: () => {
                    $('#modal1').modal('close');
                }
            }
        });
    }

    function remove(id) {
        const url = `/alumno/${id}`;
        $.ajax({
            type: 'DELETE',
            contentType: 'application/json',
            url,
            success: (res) => {
                succesAction('eliminado');
            }
        });
    }

    function succesAction(message) {
        $.alert({
            title: 'Completado',
            content: `El alumno ha sido ${message} con exito`,
            buttons: {
                ok: () => {
                    console.log('ello')
                    $('#modal1').modal('close');
                    location.reload();
                }
            }
        });

    }

    function getJson() {
        var data = {
            nombre: iNombre.val(),
            a_Paterno: iPaterno.val(),
            a_Materno: iMaterno.val(),
            // fecha_Nacimiento: iFechaNacimiento.val(),
            // tutor: [iTutor.val()],
            hermano: getBrothers(),
            grupo: iGrupo.val()
        }
        return JSON.stringify(data);
    }

    function clean() {
        $.each($('input'), (index, value) => {
            value.value = null;
        });
        while (document.getElementsByClassName('chip').length > 0) {
            $('.chips').chips('deleteChip');
        }
    }

    function setUser(id) {
        var hermanos;
        var fechaNacimiento;
        $.get(`/alumno/${id}`, (data, status) => {
            fechaNacimiento = (data.fecha_Nacimiento) ? data.fecha_Nacimiento.split('T')[0] : null;
            hermanos = getChips(data.hermano);

            iNombre.val(data.nombre);
            iPaterno.val(data.a_Paterno);
            iMaterno.val(data.a_Materno);
            // iFechaNacimiento.val(fechaNacimiento || "");
            // iTutor.val(data.tutor[0] || "");
            iGrupo.val(data.grupo || "");

            createChips(hermanos);
        });
    }

});




var idPago = 0;
var ref = "";
$(document).ready(function () {
    var isCreate = true;
    var canRemoveChip = true;
    createChips();
    createInitialChips();
    setDate();
    const fPago = $('#formPago');
    const iFolio = $('#folio');
    const iAportacion = $('#aportacion');
    const iFecha = $('#fecha');
    const iNota = $('#nota');
    const bAgregar = $('#btnAgregar');
    const bAddPay = $('#addPay');
    const bDelete = $('#btnDelete');

    bAgregar.click(() => {

        if (isCreate) {
            getBrothers().forEach(_id => {
                add(_id)
            });
        } else {
            update(idPago, getAlumno());
            updatePagoBrothers();
        }

    });

    bDelete.click(() => {
        actionBtnDelete();
    });

    bAddPay.click(() => {
        clean();
        isCreate = true;
        bAgregar.html('Agregar');
        bDelete.hide();
    });

    $.each($('.edit'), (index, value) => {
        value.addEventListener('click', () => {
            isCreate = false;
            idPago = value.id;
            setPay(idPago);
            bAgregar.html('Actualizar');
            bDelete.show();
        })
    });

    function createInitialChips(init = {}) {
        $('.chips-initial').chips({
            data: init,
            limit: 1,
            autocompleteOptions: {
                data: jAlumnos,
                limit: Infinity,
                minLength: 1
            },
            onChipAdd: () => {
                _id = getAlumno();
                setBrothers(_id);
            },
            onChipDelete: () => clean()
        });
    }

    function add(_id) {
        var data = getJson(_id);
        $.ajax({
            type: 'POST',
            data,
            contentType: 'application/json',
            url: '/pago',
            success: (data) => {
                succesAction('registrado')
            }
        });
    }

    function update(_id, alumno) {
        const data = getJson(alumno);
        const url = `/pago/${_id}`;
        $.ajax({
            type: 'PATCH',
            data,
            contentType: 'application/json',
            url,
            success: (res) => {
                succesAction('actualizado')
            }
        });
    }
    function actionBtnDelete() {
        var idAlumno = getAlumno();
        var nombre = "";
        $.each(students, (alumnoId, alumnoNombre) => {
            if (alumnoId.localeCompare(idAlumno) == 0) {
                nombre = alumnoNombre
                return alumnoNombre
            }
        });
        $('#modal1').modal('close');
        $.confirm({
            title: "Eliminar",
            content: `<from class="col s12 formName">
                        <div class="row">
                            <div class="input-field col s5 ">
                                <label>Desea elimina el pago de ${nombre}</label>
                                <input placeholder="Razon" id="nota" type="text" class="validate " required/>
                            </div>
                        </div>
                    </from>`,
            buttons: {
                Eliminar: {
                    text: 'Eliminar',
                    btnClass: 'btn-error red',
                    action: () => {
                        remove(idPago);
                        
                    }
                },
                cancelar: () => {
                    $('#modal1').modal('close');
                }
            },
            onContentReady: function () {
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click');
                });
            }
        });
    }

    function updatePagoBrothers() {
        var brothers = getBrothers();
        brothers.shift();
        brothers.forEach(id => {
            const url = `/pago/hermanos/${id}&${ref}`
            $.get(url, (data, status) => {
                var result = data[0]
                update(result._id, result.alumno);
            });
        })
    }

    function remove(_id) {
        const url = `/pago/${_id}`;
        const data = {nota:$('#nota').val()}
        const jData = JSON.stringify(data)
        $.ajax({
            type: 'PATCH',
            data:jData,
            contentType: 'application/json',
            url,
            success: (res) => {
                succesAction('desabilitado');
            }
        });
    }

    function getJson(_id) {
        var data = {
            alumno: _id,
            referencia: iFolio.val(),
            aportacion: iAportacion.val(),
            fecha: iFecha.val(),
            nota: iNota.val()
        }
        return JSON.stringify(data);
    }

    function setBrothers(id) {
        $.get(`/alumno/${id}`, (data, status) => {
            hermanos = getChips(data.hermano);
            createChips(hermanos);
        });
    }

    function getAlumno() {
        var _id = getBrothers()[0];
        return _id;
    }

    function clean() {
        //El orden de los factores altera el producto :'v 
        if (canRemoveChip) {
            canRemoveChip = false;
            $.each($('input'), (index, value) => {
                value.value = null;
            });
            while (document.getElementsByClassName('chip').length > 0) {
                $('.chips').chips('deleteChip');
            }
        }
        canRemoveChip = true;
    }

    function succesAction(message) {
        $.alert({
            title: 'Completado',
            content: `El pago ha sido ${message} con exito`,
            buttons: {
                ok: () => {
                    $('#modal1').modal('close');
                    location.reload();
                }
            }
        });
    }

    function setDate() {
        $.each($('.date'), (index, value) => {
            var date = value.firstChild.data.split(' ');
            var newDate = date[2] + '-' + date[1] + '-' + date[3];
            value.innerHTML = newDate;
        });
    }

    function setPay(id) {
        var fecha;
        $.get(`/pago/${id}`, (data, status) => {
            fecha = (data.fecha) ? data.fecha.split('T')[0] : null

            iFolio.val(data.referencia);
            iAportacion.val(data.aportacion.$numberDecimal);
            iFecha.val(fecha || "");
            createInitialChips([{ tag: data.nombre }]);
            setBrothers(data.alumno);
        });
        ref = iFolio.val();
    }
});
$(document).ready(function () {
    const fLogIn = $('#fLogIn');
    const iEmail = $('#email');
    const iPass = $('#password');
    const dError = document.getElementById('dError');
    const bAceptar = $('#aceptar');

    // bAceptar.click(()=>{
    //     Log();
    // });

    // fLogIn.submit((event)=>{
    //     event.preventDefault();
    // })
    function Log() {
        var data = getJson();
        $.ajax({
            type: 'POST',
            data,
            contentType: 'application/json',
            url: '/user/login',
            success: (response) => {
                console.log('response: ')
                console.log(response)
                //window.location = '/'
            },
            error:(err)=>{
                console.log('Error: ')
                console.log(err.status);
                if(err.status == 404)
                    dError.innerHTML ="Email o contraseña incorrectos </br>";
            }
        });
    }

    function getJson() {
        var data = {
            email: iEmail.val(),
            password:iPass.val()
        }
        return JSON.stringify(data);
    }
});
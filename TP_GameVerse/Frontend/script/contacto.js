/*----Variables----*/

const inputs = document.querySelectorAll(".input")
const form = document.getElementById("formulario-contacto")
const popup = document.getElementById("exitoPopup")
const placeholders = [];
let mensajeMostrado = false

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const form_data = new FormData(form);
    const nombre = form_data.get("nombre");
    const apellido = form_data.get("apellido");
    const email = form_data.get("email");
    const mensaje = form_data.get("mensaje");
    const campos = [nombre, apellido, mensaje];
    const camposCompletos = validarCampos(campos,email);
    if (!camposCompletos) 
    {   
        if(!mensajeMostrado){
            mensajeMostrado = true;
        }
    }
    else {
        fetch("https://jayp201091.pythonanywhere.com/mensajes",
            {
                method: "POST",
                body: form_data
            }).then((respuesta) => {
                if (respuesta.ok) {
                    respuesta.json().then((data) => {
                        popup.children[0].textContent = data.mensaje
                        popup.style.visibility = "visible"
                        form.style.visibility = "hidden"
                        setTimeout(() => {
                            form.reset()
                            popup.style.visibility = "hidden"
                            form.style.visibility = "visible"
                        }, 2000)
                    })
                }
                else {
                    respuesta.json().then((data) => {
                        popup.children[0].textContent = data.mensaje
                        popup.style.visibility = "visible"
                        form.style.visibility = "hidden"
                        setTimeout(() => {
                            form.reset()
                            popup.style.visibility = "hidden"
                            form.style.visibility = "visible"
                        }, 2000)

                    })
                }
            }).catch((e) => {
                console.log(e)
            })
    }
    mensajeMostrado = false;
})

// Función para validar la dirección de correo electrónico
function validarEmail(email) {
    // Expresión regular para validar el formato del correo electrónico
    const regex = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function validarCampos(campos,email) {
    let camposCompletos = true;
    campos.forEach((campo) => {
        if (campo.trim() === "") {
            camposCompletos = false;
        }
    });

    const mailValido = validarEmail(email)
    
    if (!camposCompletos) {
        alert("Faltan completar campos")
        return false
    }
    else if(!mailValido) {
       alert ("Parece que la direccion de correo es inválida")
       return false
    }
    else{
        return true
    }
}

/* Focus In out Form */
const focusIn = () => {
    for (let i = 0; i < inputs.length; i++)
        inputs[i].addEventListener("focusin", () => {
            placeholders[i] = inputs[i].getAttribute("placeholder");
            inputs[i].setAttribute("placeholder", "");
            inputs[i].style.backgroundColor = "#555";
            inputs[i].style.color = "#fff";
            inputs[i].style.outline = "none";
            inputs[i].style.borderBottom = "2px solid #e5b2ca";
        })
}

const focusOut = () => {
    for (let i = 0; i < inputs.length; i++)
        inputs[i].addEventListener("focusout", () => {
            inputs[i].setAttribute("placeholder", placeholders[i]);
            inputs[i].style.backgroundColor = "transparent";
            inputs[i].style.color = "#fff";
            inputs[i].style.border = "none";
            inputs[i].style.magin = "10px 10px";
            inputs[i].style.padding = "10px";
        })
}

setTimeout(focusIn, 10);
setTimeout(focusOut, 10);


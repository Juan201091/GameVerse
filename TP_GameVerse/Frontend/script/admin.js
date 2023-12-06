document.getElementById('btnTraerMensajes').addEventListener('click', () => {
    fetch('https://jayp201091.pythonanywhere.com/mensajes')
        .then((response) => {
            if (response.ok) {
                return response.json(); // Devuelve una promesa con los datos JSON
            } else {
                return response.json().then((e) => {
                    console.log(e.mensaje)
                    throw new Error(e.mensaje);
                })
            }
        })
        .then((datos) => {
            const tablaBody = document.querySelector('#tablaMensajes tbody');
            tablaBody.innerHTML = ''; // Limpiar tabla antes de agregar nuevos datos
            console.log("datos", datos); // Trabaja con los datos obtenidos
            datos.forEach(dato => {
                fecha_formateada = convertir_Fecha(dato.Fecha_envio)
                const fila = document.createElement('tr');
                fila.innerHTML = `
                      <td>${dato.IdMensajes}</td>
                      <td>${dato.Nombre}</td>
                      <td>${dato.Apellido}</td>
                      <td>${dato.Email}</td>
                      <td>${fecha_formateada}</td>
                      <td>${dato.Mensaje}</td>
                      <td>${dato.Leido}</td>
                      <td><button style="border-radius: 10px; padding:8px; background-Color: #48fe; color : #fff" onclick="eliminarMensaje(${dato.IdMensajes},this.parentElement.parentElement)">Eliminar</button></td>
                    `;
                tablaBody.appendChild(fila);
            });
        })
        .catch((error) => {
        });
});

document.getElementById('formularioContacto').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const id = document.getElementById('idInput');
    const gestion = document.getElementById('detalleInput');
    const formData = new FormData();
    formData.append('gestion', gestion.value);

    fetch(`https://jayp201091.pythonanywhere.com/mensajes/${id.value}`, {
        method: 'PUT',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            id.value = ""
            gestion.value = ""
            console.log('Respuesta del servidor:', data.mensaje);
        })
        .catch((error) => {
            console.error('Error al enviar los datos:', error);
        });
});

// Variables

document.getElementById("btnTraerMensaje").addEventListener("click", () => {
    const input= document.getElementById("id_mensaje")

    fetch(`https://jayp201091.pythonanywhere.com/mensajes/busqueda/${input.value}`)
        .then((respuesta) => {
            if (respuesta.status) {
                return respuesta.json()
            }
            else {
                return respuesta.json().then(() => {
                    throw new Error("El mensaje no existe")
                })
            }
        }).then((dato) => {
            const tablaBody = document.querySelector('#tablaMensajes tbody');
            tablaBody.innerHTML = '';
            const fila = document.createElement('tr');
            fecha_formateada = convertir_Fecha(dato.Fecha_envio)
            fila.innerHTML = `
                      <td>${dato.IdMensajes}</td>
                      <td>${dato.Nombre}</td>
                      <td>${dato.Apellido}</td>
                      <td>${dato.Email}</td>
                      <td>${fecha_formateada}</td>
                      <td>${dato.Mensaje}</td>
                      <td>${dato.Leido}</td>
                      <td><button style="border-radius: 10px; padding:8px; background-Color: #48fe; color : #fff" onclick="eliminarMensaje(${dato.IdMensajes},this.parentElement.parentElement)">Eliminar</button></td>
                    `;
            tablaBody.appendChild(fila);
            input.value = ""
        })
        .catch((error) => {
            console.error('Error:', error); // Manejo de errores
        });
})
// *****FUNCIONES******

//PopUp mensaje
const eliminarMensaje = (idMensaje, fila) => {
    fetch(`https://jayp201091.pythonanywhere.com/mensajes/delete/${idMensaje}`, {
        method: 'DELETE',
    }).then((respuesta) => {
        if (respuesta.status) {
            return respuesta.json()
        } else {
            return respuesta.json().then(() => {
                throw new Error("El mensaje no existe")
            })
        }
    }).then((informacion) => {
        fila.remove()
        console.log(informacion)
    }).catch((e) => {
        console.log(e)
    })
}
// visualizacion de fecha

function convertir_Fecha(fecha) {
    fecha_actual = new Date(fecha)
    dia = fecha_actual.getDate();
    mes = fecha_actual.getMonth() + 1; // Sumar 1 para que los meses estén en el rango 1-12
    año = fecha_actual.getFullYear();
    fecha_formateada = `${dia}-${mes}-${año}`
    return fecha_formateada
}


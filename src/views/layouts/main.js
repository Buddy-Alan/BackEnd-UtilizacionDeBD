const socketClient = io();
let user
Swal.fire({
    title: "Hola usuario",
    text: "Bienvenido, ingresa su email",
    input: "text",
    allowOutsideClick: false
}).then(respuesta => {
    const validarMail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    console.log
    if (validarMail.test(respuesta.value)) {
        user = respuesta.value
    } else {
        Swal.fire({ title: "Por favor, ingrese su email" }).
        then(respuesta => {
            window.location.reload()
        })
    }
})

//Variables Creadas para tomar datos del form y enviarlos
const formEnvioMsjs = document.getElementById("form")
const titleForm = document.getElementById("title")
const priceForm = document.getElementById("price")
const thumbnail = document.getElementById("thumbnail")

//Variables Creadas para tomar datos del chat y enviarlos
const contenedorDeMensajes = document.getElementById("messageContainer")
const actualizarProductos = document.getElementById("actualizarProductos")
const campo = document.getElementById("inputMensajes")


//Evento para enviar los datos del form
formEnvioMsjs.addEventListener("keydown", (evn) => {
    if (evn.key == "Enter") {
        if (titleForm.value == "" || thumbnail.value == "" || priceForm.value == "") {
            Swal.fire({
                title: "Porfavor completo los datos correcamente",
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            const nuevoProducto = {
                title: titleForm.value,
                price: priceForm.value,
                thumbnail: thumbnail.value
            }
            socketClient.emit("envioProducto", nuevoProducto)

            titleForm.value = ""
            priceForm.value = ""
            thumbnail.value = ""
        }
    }
})


//Evento para enviar los datos del chat
campo.addEventListener("keydown", (evn) => {
    if (evn.key == "Enter") {
        if (campo.value != "") {
            socketClient.emit("envioMensajesFront", {
                userName: user,
                message: campo.value
            })
        }
        campo.value = ""
    }
})


//Renderiza todo el chat con websocket
socketClient.on("todosLosMensajes", datosRecibidos => {
        let elementoMensajes = "";
        console.log(datosRecibidos)
        datosRecibidos.forEach(element => {
            elementoMensajes = elementoMensajes + `<p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">${element.userName} : ${element.message}</p>`
        });
        contenedorDeMensajes.innerHTML = elementoMensajes;
    }

)


//Renderiza los productos con websocket
socketClient.on("todosLosProductos", productosRecibidos => {
    console.log(productosRecibidos)
    let renderizadoDeProductos = "";
    productosRecibidos.forEach(productos => {
        renderizadoDeProductos = renderizadoDeProductos + `
    <tr>
        <th scope="row">${productos.id}</th>
        <td>${productos.title}</td>
        <td>${productos.price}</td>
        <td>
        <img src=${productos.thumbnail} alt="img" width="25">
        </td>
    </tr>
    `
        actualizarProductos.innerHTML = renderizadoDeProductos
    })
})
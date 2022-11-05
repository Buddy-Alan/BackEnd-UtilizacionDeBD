const express = require("express");
const handlebars = require("express-handlebars")
const productRouter = require("./src/routes/rutasProductos");
const { Server } = require("socket.io")
const ChatSqLite = require("./peticionBD/dbSqLite")
const ContenedorMySql = require("./peticionBD/bdMySql")
const dbmysql = require("./config/dbConfig")
const dbSqLite = require("./config/dbConfig")
const claseChats = new ChatSqLite(dbSqLite.sqLiteDB, "chat")
const contenedorProducts = new ContenedorMySql(dbmysql.MySql, "productos")
const PORT = process.env.PORT || 8081
const app = express()
const server = app.listen(PORT, () => { console.log(`Server ejecutado en puerto: ${PORT}`) });



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", handlebars.engine());

app.set("views", "./src/views")

app.set("view engine", "handlebars")

app.use("/", productRouter)


const io = new Server(server);

app.use(express.static(__dirname + "/src/views/layouts"))


io.on("connection", async(socket) => {
    try {
        const historicoDelChat = await claseChats.obtenerMensajes()
        socket.on("envioProducto", async(datoRecibido) => {
            try {
                await contenedorProducts.save(datoRecibido)
                actualizarProductos = await contenedorProducts.getAll()
                socket.emit("todosLosProductos", actualizarProductos)
            } catch (error) {
                res.status(500).send("Hubo un error en el Servidor")
            }
        })
        socket.broadcast.emit("newUser", socket.id)
        if (historicoDelChat) {
            socket.emit("todosLosMensajes", historicoDelChat)
        }
        socket.on("envioMensajesFront", async(datoCliente) => {
            try {
                await claseChats.agregarMensaje(datoCliente)
                const chatActivos = await claseChats.obtenerMensajes()
                io.sockets.emit("todosLosMensajes", chatActivos)
            } catch (error) {
                console.log(error)
            }
        })
    } catch (error) {
        console.log(error)
    }
})
const knex = require("knex")



class Chat {
    constructor(conecction, tableName) {
        this.database = knex(conecction)
        this.table = tableName
    }

    agregarMensaje = async(newMsj) => {

        //Se realiza un if para filtrar productos ya cargados, con el fin de que no se repitan datos
        try {
            await this.database.from(this.table).insert(newMsj)
            console.log("Mensaje agregado con exito guardado")
        } catch (error) {
            console.log(error)
        }
    }



    obtenerMensajes = async() => {
        try {
            const result = await this.database.from(this.table).select("*");
            const mensajes = result.map(elm => ({...elm }));
            return mensajes
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = Chat
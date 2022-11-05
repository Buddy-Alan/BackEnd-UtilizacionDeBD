const knex = require("knex")

class ContenedorMySql {
    constructor(conecction, tableName) {
        this.database = knex(conecction)
        this.table = tableName
    }

    save = async(productoAAgregar) => {
        //Se realiza un if para filtrar productos ya cargados, con el fin de que no se repitan datos
        try {
            const productos = await this.getAll()
            const existe = productos.some(item => item.title === productoAAgregar.title)
            if (existe) {
                return false
            } else {
                await this.database.from(this.table).insert(productoAAgregar)
                console.log("producto guardado")
            }
        } catch (error) {
            console.log(error)
        }
    }

    getAll = async() => {
        try {
            const result = await this.database.from(this.table).select("*");
            const prod = result.map(elm => ({...elm }));
            return prod
        } catch (error) {
            console.log(error)
        }
    }

    async getByID(id) {
        try {
            const producto = await this.database.from(this.table).where("id", id);
            if (producto == "") {
                return 1
            } else {
                return producto
            }
        } catch (error) {
            console.log(error)
        }
    }

    deletByID = async(id) => {
        try {
            const producto = await this.getByID(id)
            if (producto == 1) {
                return producto
            } else {
                await this.database.from(this.table).where("id", id).del();
                console.log(`Producto de id: ${id} eliminado`)
            }
        } catch (error) {
            console.log(error)
        }
    }


    updateById = async(id, body) => {
        try {
            const producto = await this.getByID(id)
            if (producto == 1) {
                return producto
            } else {
                await this.database.from(this.table).where("id", id).update({ price: body })
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ContenedorMySql
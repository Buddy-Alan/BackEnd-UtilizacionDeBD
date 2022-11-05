const conec = require("../config/dbConfig");
const knex = require("knex");

const dbSqlite = knex(conec.sqLiteDB)

const createTable = async() => {
    try {
        const tablaExist = await dbSqlite.schema.hasTable("chat");
        if (tablaExist) {
            await dbSqlite.schema.dropTable("chat")
        }
        await dbSqlite.schema.createTable("chat", table => {
            table.increments("id"),
                table.string("userName", 30).nullable(false),
                table.string("message", 200).nullable(false)
        })
        console.log("Tabla de chat creada correctamente")
        dbSqlite.destroy();
    } catch (error) {
        console.log(error)
    }
}

createTable();
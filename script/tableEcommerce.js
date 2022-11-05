// import { connectionMySql } from "../conecctions/mysql.js";
// import knex from "knex";
const conec = require("../config/dbConfig");
const knex = require("knex");

const dbMySql = knex(conec.MySql);


const createTable = async() => {
    try {
        const tablaExist = await dbMySql.schema.hasTable("productos");
        if (tablaExist) {
            await dbMySql.schema.dropTable("productos")
        }
        await dbMySql.schema.createTable("productos", table => {
            table.increments("id"),
                table.string("title", 15).nullable(false),
                table.float("price"),
                table.string("thumbnail", 250).nullable(false)
        })
        dbMySql.destroy();
        console.log("Tabla creada correctamente")
    } catch (error) {
        console.log(error)
    }
}

createTable();
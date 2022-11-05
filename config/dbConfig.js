const path = require("path")

const connection = {
    MySql: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            port: "8080",
            user: "root",
            password: "",
            database: "ecommerce"
        }
    },
    sqLiteDB: {
        client: "sqlite3",
        connection: {
            filename: path.join(__dirname, "../db/chatDB.sqlite")
        }
    }
}

module.exports = connection
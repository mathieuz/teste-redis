require("dotenv").config()

const { Sequelize } = require("sequelize")

const db = new Sequelize(process.env.NOME_BD, process.env.USUARIO, process.env.SENHA, {
    dialect: "mssql",
    host: process.env.HOST_BD,

    //Necessário para se conectar com o banco de dados (sem erro de socket hang up).
    dialectOptions: {
        options: {
            encrypt: false
        }
    }
})

module.exports = db
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

db.authenticate().then(() => {
    console.log("Conectado com sucesso!")

}).catch((err) => {
    console.log("Erro ao se conectar!\n" + err)

})

module.exports = db
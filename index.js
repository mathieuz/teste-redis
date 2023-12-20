require("dotenv").config()

const { createClient } = require("redis")
const redis = createClient()

const express = require("express")
const app = express()

const db = require("./db")

app.use(express.json())

app.get("/registros", async (req, res) => {
    //Verifica se os dados estão em cache, se não, retorna null.
    let resultado = await redis.get("registros")

    //Se o resultado não for null, os dados existem.
    if (resultado) {
        console.log("Registros recuperados do cache.")

    //Se não, os valores são recuperados do banco e armazenados em cache em seguida.
    } else {
        console.log("Os dados não estão em cache. Adicionando...")

        db.query("SELECT * FROM [dbo].[NodeRedCrudTeste];").then(async (registro) => {
            resultado = registro[0]
            await redis.set("registros", JSON.stringify(registro[0]))
        })
    }

    res.json(JSON.parse(resultado))
})

redis.connect().then(() => {
    app.listen(process.env.PORT, process.env.HOST, () => {
        console.log("'localhost:43534/registros'")
    })
})
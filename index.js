require("dotenv").config()

const { createClient } = require("redis")
const redis = createClient()

const express = require("express")
const app = express()

const db = require("./db")

app.use(express.json())

//Promise SELECT MSSQL - retorna a query com os registros em 5 segundos.
function getRegistros() {
    
    return new Promise(async (resolve) => {
        await db.query(`SELECT * FROM [dbo].[NodeRedCrudTeste];`).then((registros) => {
            let tempoRetorno = 5000

            setTimeout(() => {
                resolve(registros[0])
            }, tempoRetorno);
        })
    })

}

app.get("/registros", async (req, res) => {
    //Verifica se os dados estão em cache, se não, retorna null.
    let resultado = await redis.get("registros")

    //Se o resultado não for null, os dados existem.
    if (resultado) {
        console.log("Registros recuperados do cache.")

    //Se não, os valores são recuperados do banco e armazenados em cache em seguida.
    } else {
        console.log("Os dados não estão em cache. Adicionando...")
        resultado = await getRegistros()

        await redis.set("registros", JSON.stringify(resultado))
    }

    res.json(resultado)

})

redis.connect().then(() => {
    const PORT = process.env.PORT || 10789
    const HOST = process.env.HOST || "localhost"

    app.listen(PORT, HOST, () => {
        console.log(`${HOST}:${PORT}/registros`)
    })
})
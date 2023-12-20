require("dotenv").config()

const { createClient } = require("redis")
const redis = createClient()

const express = require("express")
const app = express()

app.use(express.json())

const retornaValores = () => {
    const tempoResponse = 5000

    //Objeto JavaScript a ser convertido em JSON.
    const obj = [
        {"chave1": "valor1"},
        {"chave2": "valor2"},
        {"chave3": "valor3"}
    ]

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(JSON.stringify(obj)) //Manda um JSON em string
        }, tempoResponse)
    })
}

app.get("/teste-redis", async (req, res) => {
    //Verifica se os valores estão em cache,
    let resultado = await redis.get("val")

    //Se existe, o valor a ser exibido é recuperado do cache.
    if (resultado) {
        console.log("Valores recuperados do cache.")

    //Se não, o valor é recuperado da promise para em seguida ser armazenada em cache.
    } else {
        console.log("Valor não existe em cache ainda. Adicionando...")

        resultado = await retornaValores()
        await redis.set("val", resultado)
    }

    //Retorna as informações em formato JSON
    res.json(JSON.parse(resultado))
})

redis.connect().then(() => {
    app.listen(process.env.PORT, process.env.HOST, () => {
        console.log("'localhost:43534/teste-redis'")
    })
})
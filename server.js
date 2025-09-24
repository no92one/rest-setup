// express - Används för att skapa ett rest-api.
import express from "express"
// mysql2/promise - Används för att kunna koppla upp sig till en MySQL-databas.  
import mysql from 'mysql2/promise';

// Skapa ett mysql-objekt med databas konfiguration.
const database = await mysql.createConnection({
    host: 'host',
    port: "port",
    user: 'user',
    password: 'password',
    database: 'database'
})

// Skapar ett express-objekt.
const app = express()
// Vilken port vi ska lägga servern på.
const port = 3000

// En middleware som låter oss hantera json-data i våra request.
app.use(express.json())

// Vår root-endpoint - gå till http://localhost:3000
app.get("/", (request, response) => {
    console.log("Du är på servern.")
    response.json({message: "Du kan prata med servern."})
})

// En annan endpoint - gå till http://localhost:3000/endpoint2
app.get("/endpoint2", async (request, response) => {
    console.log("Jag är endpoint2.")
    response.json({
        message: "Du kom åt endpoint2."
    })
})

// En endpoint som hämtar data från product-tabellen i databasen - gå till http://localhost:3000/products
app.get("/products", async (request, response) => {
    const [result] = await database.execute("SELECT * FROM product")
    console.log(result)
    return response.json(result)
})

// En endpoint lägger till en ny produkt i product-tabellen - I Postman, POST - http://localhost:3000/products
app.post("/products", async (request, response) => {
    const {name, price} = request.body

    try {
        const [result] = await database.execute("INSERT INTO product (name, price) VALUES (?, ?)",
            [name, price])
        
        console.log(result)
        return response.status(201).json(result)
    } catch (error) {
        console.log(error)
        return response.status(409).json({message: "Server error."})
    }
})

// Startar servern när vi kör server.js-filen.
app.listen(port, () => { console.log(`http://localhost:${port}`)})

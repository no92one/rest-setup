// express - Används för att skapa ett rest-api.
import express from "express"
// pg-promise - Används för att kunna koppla upp sig till en PostgreSQL-databas.  
import pgPromise from "pg-promise"

// Databas konfiguration.
const connection = {
    host: "localhost",
    user: "postgres",
    password: "abc123",
    port: 5432,
    database: "rest-setup"
} 

// Skapa ett pgPromise-objekt.
const pg = pgPromise()

// Använder databas konfigurationen och försöker kopplar upp oss till databasen. 
// "-c search_path=public" - Ser till att vi kör query's mot public-schemat i databasen.
const database = pg({
    ...connection,
  options: "-c search_path=public"
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
    const result = await database.any("SELECT * FROM product")
    console.log(result)
    return response.json(result)
})

// En endpoint lägger till en ny produkt i product-tabellen - I Postman, POST - http://localhost:3000/products
app.post("/products", async (request, response) => {
    const {name, price} = request.body

    try {
        const result = await database.result("INSERT INTO product (name, price) VALUES ($1, $2)",
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

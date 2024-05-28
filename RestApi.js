// PUNTO 4: REST API QUE RECIBE LA TEMPERARTURA QUE ENVIA EL WEBHOOK Y LA ALMACENA EN LA BASE DE DATOS¿
const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");

const env = process.env;
const PORT = env.PORT4;
const URL = `http://localhost:${PORT}`;

const app = express();
app.use(cors());
app.use(express.json());

// Conexion a la base de datos
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Creacion de las tabla
(async () => {
  const client = await pool.connect();
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS temperatura (
        tem_id SERIAL PRIMARY KEY,
        tem_timespan TIMESTAMP ,
        tem_grados INT NOT NULL
    );`);
    //
    // Falta la de usuario para el login con JWT
    //
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
})();

//
// FALTA AGREGAR LA AUTENTICACION CON JWT.....
//
app.post("/db/temperatura", async (req, res) => {
  //Recibe la temp del webhook.js
  const temperatura = req.body.temp;
  const timespan = new Date();

  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO temperatura (tem_timespan, tem_grados) VALUES ($1, $2)",
      [timespan, temperatura]
    );
    res.send("Temperatura guardada con exito");
    console.log("Temperatura guardada con exito");
  } catch (error) {
    console.log(error);
    res.send(error);
  } finally {
    client.release(); // Cierra conexión
  }
});

//GET DE LAS TEMPERATURAS
app.get("/temperatura", async (req, res) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(
      "SELECT * FROM temperatura ORDER BY tem_id DESC LIMIT 10"
    );
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor RestApi levantado en ${URL}`);
});
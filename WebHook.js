// PUNTO 3: WEBHOOK QUE RECIBE LA TEMPERATURA DEL INDEX Y LA ENVIA A RESTAPI
const axios = require("axios");
const express = require("express");
const http = require("http");
require("dotenv").config();
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");

const PORT4 = process.env.PORT4; // RestApi - insert base de datos
const PORT3 = process.env.PORT3; // webhook
const URL = `http://localhost:${PORT3}`;
const JWT_SECRET = process.env.JWT_SECRET;
const user = process.env.user;


const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET);
};


const API_TOKEN = generateToken(user); 

const server = http.createServer(app);

app.post("/temperatura", async (req, res) => {
  // Recibe la temperatura del index.js
  const temp = req.body.temp;
  try {
    // console.log(API_TOKEN)
    // Envia la temperatura a la RestApi con el token en el encabezado de autorización
    await axios.post(
      `http://localhost:${PORT4}/db/temperatura`,
      {
        temp: temp,
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );
    res.send("Temperatura enviada al ApiRest"); // Responde al index.js
  } catch (error) {
    console.error("Error al enviar la temperatura a RestApi:", error);
    res.send(error);
  }
});
server.listen(PORT3, () => {
  console.log(`Webhook corriendo en ${URL}`);
});

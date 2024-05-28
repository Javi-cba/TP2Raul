// PUNTO 3: WEBHOOK QUE RECIBE LA TEMPERATURA DEL INDEX Y LA ENVIA A RESTAPI
const axios = require("axios");
const express = require("express");
const http = require("http");
require("dotenv").config();
const app = express();
app.use(express.json());

const PORT4 = process.env.PORT4; // RestApi - insert base de datos
const PORT3 = process.env.PORT3; // webhook
const URL = `http://localhost:${PORT3}`;

const server = http.createServer(app);

app.post("/temperatura", async (req, res) => {
  //Recibe la temp del index.js
  const temp = req.body.temp;
  try {
    //ENIVIA LA TEMPERATURA A RESTAPI
    await axios.post(`http://localhost:${PORT4}/db/temperatura`, {
      temp: temp,
    });
    res.send("Temperatura enviada al ApiRest"); // Responde al index.js
  } catch (error) {
    console.error("Error al enviar la temperatura a RestApi:", error);
    res.send(error);
  }
});

server.listen(PORT3, () => {
  console.log(`Webhook corriendo en ${URL}`);
});

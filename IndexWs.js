// PUNTO 2: WS SERVER QUE RECIBE TEMPERATURA DEL CLIENTE Y LA ENVIA AL WEBHOOK
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
require("dotenv").config();
const axios = require("axios");

const app = express();
const PORT = process.env.PORT;
const PORT2 = process.env.PORT2;
const PORT3 = process.env.PORT3;
const URL = `ws://localhost:${PORT}`; // IndexWs.js
const URL2 = `ws://localhost:${PORT2}`; // ClienteWs.js
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  console.log("CONECTADO AL SERVIDOR PRINCIPAL");

  //---------------- Conexion al ClienteWs -------------------
  const clientWs = new WebSocket(URL2);
  clientWs.on("open", () => {
    console.log("CONECTADO AL ClienteWS");
  });

  clientWs.on("message", async (data) => {
    const temperatura = data.toString();
    //console.log("Temperatura de ClienteWs:", temperatura);
    ws.send(temperatura); //Temperatura recibida del ClienteWs

    //envia la temperatura AL WEBHOOK
    try {
      await axios.post(`http://localhost:${PORT3}/temperatura`, {
        temp: temperatura,
      });
      console.log("Temperatura enviada al webhook");
    } catch (error) {
      console.error("Error al enviar la temperatura al webhook:", error);
    }
  });
  // -----------------------------------------------------

  ws.on("close", () => {
    console.log("DESCONECTADO - SERVIDOR PRINCIPAL");
    if (clientWs) {
      clientWs.close();
    }
  });
});

server.listen(PORT, () => {
  console.log("Subscripción al IndexWS en " + URL);
});

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
    console.log("Temperatura de ClienteWs:", temperatura);
    ws.send(temperatura);
    //
    //ACA DEBERIAMOS ENVIAR LA temperatura AL WEBHOOK
    //
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

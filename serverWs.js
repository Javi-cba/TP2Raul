const express = require("express");
const axios = require("axios");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT; //MicTemp
const PORT2 = process.env.PORT2; //ServerWs
const URL = `ws://localhost:${PORT2}`; // para fetch de micTemp
app.use(express.json());

// Codigo Raul
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", async (ws) => {
  console.log("CONECTADO");

  //Enviando la temperatura al cliente (TODO: falta hacerlo cada 5 segundos)
  const resp = await axios.get(`http://localhost:${PORT}/temp`);
  ws.send(JSON.stringify(resp.data));

  ws.on("close", () => {
    console.log("DESCONECTADO");
  });
});

server.listen(PORT2, () => {
  // Para probar suscribirse al WS en PostMan
  console.log("Subscripción de WS en " + URL);
});

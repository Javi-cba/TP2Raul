// PUNTO 1: WS TEMPERATURA CADA 5 SEGUNDOS
const express = require("express");
const axios = require("axios");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT; // MicTemp
const PORT2 = process.env.PORT2; // ServerWs
const URL = `ws://localhost:${PORT2}`; // para fetch de micTemp
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  console.log("CONECTADO");

  const timeTemperature = async () => {
    try {
      const resp = await axios.get(`http://localhost:${PORT}/temp`);
      ws.send(JSON.stringify(resp.data));
    } catch (error) {
      console.error("Error peticion temperatura:", error);
    }
  };

  // Envia temperatura cada 5 segundos
  const interval = setInterval(timeTemperature, 5000);

  // cerrar y borrar
  ws.on("close", () => {
    clearInterval(interval);
    console.log("DESCONECTADO");
  });
});

server.listen(PORT2, () => {
  console.log("Subscripción de WS en " + URL);
});

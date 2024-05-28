// PUNTO 1: WS TEMPERATURA CADA 5 SEGUNDOS
const express = require("express");
const axios = require("axios");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT2 = process.env.PORT2;
const URL = `ws://localhost:${PORT2}`;
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  console.log("CONECTADO");

  const timeTemperature = async () => {
    try {
      const max = 60;
      const min = -20;
      const temp = Math.floor(Math.random() * (max - min) + min);
      ws.send(JSON.stringify(temp));
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
  console.log("Subscripción de Client WS en " + URL);
});

// PUNTO 1: WS TEMPERATURA CADA 5 SEGUNDOS
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
require("dotenv").config();

// Función para generar números aleatorios siguiendo una distribución normal
function randomGaussian(mean, standardDeviation) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Convierte [0,1) a (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    // Escala el número a la desviación estándar y la media, y lo redondea
    return Math.round(num * standardDeviation + mean);
}

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
      const mean = 25; // Temperatura promedio
      const standardDeviation = 5; // Desviación estándar, cuanto más grande, más dispersos serán los valores
      const temp = randomGaussian(mean, standardDeviation);
    
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

// PUNTO 2: WS REST CLIENT
require("dotenv").config();
const PORT = process.env.PORT2; //ws
const WebSocket = require("ws");
const ws = new WebSocket(`ws://localhost:${PORT}`);

ws.on("open", () => {
  console.log("CONECTADO");
});

// respuestas del WebSocket
ws.on("message", (data) => {
  console.log(`Temperatura: ${data.toString()}C°`);
});

ws.on("close", () => {
  console.log("Cliente Desconectado!!");
});

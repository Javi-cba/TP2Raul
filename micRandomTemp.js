const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const URL = `http://localhost:${PORT}`;

app.get('/temp', (req, res) => {
  const max = 60;
  const min = -20;
  const temp = Math.floor(Math.random() * (max - min) + min); //? 


  console.log(temp)//? 
  res.json(temp);
});

app.listen(PORT, () => {
  console.log("Escuchando en puerto " + URL);
});

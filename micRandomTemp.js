const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const URL = `http://localhost:${PORT}`;

app.get(`/temp`, (req, res) => {
  
  const max = 60;
  const min = -20;
  
  const temp = Math.floor(Math.random()* (max - min) + min);

  res.json(temp)
});



app.listen(PORT, () => {
  console.log("escuchando puesrto" + URL)
});
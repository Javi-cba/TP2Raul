const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const URL = `http://localhost:${PORT}`;

app.get(`${URL}/temp`, (req, res) => {
  const temp = Math.floor(Math.random());
});

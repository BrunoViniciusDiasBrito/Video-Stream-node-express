const express = require("express");
const app = require("express")();
const consign = require("consign");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static("public"));

consign().include("controllers").into(app);

module.exports = app;

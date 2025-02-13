const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rootpassword",
  database: process.env.DB_NAME || "testdb",
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/data", (req, res) => {
  connection.query("SELECT * FROM my_table", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

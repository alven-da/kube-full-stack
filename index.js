const express = require("express");
const mysql = require("mysql2");

const { Client } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// const mysqlConnection = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "rootpassword",
//   database: process.env.DB_NAME || "testdb",
// });

const pgConnection = new Client({
  host: process.env.PG_DB_HOST || "pgsql-service",
  user: process.env.PG_DB_USER || "mypguser",
  password: process.env.PG_DB_PASSWORD || "mypgpassword",
  database: process.env.PG_DB_NAME || "mypgdatabase",
  port: 5432, // Default PostgreSQL port
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/pg-connect", async (req, res) => {
  try {
    await pgConnection.connect();
    console.log("Connected successfully");

    // Execute a query
    const result = await pgConnection.query(
      "SELECT 'Hello, World!' AS message FROM pg_catalog.pg_tables LIMIT 1;"
    );
    console.log("Query results:", result.rows);

    res.send(result.rows);
  } catch (err) {
    console.error("Query error", err.stack);
  } finally {
    await pgConnection.end(); // Close the connection
    console.log("Connection closed");
  }
});

app.get("/data", (req, res) => {
  // mysqlConnection.query("SELECT * FROM my_table", (err, results) => {
  //   if (err) throw err;
  //   res.json(results);
  // });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

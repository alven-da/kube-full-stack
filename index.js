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
  host: process.env.PG_DB_HOST,
  user: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_NAME,
  port: 5432, // Default PostgreSQL port
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/pg/test", async (req, res) => {
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
  }

  await pgConnection.end(); // Close the connection
  console.log("Connection closed");
});

app.post("/pg/user", async (req, res) => {
  console.log("request body", req.body);

  try {
    const { first_name, last_name, username, password } = req.body;

    await pgConnection.connect();
    console.log("Connected successfully");

    const sql =
      "INSERT INTO public.user_info (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)";

    // Execute a query
    const result = await pgConnection.query({
      name: "insert-user",
      text: sql,
      values: [first_name, last_name, username, password],
    });
    console.log("Query results:", result);

    res.send(result);
  } catch (err) {
    console.error("Query error", err.stack);
  }

  await pgConnection.end(); // Close the connection
  console.log("Connection closed");
  res.send("ok");
});

app.post("/pg/table/create", async (req, res) => {
  try {
    await pgConnection.connect();
    console.log("Connected successfully");

    const sqlStmt =
      "CREATE TABLE IF NOT EXISTS public.user_info (username varchar(45) NOT NULL, password varchar(100) NOT NULL, first_name varchar(100), last_name varchar(100), PRIMARY KEY (username))";

    // Execute a query
    const result = await pgConnection.query(sqlStmt);
    console.log("Query results:", result.rows);

    res.send(result.rows);
  } catch (err) {
    console.error("Query error", err.stack);

    res.send({ message: "Error encountered", details: err.message });
  }

  await pgConnection.end(); // Close the connection
  console.log("Connection closed");
});

// app.get("/my/test", async (req, res) => {
//   try {
//     await mysqlConnection.connect();

//     res.send("MySQL connection test successful");
//   } catch (error) {
//     res.send({
//       message: "Error encountered",
//       details: error.message,
//     });
//   }
// });

// app.post("/my/table/crate");

app.get("/data", (req, res) => {
  // mysqlConnection.query("SELECT * FROM my_table", (err, results) => {
  //   if (err) throw err;
  //   res.json(results);
  // });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

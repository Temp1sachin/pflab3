const mysql = require("mysql2/promise");
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",  // ← only change
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "todo_app",
  waitForConnections: true,
  connectionLimit: 10
});
module.exports = db;

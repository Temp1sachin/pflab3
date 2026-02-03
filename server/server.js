const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

/* --- app setup --- */
const app = express();
app.use(cors());
app.use(express.json());

/* --- routes --- */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/users", require("./routes/users"));

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

/* --- db & server --- */
const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await db.getConnection();
    console.log("✅ MySQL connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
    process.exit(1);
  }
})();

const db = require("../db");

const User = {
  // create new user
  async create({ name, email, password }) {
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    return result.insertId;
  },

  // find user by email (for login)
  async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  // find user by id
  async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // get all users
  async findAll() {
    const [rows] = await db.execute(
      "SELECT id, name, email FROM users"
    );
    return rows;
  }
};

module.exports = User;

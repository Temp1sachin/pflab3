const User = require("../models/User");

exports.listUsers = async (_req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

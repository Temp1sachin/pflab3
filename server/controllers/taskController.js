const Task = require("../models/Task");

/* GET /api/tasks */
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    // get tasks where user is assignee or creator
    const tasks = await Task.findAllByUser(userId);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/* POST /api/tasks */
exports.createTask = async (req, res) => {
  try {
    const taskId = await Task.create({
      ...req.body,
      creator: req.user.id
    });

    const task = await Task.findByIdWithUsers(taskId);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/* PUT /api/tasks/:id */
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await Task.update(req.params.id, req.body);
    const updatedTask = await Task.findByIdWithUsers(req.params.id);

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/* DELETE /api/tasks/:id */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.creator_id !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Task.delete(req.params.id);
    res.json({ msg: "Task removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

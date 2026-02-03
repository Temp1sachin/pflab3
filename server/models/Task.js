const db = require("../db");

const Task = {
  // create task
  async create({
    title,
    description,
    dueDate,
    priority = "Low",
    status = "ToDo",
    assignee,
    creator
  }) {
    const [result] = await db.execute(
      `INSERT INTO tasks
       (title, description, due_date, priority, status, assignee_id, creator_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        dueDate,
        priority,
        status,
        assignee,
        creator
      ]
    );
    return result.insertId;
  },

  // get all tasks with assignee & creator
  async findAll() {
    const [rows] = await db.execute(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.due_date AS dueDate,
        t.priority,
        t.status,
        t.created_at,
        t.updated_at,
        u1.id AS assigneeId,
        u1.name AS assigneeName,
        u2.id AS creatorId,
        u2.name AS creatorName
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.creator_id = u2.id
      ORDER BY t.created_at DESC
    `);
    return rows;
  },

  // find task by id
  async findById(id) {
    const [rows] = await db.execute(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // update task
  async update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    values.push(id);

    await db.execute(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
  },
  
  // get tasks for logged-in user
async findAllByUser(userId) {
  const [rows] = await db.execute(
    `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.due_date AS dueDate,
      t.priority,
      t.status,
      u1.id AS assigneeId,
      u1.name AS assigneeName,
      u2.id AS creatorId,
      u2.name AS creatorName
    FROM tasks t
    LEFT JOIN users u1 ON t.assignee_id = u1.id
    LEFT JOIN users u2 ON t.creator_id = u2.id
    WHERE t.assignee_id = ? OR t.creator_id = ?
    ORDER BY t.created_at DESC
    `,
    [userId, userId]
  );
  return rows;
},

// get task with user info
async findByIdWithUsers(id) {
  const [rows] = await db.execute(
    `
    SELECT 
      t.*,
      u1.name AS assigneeName,
      u2.name AS creatorName
    FROM tasks t
    LEFT JOIN users u1 ON t.assignee_id = u1.id
    LEFT JOIN users u2 ON t.creator_id = u2.id
    WHERE t.id = ?
    `,
    [id]
  );
  return rows[0];
}

,
  // delete task
  async delete(id) {
    await db.execute(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );
  }
};

module.exports = Task;

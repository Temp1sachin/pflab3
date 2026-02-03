-- ===============================
-- TODO APP DATABASE SETUP
-- ===============================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS todo_app;

-- Use database
USE todo_app;

-- ===============================
-- USERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================
-- TASKS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
  status ENUM('ToDo', 'In Progress', 'Done') DEFAULT 'ToDo',
  assignee_id INT,
  creator_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_assignee
    FOREIGN KEY (assignee_id)
    REFERENCES users(id)
    ON DELETE SET NULL,

  CONSTRAINT fk_creator
    FOREIGN KEY (creator_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ===============================
-- DONE
-- ===============================
SELECT 'Database & tables created successfully 🎉' AS status;

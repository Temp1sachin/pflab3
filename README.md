# Teams ToDo

A collaborative Teams ToDo app where users can create, assign, and manage tasks within a team. Inspired by JIRA, this app features a modern Kanban board, filters, and a responsive, intuitive UI.

## 🚀 Features

- **Authentication:** Signup & Login with email and password
- **User Dashboard:**
  - View tasks assigned to you and tasks you’ve assigned to others
  - Filter by status (ToDo, In Progress, Done) and deadline (approaching in 3 days)
- **Task Management:**
  - Create, edit, and assign tasks
  - Fields: Title, Description, Due Date, Priority, Assignee, Status
  - Form validations
- **Kanban Board:**
  - Drag-and-drop tasks between columns (ToDo, In Progress, Done)
  - Visual cues for deadlines and priorities
- **Responsive Design:** Works beautifully on desktop and mobile

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Redux, Material-UI (MUI)
* **Backend:** Node.js, Express.js
* **Database:** MySQL (Local)

---

## 📦 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Temp1sachin/pflab3.git
cd Project
```

---

### 2️⃣ Setup the Database (MySQL)

Make sure **MySQL is installed and running**.

#### Create DB & tables (one command)

```powershell
cd server
mysql -u root -p --execute="source setup.sql"
```

✔ This creates:

* `todo_app` database
* `users` table
* `tasks` table

---

### 3️⃣ Setup the Server (Backend)

```bash
cd server
npm install
```

#### Create `.env` file inside `server/`

```env
PORT=5001


DB_PASSWORD=your_mysql_password


JWT_SECRET=super_secret_jwt_key_change_this

```

#### Start the backend

```bash
npm run dev
```

Expected output:

```txt
✅ MySQL connected
🚀 Server running on port 5001
```

---

### 4️⃣ Setup the Client (Frontend)

```bash
cd ../client
npm install
```

#### Start the frontend

```bash
npm run dev
```

The client will run on
👉 **[http://localhost:3000](http://localhost:3000)**

---






## 📄 Assignment Notes

- All registered users are considered team members.
- UI/UX is inspired by JIRA, with a focus on clarity and ease of use.
- Deadline approaching tasks are visually highlighted.
- Fully responsive and mobile-friendly.

# Teams ToDo

A team task manager with authentication, list view, and kanban board.

## Tech Stack

- Frontend: React, Redux, MUI
- Backend: Node.js, Express
- Database: MySQL
- Containerization: Docker, Docker Compose

## Project Structure

- client: React app
- server: Express API + MySQL queries
- docker-compose.yml: runs db, server, and client together

## Environment File (.env)

Create a file named .env in the project root (same folder as docker-compose.yml):

```env
DB_PASSWORD=your_mysql_root_password
JWT_SECRET=your_strong_jwt_secret
```

### Create .env quickly

PowerShell:

```powershell
@"
DB_PASSWORD=your_mysql_root_password
JWT_SECRET=your_strong_jwt_secret
"@ | Set-Content .env
```

macOS/Linux:

```bash
cat > .env <<EOF
DB_PASSWORD=your_mysql_root_password
JWT_SECRET=your_strong_jwt_secret
EOF
```

## Run With Docker Compose (Recommended)

Run commands from project root.

### Start (build + run)

PowerShell:

```powershell
docker compose up -d --build
```

macOS/Linux:

```bash
docker compose up -d --build
```

### Check containers

PowerShell:

```powershell
docker compose ps
```

macOS/Linux:

```bash
docker compose ps
```

### View logs

PowerShell:

```powershell
docker compose logs -f
```

macOS/Linux:

```bash
docker compose logs -f
```

### Stop containers

PowerShell:

```powershell
docker compose down
```

macOS/Linux:

```bash
docker compose down
```

### Full reset (remove volumes)

PowerShell:

```powershell
docker compose down -v
```

macOS/Linux:

```bash
docker compose down -v
```

## Dockerfile Commands (Manual)

Use these only if you want to run without docker-compose.

### Server image and container

PowerShell:

```powershell
docker build -t todo-server ./server
docker run --name todo_server -p 5001:5001 --env PORT=5001 --env DB_HOST=host.docker.internal --env DB_USER=root --env DB_PASSWORD=your_mysql_root_password --env DB_NAME=todo_app --env JWT_SECRET=your_strong_jwt_secret todo-server
```

macOS/Linux:

```bash
docker build -t todo-server ./server
docker run --name todo_server -p 5001:5001 -e PORT=5001 -e DB_HOST=host.docker.internal -e DB_USER=root -e DB_PASSWORD=your_mysql_root_password -e DB_NAME=todo_app -e JWT_SECRET=your_strong_jwt_secret todo-server
```

### Client image and container

PowerShell:

```powershell
docker build -t todo-client ./client
docker run --name todo_client -p 3000:3000 --env REACT_APP_API_URL=http://localhost:5001 todo-client
```

macOS/Linux:

```bash
docker build -t todo-client ./client
docker run --name todo_client -p 3000:3000 -e REACT_APP_API_URL=http://localhost:5001 todo-client
```

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- MySQL Host Port: localhost:3307

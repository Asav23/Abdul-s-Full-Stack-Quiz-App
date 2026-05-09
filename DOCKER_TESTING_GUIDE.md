# Docker & Backend Testing Guide

## Quick Start

### 1. Build Backend JAR
```bash
cd /workspaces/Abdul-s-Full-Stack-Quiz-App
mvn clean package -DskipTests
```

### 2. Start Docker Containers
```bash
docker-compose up -d
```

### 3. Verify Services Running
```bash
docker-compose ps
```

---

## Testing Backend API Endpoints

### View Active Containers & Logs
```bash
# List running containers
docker-compose ps

# View backend logs
docker logs quiz-backend

# View database logs
docker logs quiz-postgres

# Follow logs in real-time
docker logs -f quiz-backend
```

### Test API Endpoints

#### 1. Get All Quizzes (Empty List)
```bash
curl http://localhost:8000/api/quizzes
```
**Expected Output:** `[]` (empty array)

#### 2. Create a Quiz
```bash
curl -X POST http://localhost:8000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Math Basics",
    "description": "Basic math questions"
  }'
```

#### 3. Get Quiz by ID
```bash
curl http://localhost:8000/api/quizzes/1
```

#### 4. Update Quiz
```bash
curl -X PUT http://localhost:8000/api/quizzes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Math Basics Updated",
    "description": "Updated description"
  }'
```

#### 5. Delete Quiz
```bash
curl -X DELETE http://localhost:8000/api/quizzes/1
```

---

## Troubleshooting

### 404 Error (Whitelabel Error Page)
**Issue:** `This application has no explicit mapping for /error`
**Solution:** You're hitting a wrong endpoint. Use correct endpoints listed above.

### Container Won't Start
```bash
# Check logs
docker logs quiz-backend

# Common issues:
# 1. Port already in use → Close other apps or change port in docker-compose.yml
# 2. Database not ready → Wait 10-15 seconds for Postgres to initialize
```

### Database Connection Error
```bash
# Verify database is healthy
docker logs quiz-postgres

# Check if containers can communicate
docker network ls  # View networks
docker network inspect quiz-net  # Check quiz-net
```

---

## Docker Compose Services

### Service: quiz-postgres (Database)
- **Container Name:** quiz-postgres
- **Port:** 5433 (external) → 5432 (internal)
- **Database:** quizdb
- **User:** postgres
- **Password:** postgres
- **Health Check:** Enabled (queries database every 10s)

### Service: quiz-backend (Java Spring Boot)
- **Container Name:** quiz-backend
- **Port:** 8000
- **Base Image:** eclipse-temurin:21-jre-alpine (Java 21)
- **JAR File:** target/quiz-backend-0.0.1-SNAPSHOT.jar
- **Depends On:** quiz-db (waits for database health check)

---

## Environment Variables (Running in Docker)

These override `application.properties`:
```
SPRING_DATASOURCE_URL: jdbc:postgresql://quiz-db:5432/quizdb
SPRING_DATASOURCE_USERNAME: postgres
SPRING_DATASOURCE_PASSWORD: postgres
SPRING_JPA_HIBERNATE_DDL_AUTO: update
```

**Note:** Inside Docker, use `quiz-db` hostname (not `localhost:5433`)

---

## Clean Up

### Stop Containers
```bash
docker-compose stop
```

### Stop & Remove Containers
```bash
docker-compose down
```

### Remove Containers + Data
```bash
docker-compose down -v
```

### Remove Built Image
```bash
docker rmi abdul-s-full-stack-quiz-app-quiz-backend
```

---

## Performance Tips

1. **Faster Rebuilds:** Skip tests during build
   ```bash
   mvn clean package -DskipTests
   ```

2. **Check Container Resources**
   ```bash
   docker stats
   ```

3. **View Network Traffic**
   ```bash
   docker network inspect quiz-net
   ```

---

## API Response Examples

**Success (200):**
```json
[
  {
    "id": 1,
    "name": "Math Basics",
    "questions": []
  }
]
```

**Error (404):**
```
Whitelabel Error Page
This application has no explicit mapping for /error
```
→ **Fix:** Use correct endpoint, e.g., `/api/quizzes` instead of wrong path

---

## Useful Docker Commands

```bash
# Execute command inside container
docker exec quiz-backend java -version

# Check container resource usage
docker stats quiz-backend

# View container port mappings
docker port quiz-backend

# Access database inside container
docker exec -it quiz-postgres psql -U postgres -d quizdb

# View backend JAR size
ls -lh target/quiz-backend-0.0.1-SNAPSHOT.jar

# Rebuild image without cache
docker-compose build --no-cache
```

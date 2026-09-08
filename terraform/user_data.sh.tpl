#!/bin/bash
set -euxo pipefail

dnf install -y docker
systemctl enable --now docker

curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

REGISTRY_HOST=$(echo "${backend_repo_url}" | cut -d/ -f1)
aws ecr get-login-password --region ${aws_region} | docker login --username AWS --password-stdin "$REGISTRY_HOST"

mkdir -p /opt/quizzer
cat > /opt/quizzer/docker-compose.yml <<'EOF'
services:
  quiz-backend:
    image: ${backend_repo_url}:${backend_image_tag}
    container_name: quiz-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://${db_endpoint}:5432/${db_name}
      SPRING_DATASOURCE_USERNAME: ${db_username}
      SPRING_DATASOURCE_PASSWORD: ${db_password}
      SPRING_DATASOURCE_DRIVER_CLASS_NAME: org.postgresql.Driver
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SPRING_JPA_SHOW_SQL: "false"
      APP_CORS_ALLOWED_ORIGINS: "*"
    networks:
      - quiz-net
    restart: unless-stopped

  quiz-frontend:
    image: ${frontend_repo_url}:${frontend_image_tag}
    container_name: quiz-frontend
    ports:
      - "80:80"
    depends_on:
      - quiz-backend
    networks:
      - quiz-net
    restart: unless-stopped

networks:
  quiz-net:
    driver: bridge
EOF

# The compose file above embeds the DB password in plaintext - restrict it
# to the root user only, since this is the only place it's stored on the box.
chmod 600 /opt/quizzer/docker-compose.yml

cd /opt/quizzer
/usr/local/bin/docker-compose up -d

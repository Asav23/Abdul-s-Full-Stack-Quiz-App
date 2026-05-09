# Use official Java 21 runtime as base image
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built JAR file from the target directory
COPY target/quiz-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8000
EXPOSE 8000

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

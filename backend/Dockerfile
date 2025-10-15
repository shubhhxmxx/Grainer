# ---------- STAGE 1: Build the JAR ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

# Build the project
RUN mvn -B -ntp clean package -DskipTests

# ---------- STAGE 2: Runtime Image ----------
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy the built jar from the target folder of the previous stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

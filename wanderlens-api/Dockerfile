# wanderlens-api Dockerfile
# 多階段建置

# ── 建置階段 ──
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# ── 執行階段 ──
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /build/target/wanderlens-api-*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Xms256m -Xmx512m -Dfile.encoding=UTF-8"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --spring.profiles.active=${SPRING_PROFILES_ACTIVE:-dev}"]
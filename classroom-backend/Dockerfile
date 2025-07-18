# 1단계: Gradle로 빌드
FROM gradle:7.6.0-jdk17 AS build
COPY --chown=gradle:gradle . /app
WORKDIR /app
RUN gradle build -x test

# 2단계: JAR 실행용 이미지
FROM eclipse-temurin:17-jdk
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]

# 1단계: build용 이미지
FROM gradle:7.6.0-jdk17 AS build

COPY --chown=gradle:gradle . /app
WORKDIR /app

RUN chmod +x ./gradlew
RUN ./gradlew build -x test

# 2단계: 실행용 이미지
FROM openjdk:17
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

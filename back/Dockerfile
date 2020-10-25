FROM maven:3.6.3-openjdk-16 AS build

COPY pom.xml /tmp/
COPY src /tmp/src/
WORKDIR /tmp/
RUN mvn clean compile assembly:single



FROM bellsoft/liberica-openjdk-alpine:latest
ENV LANG=C.UTF-8


RUN mkdir /application/
COPY --from=build /tmp/out/maven/*.jar /application/application.jar
WORKDIR /application/

EXPOSE 18080

CMD ["java", "-cp", "/application/application.jar", "org.kar.karideo.WebLauncher"]


FROM bellsoft/liberica-openjdk-alpine:latest

ENV LANG=C.UTF-8
#ENV JAVA_HOME=/usr/lib/jvm/java-14-openjdk
#ENV JAVAFX_HOME=$JAVA_HOME
#ENV PATH=/usr/lib/jvm/java-14-openjdk/bin/:$PATH
#ENV JAVA_VERSION=14.0.2


RUN mkdir /application/
ADD karideo.jar /application/
WORKDIR /application/

EXPOSE 18080

CMD ["java", "-cp", "/application/karideo.jar", "org.kar.karideo.WebLauncher"]


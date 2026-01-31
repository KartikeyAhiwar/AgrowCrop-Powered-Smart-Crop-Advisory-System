@echo off
echo Setting JAVA_HOME to C:\Program Files\Java\jdk-17.0.18
set "JAVA_HOME=C:\Program Files\Java\jdk-17.0.18"
cd java-service
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local

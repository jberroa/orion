# Start with Maven 3.9 and Temurin JDK 17
FROM --platform=linux/amd64 maven:3.9.9-eclipse-temurin-17

# Install necessary tools (using apt-get instead of apk)
RUN apt-get update && apt-get install -y wget tar && rm -rf /var/lib/apt/lists/*

# Define installation directory for additional JDKs
ENV INSTALL_DIR=/opt/java

# Create installation directory
RUN mkdir -p ${INSTALL_DIR}

# Install Temurin JDK 8
RUN wget -qO- https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u312-b07/OpenJDK8U-jdk_x64_linux_hotspot_8u312b07.tar.gz | \
    tar -xz -C ${INSTALL_DIR} && \
    mv ${INSTALL_DIR}/jdk8u312-b07 ${INSTALL_DIR}/temurin-8-jdk

# Set environment variables for Java versions
ENV JAVA8_HOME=${INSTALL_DIR}/temurin-8-jdk
ENV JAVA17_HOME=/opt/java/openjdk

# Set Java 17 as default
ENV JAVA_HOME=${JAVA17_HOME}
ENV PATH=${JAVA_HOME}/bin:${PATH}

# Verify installations (using JAVA_HOME)
RUN java -version

# Example of switching to Java 8 (override JAVA_HOME)
RUN JAVA_HOME=${JAVA8_HOME} java -version

# Keep Java 17 as default
ENV JAVA_HOME=${JAVA17_HOME}

# Create .m2 directory and clean any existing repository
RUN mkdir -p /root/.m2 && \
    rm -rf /root/.m2/repository

# Add settings.xml
COPY settings.xml /root/.m2/settings.xml

# Clean and verify Maven setup
RUN mvn --version

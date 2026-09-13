pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        GHCR_REGISTRY = 'ghcr.io'
        IMAGE_NAME    = 'wajdimag/math-api'
        DB_CONTAINER  = 'math-db'
        DB_VOLUME     = 'math_db_data'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                retry(3) {
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'docker build --target builder -t wajdimag/math-api:builder .'
            }
        }

        stage('Automated Testing') {
            steps {
                sh 'docker run --rm wajdimag/math-api:builder npm test'
            }
        }

        stage('Gitleaks Secret Scan') {
            steps {
                sh '''
                    tar -cf - --exclude='.git' . | \
                    docker run --rm -i \
                        --entrypoint sh \
                        zricethezav/gitleaks:latest \
                        -c "
                            mkdir -p /tmp/scan && \
                            tar -xf - -C /tmp/scan && \
                            gitleaks dir /tmp/scan --verbose
                        "
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(
                    credentialsId: 'SONAR_TOKEN',
                    variable: 'SONAR_TOKEN')]) {
                    sh '''
                        docker run --rm \
                            --network math-api_default \
                            -v "$(pwd):/usr/src" \
                            sonarsource/sonar-scanner-cli \
                            -Dsonar.host.url="http://sonarqube:9000" \
                            -Dsonar.projectKey="math-api" \
                            -Dsonar.login="${SONAR_TOKEN}"
                    '''
                }
            }
        }

        stage('Persistent Database Gate') {
            steps {
                sh '''
                    if [ ! "$(docker ps -q -f name=${DB_CONTAINER})" ]; then
                        if [ "$(docker ps -aq -f status=exited -f name=${DB_CONTAINER})" ]; then
                            docker start ${DB_CONTAINER}
                        else
                            docker run -d \
                                --name ${DB_CONTAINER} \
                                -v ${DB_VOLUME}:/var/lib/postgresql/data \
                                --restart unless-stopped \
                                postgres:15-alpine
                        fi
                    fi

                    echo "Checking DB container status..."

                    DB_RUNNING=$(docker inspect \
                        -f '{{.State.Running}}' \
                        ${DB_CONTAINER})

                    if [ "$DB_RUNNING" != "true" ]; then
                        echo "❌ Database container is not running."
                        exit 1
                    fi

                    docker volume inspect ${DB_VOLUME} || \
                        echo "Volume will be created"

                    echo "✅ Database container is running."
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                        -t ${GHCR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} .
                '''
            }
        }

        stage('Security Gate (Trivy Scan)') {
            steps {
                retry(2) {
                    sh '''
                        docker run --rm \
                            -v /var/run/docker.sock:/var/run/docker.sock \

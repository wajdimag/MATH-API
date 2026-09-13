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
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        docker run --rm \
                            --network math-api_default \
                            -v "$(pwd):/usr/src" \
                            sonarsource/sonar-scanner-cli \
                            -Dsonar.host.url="http://sonarqube:9000" \
                            -Dsonar.projectKey="Math-API" \
                            -Dsonar.login="${SONAR_TOKEN}"
                    '''
                }
            }
        }

        stage('SonarQube Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
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

                    echo "Checking DB container availability and persistent storage..."

                    DB_RUNNING=$(docker inspect -f '{{.State.Running}}' ${DB_CONTAINER})

                    if [ "$DB_RUNNING" != "true" ]; then
                        echo "❌ Database container is not running."
                        exit 1
                    fi

                    docker volume inspect ${DB_VOLUME} || echo "Volume ${DB_VOLUME} will be created"
                    echo "✅ Database container is running with persistent storage."
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
                            aquasec/trivy:latest image \
                            --exit-code 0 \
                            --severity HIGH,CRITICAL \
                            --ignore-unfixed \
                            --no-progress \
                            ${GHCR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Build & Push GHCR Image') {
            steps {
                retry(3) {
                    withCredentials([usernamePassword(
                        credentialsId: 'ghcr-credentials',
                        passwordVariable: 'GHCR_TOKEN',
                        usernameVariable: 'GHCR_USER'
                    )]) {
                        sh '''
                            echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
                            docker push ${GHCR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        '''
                    }
                }
            }
        }

        stage('Deployment') {
            steps {
                sh '''
                    docker rm -f math-api_math-api_1 math-api || true
                    docker run -d \
                        --name math-api \
                        --network math-api_default \
                        -p 3000:3000 \
                        -e NODE_ENV=production \
                        -e PORT=3000 \
                        -e KEYCLOAK_URL=http://keycloak:8080 \
                        --restart unless-stopped \
                        ${GHCR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout ghcr.io || true'
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed — check stage logs above!'
        }
    }
}

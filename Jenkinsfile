pipeline {
    agent any

    environment {
        GHCR_REGISTRY = 'ghcr.io'
        IMAGE_NAME    = 'wajdimag/math-api'
        DB_CONTAINER  = 'math-db'
        DB_VOLUME     = 'math_db_data'
    }

    stages {
        stage('Checkout & Setup') {
            steps {
                retry(3) {
                    checkout scm
                }
            }
        }

        stage('Persistent DB Gate') {
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
                '''
            }
        }

        stage('Build & Push GHCR Image') {
            steps {
                retry(3) {
                    withCredentials([usernamePassword(credentialsId: 'ghcr-credentials', passwordVariable: 'GHCR_TOKEN', usernameVariable: 'GHCR_USER')]) {
                        sh '''
                            echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
                            docker build -t ${GHCR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} .
                            docker push ${GHCR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        '''
                    }
                }
            }
        }

        stage('Security Gate (Trivy Scan)') {
            steps {
                retry(2) {
                    sh '''
                        docker run --rm \
                          -v /var/run/docker.sock:/var/run/docker.sock \
                          aquasec/trivy:latest image \
                          --exit-code 1 \
                          --severity HIGH,CRITICAL \
                          --ignore-unfixed \
                          --no-progress \
                          ${GHCR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                    '''
                }
            }
        }
    }
}

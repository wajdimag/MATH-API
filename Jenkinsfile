pipeline {
    agent any

    environment {
        GHCR_REGISTRY = 'ghcr.io'
        IMAGE_NAME = 'wajdimag/math-api'
        DB_CONTAINER = 'math-db'
        DB_VOLUME = 'math_db_data'
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
                // Reuses existing volume & running GHCR database container without wiping data
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
                // Retries transient network failures during docker pull/push
                retry(3) {
                    withCredentials([usernamePassword(credentialsId: 'ghcr-credentials', passwordVariable: 'GHCR_TOKEN', usernameVariable: 'GHCR_USER')]) {
                        sh '''
                            echo $GHCR_TOKEN | docker login ghcr.io -u $GHCR_USER --password-stdin
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
                    // Strictly fails the build if HIGH or CRITICAL vulnerabilities are found
                    sh '''
                        trivy image \
                          --exit-code 1 \
                          --severity HIGH,CRITICAL \
                          --no-progress \
                          ${GHCR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                    '''
                }
            }
        }
    }
}

pipeline {
    agent any
    tools {
        nodejs 'node'
    }
    stages {

        stage('Checkout') {
            steps {
                echo '📥 Cloning code from GitHub...'
                checkout scm
            }
        }

        stage('Gitleaks — Secret Detection') {
            steps {
                echo '🔍 Scanning for exposed secrets, tokens, and API keys...'
                sh '''
                    docker run --rm \
                        -v $(pwd):/path \
                        gitleaks/gitleaks:latest \
                        detect \
                        --source=/path \
                        --verbose \
                        --no-git \
                        --redact \
                        --exit-code=1 || {
                            echo "❌ Gitleaks found exposed secrets — pipeline blocked!"
                            exit 1
                        }
                    echo "✅ No secrets detected — safe to continue."
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm packages...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running Jest test suite...'
                sh 'npm test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('sonar') {
                        echo '📊 Running Static Application Security Testing (SAST)...'
                        def scannerHome = tool 'sonar-scanner'
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=Math-API \
                                -Dsonar.projectName=Math-API \
                                -Dsonar.sources=. \
                                -Dsonar.exclusions=**/node_modules/**,**/Tests/**
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building production Docker image...'
                sh 'docker build -t math-api:latest .'
            }
        }

        stage('Trivy — Container Scan') {
            steps {
                echo '🛡️ Scanning Docker image for vulnerabilities...'
                sh '''
                    docker run --rm \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        aquasec/trivy:latest \
                        image \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        math-api:latest || {
                            echo "❌ Trivy found critical vulnerabilities — pipeline blocked!"
                            exit 1
                        }
                    echo "✅ No critical vulnerabilities found."
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application with Docker Compose...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
                sh 'sleep 10'
                sh 'curl -f http://localhost:3000/health'
                echo '✅ Application deployed and healthy!'
            }
        }

    }

    post {
        success {
            echo '''
            ✅ ================================
            ✅ Pipeline completed successfully!
            ✅ All security gates passed.
            ✅ Application is live.
            ✅ ================================
            '''
        }
        failure {
            echo '''
            ❌ ================================
            ❌ Pipeline FAILED!
            ❌ Check the stage logs above.
            ❌ Fix issues before redeploying.
            ❌ ================================
            '''
        }
    }
}

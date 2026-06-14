pipeline {
    agent any

    environment {
        IMAGE_NAME = 'math-api'
        PORT       = '3000'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Cloning code from GitHub...'
                checkout scm
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
                echo '🧪 Running unit tests...'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh 'docker build -t ${IMAGE_NAME} .'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo '🚀 Deploying with docker-compose...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                echo '❤️ Checking API health...'
                sh 'sleep 10'
                sh 'curl -f http://localhost:3000/health'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed — check logs above'
        }
    }
}

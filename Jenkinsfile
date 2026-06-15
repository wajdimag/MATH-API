pipeline {
    agent any

    tools {
        // Tells Jenkins to load the Node environment we configured in the Tools dashboard
        nodejs 'node'
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
                echo '🧪 Running Jest test suite...'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Compiling API into production container...'
                sh 'docker build -t math-api:latest .'
            }
        }
    }
    
    post {
        failure {
            echo '❌ Pipeline failed — check logs above'
        }
        success {
            echo '✅ Pipeline passed cleanly!'
        }
    }
}

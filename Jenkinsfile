pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    stages {
        stage('Gitleaks (Secrets Detection)') {
            steps {
                echo '🔍 Scanning repository for exposed keys, secrets, or tokens...'
                // FIX: Added --no-git to scan the current files cleanly without Git ownership errors.
                sh 'docker run --rm -v $(pwd):/path zricethezav/gitleaks:latest detect --source=/path --no-git --verbose'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('sonar') {
                        echo '📊 Executing Static Application Security Testing (SAST)...'
                        def scannerHome = tool 'sonar-scanner'
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=Math-API -Dsonar.projectName=Math-API -Dsonar.sources=. -Dsonar.exclusions=**/node_modules/**,**/Tests/**"
                    }
                }
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

        stage('Trivy (Container Scan)') {
            steps {
                echo '🛡️ Scanning final Docker image for OS vulnerabilities (with auto-retry)...'
                // FIX: If the DB download fails due to network, Jenkins will automatically retry up to 3 times.
                retry(3) {
                    sh '''
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest clean --all
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL math-api:latest
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo '❌ DevSecOps Pipeline failed — check security scans or test logs above'
        }
        success {
            echo '✅ DevSecOps Pipeline passed cleanly! All security gates passed.'
        }
    }
}

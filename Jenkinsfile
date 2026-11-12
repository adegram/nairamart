pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 40, unit: 'MINUTES')
        buildDiscarder(logRotator(
            numToKeepStr: '20',
            artifactNumToKeepStr: '10'
        ))
    }

    environment {
        APP_NAME          = 'nairamart'
        DOCKER_REGISTRY   = 'docker.io'
        DOCKER_IMAGE      = 'adehorizon/nairamart'
        SONAR_PROJECT_KEY = 'nairamart'
        SONAR_HOST_URL    = 'http://YOUR_SONARQUBE_HOST:9000'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm

                script {
                    env.IMAGE_TAG = env.GIT_COMMIT.take(12)
                }

                echo "Building commit: ${env.GIT_COMMIT}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo 'Running ESLint...'
                sh 'npm run lint'
            }
        }

        stage('Type Check') {
            steps {
                echo 'Checking TypeScript types...'
                sh 'npm run typecheck'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        npx --yes sonar-scanner \
                          -Dsonar.projectKey=$SONAR_PROJECT_KEY \
                          -Dsonar.projectName=NairaMart \
                          -Dsonar.sources=src \
                          -Dsonar.tests=src \
                          -Dsonar.sourceEncoding=UTF-8 \
                          -Dsonar.exclusions=**/node_modules/**,**/.next/**,**/coverage/** \
                          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('SonarQube Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    script {
                        def qualityGate = waitForQualityGate()
                        if (qualityGate.status != 'OK') {
                            error "SonarQube Quality Gate failed: ${qualityGate.status}"
                        }
                    }
                }
            }
        }

        stage('Docker Build') {
            when {
                branch 'main'
            }
            steps {
                sh """
                    docker build \
                      --pull \
                      -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${IMAGE_TAG} \
                      -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest \
                      .
                """
            }
        }

        stage('Trivy Image Scan') {
            when {
                branch 'main'
            }
            steps {
                sh """
                    trivy image \
                      --exit-code 1 \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        set +x

                        echo "$DOCKER_PASSWORD" | docker login \
                          --username "$DOCKER_USER" \
                          --password-stdin

                        docker push "$DOCKER_REGISTRY/$DOCKER_IMAGE:$IMAGE_TAG"
                        docker push "$DOCKER_REGISTRY/$DOCKER_IMAGE:latest"

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'NairaMart CI/CD pipeline completed successfully.'
            echo 'All required checks passed.'
        }

        failure {
            echo 'Pipeline failed. Review the stage logs before proceeding.'
        }

        always {
            sh '''
                docker image prune -f || true
            '''
            cleanWs()
        }
    }
}

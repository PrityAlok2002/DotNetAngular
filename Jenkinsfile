pipeline {
    agent { label 'windows' }
    environment {
        DOTNET_SDK_VERSION = '8.0'
    }
    tools {
        nodejs 'NodeJS_20.13.1'
    }
    
    
    stages {

        stage('Build .NET Application') {
            steps {
                script {
                    dir('Dev') {
                        bat 'dotnet restore Epm.LGoods.sln'
                        
                        bat 'dotnet build Epm.LGoods.sln' 
                    }
                }
            }
        }

        stage('Build Angular Application') {
            steps {
                script {
                    dir('Dev/Epm.LGoods.UI/epm.lgoods.angularclient') {
                        bat 'npm install'
                        
                        bat 'npm run build' 
                    }
                }
            }
        }
        


	stage('Build React Application') {
            steps {
                script {
                    dir('Dev/Epm.LGoods.UI/epm.lgoods.reactclient') {
                        bat 'npm install'
                        
                        bat 'npm run build' 
                    }
                }
            }
        }


        stage('Running .NET Tests') {
            steps {
                script {
                    dir('Dev') {

                        bat 'FOR /R %%G IN (TestResults) DO IF EXIST "%%G" RMDIR /S /Q "%%G"'

                        bat 'dotnet test Epm.LGoods.sln --collect:"XPlat Code Coverage" -- DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format=opencover'
                    }
                }
            }
        }




        stage('Running Angular Tests') {
            steps {
                script {
                    dir('Dev/Epm.LGoods.UI/epm.lgoods.angularclient') {
                        bat 'npm test -- --code-coverage'
                    }
                }
            }
        }

        stage('Test React Application') {
            steps {
                script {
                    dir('Dev/Epm.LGoods.UI/epm.lgoods.reactclient') {
                        bat 'npm test' 
                    }
                }
            }
        }

        stage('Analyse application') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube Scanner'
                        withSonarQubeEnv('SonarHyd') {
                            bat "${scannerHome}/bin/sonar-scanner.bat"
                    }
                }
            }
        }
    }
    

     post {
        always {
            script {
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                    currentBuild.result = 'FAILURE'
                    error "Quality Gate failed: ${qg.status}"
                }
            }
        }
    }
}

node {
  stage('SCM') {
    checkout scm
    git branch: 'final_2', credentialsId: 'my-sonarqube-token', url: 'https://github.com/PhanNam1501/chat-app.git'
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarQube Scanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
      sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=chat-app -Dsonar.login=sqa_7ff44141c331a7bdfd0974f65b1726550bbb2728"
    }
  }
}
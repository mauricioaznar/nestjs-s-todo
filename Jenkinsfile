pipeline {
  agent any

  tools {nodejs "node"}

  stages {

    stage('Build') {
      steps {
        sh 'npm install'
         sh '<<Build Command>>'
      }
    }


    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }
  }
}
pipeline {
  agent any

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
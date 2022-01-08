pipeline {
  agent any

  stages {

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Migrate') {
      steps {
        sh 'npm run postgre:prod:migrate'
        sh 'npm run mongo:prod:migrate'
      }
    }

    stage('Deploy ') {
      steps {
        sh 'sudo /usr/sbin/service mau-sandbox restart'
      }
    }


  }
}
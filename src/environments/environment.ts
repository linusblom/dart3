import { version } from '../../package.json';

export const environment = {
  production: false,
  local: true,
  siteUrl: 'http://localhost:4200/',
  version,
  auto0: {
    domain: 'dart3.eu.auth0.com',
    clientId: '9wZ3rNbCqBoKuCfLK44ADhLCsGzebs4x',
    audience: 'https://stage.dart3.linusblom.io',
  },
  firebase: {
    apiKey: '<API_KEY>',
    authDomain: '<PROJECT_ID>.firebaseapp.com',
    databaseURL: 'https://<PROJECT_ID>.firebaseio.com',
    projectId: '<PROJECT_ID>',
    storageBucket: '<PROJECT_ID>.appspot.com',
    messagingSenderId: '<MESSAGE_ID>',
    appId: '<APP_ID>',
  },
};

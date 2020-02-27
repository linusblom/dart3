import { version } from '../../package.json';

export const environment = {
  production: true,
  local: false,
  siteUrl: '',
  version,
  auto0: {
    domain: '',
    clientId: '',
    audience: '',
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

import { version } from '../../package.json';

export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  dart3ApiUrl: 'http://localhost:8080/v1',
  version,
  auth0: {
    domain: 'dart3.eu.auth0.com',
    clientId: '9wZ3rNbCqBoKuCfLK44ADhLCsGzebs4x',
    audience: 'https://dart3.app',
  },
};

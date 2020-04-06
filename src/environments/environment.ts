import { version } from '../../package.json';

export const environment = {
  production: false,
  local: true,
  siteUrl: 'http://localhost:4200',
  dart3ApiUrl: 'http://localhost:8080/api/v1',
  auth0ApiUrl: 'https://dart3.eu.auth0.com/api/v2',
  version,
  auto0: {
    domain: 'dart3.eu.auth0.com',
    clientId: '9wZ3rNbCqBoKuCfLK44ADhLCsGzebs4x',
    audience: 'https://stage.dart3.linusblom.io',
  },
};

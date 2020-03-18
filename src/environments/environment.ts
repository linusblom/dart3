import { version } from '../../package.json';

export const environment = {
  production: false,
  local: true,
  siteUrl: 'http://localhost:4200/',
  apiUrl: 'http://localhost:8080/api/v1/',
  version,
  auto0: {
    domain: 'dart3.eu.auth0.com',
    clientId: '9wZ3rNbCqBoKuCfLK44ADhLCsGzebs4x',
    audience: 'https://stage.dart3.linusblom.io',
  },
};

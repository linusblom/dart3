import { version } from '../../package.json';

export const environment = {
  production: true,
  siteUrl: 'https://dart3.app',
  dart3ApiUrl: 'https://api.dart3.app/api/v1',
  version,
  auth0: {
    domain: 'dart3.eu.auth0.com',
    clientId: '9wZ3rNbCqBoKuCfLK44ADhLCsGzebs4x',
    audience: 'https://dart3.app',
  },
};

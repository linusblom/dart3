import { version } from '../../package.json';

export const environment = {
  production: true,
  local: false,
  siteUrl: '',
  dart3ApiUrl: '',
  version,
  auth0: {
    domain: 'dart3.eu.auth0.com',
    clientId: '9wZ3rNbCqBoKuCfLK44ADhLCsGzebs4x',
    audience: 'https://stage.dart3.linusblom.io',
  },
};

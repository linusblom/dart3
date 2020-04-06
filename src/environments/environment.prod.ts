import { version } from '../../package.json';

export const environment = {
  production: true,
  local: false,
  siteUrl: '',
  dart3ApiUrl: '',
  auth0ApiUrl: '',
  version,
  auto0: {
    domain: '',
    clientId: '',
    audience: '',
  },
};

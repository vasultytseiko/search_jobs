export const CORS_HOSTS = {
  development: 'http://localhost:3000',
  staging: [
    '',
    '',
  ],
  production: [
    '',
    '',
    '',
  ],
};

const CLIENT_HOSTS = {
  development: 'http://localhost:3000',
  staging: '',
  production: '',
};

export const CLIENT_HOST = CLIENT_HOSTS[process.env.NODE_ENV];

declare const require: any;

export const environment = {
  production: false,
  appName: 'Licita Web',
  home: '/painel',
  api: 'https://app-licitaweb.com.br:3001/api',
  // api: 'http://127.0.0.1:8000/api',
  version: require('../../package.json').version
};


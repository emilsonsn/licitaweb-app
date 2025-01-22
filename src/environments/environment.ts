declare const require: any;

export const environment = {
  production: false,
  appName: 'Licita Web',
  home: '/painel/home',
  // api: 'https://app-licitaweb.com.br:3001/api',
  api: 'http://127.0.0.1:8000/api',
  apiLicita: "https://app.localizadordeeditais.com.br:3001/api/public/tender/search",
  version: require('../../package.json').version
};

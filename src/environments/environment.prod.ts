declare const require: any;

export const environment = {
  production: false,
  appName: 'Licita Web',
  home: '/painel',
  api: 'https://app-licitaweb.com.br:3001/api',
  // api: 'http://127.0.0.1:8000/api',
  // api: 'https://d6f7-2804-7f7-3000-6355-f88e-ec92-60e4-9f25.ngrok-free.app/api',
  apiLicita: "https://app.localizadordeeditais.com.br:3001/api/public/tender/search",
  version: require('../../package.json').version
};

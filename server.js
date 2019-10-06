const express = require('express');
const fetch = require('node-fetch');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

const FORECAST_DELAY = 0;

const API_KEY = 'd9c10be08af503c0c64748b3c4a95076';
const BASE_URL = `https://api.darksky.net/forecast`;

// req: objeto de requisição do Express
// resp: objeto de resposta do Express

function getPrevisao(req, resp) {
  // Variáveis utilizadas na requisição
  const location = req.params.location || "-19.9023386,-44.1041379";
  const exclude = "?exclude="; //?exclude=minutely,hourly,daily,alerts,flags
  const language = "?lang=pt";
  const unit = "?units=auto";
  // URL da requisição
  const url = `${BASE_URL}/${API_KEY}/${location}/${exclude}${language}${unit}`

  // Buscar requisição e tratamento de erro, caso houver, da resposta
  fetch(url).then((resp) => {    
    if (resp.status !== 200) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  }).then((data) => {
    setTimeout(() => {
      resp.json(data);
    }, FORECAST_DELAY);
  }).catch((err) => {
    console.error('Erro API Dark Sky:', err.message);
  });
}

// Instância do Express Server
function startServer() {
  const app = express();

  // Redirecionar HTTP para HTTPS,
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

  // Requisições para os dados
  app.get('/forecast/:location', getPrevisao);
  app.get('/forecast/', getPrevisao);
  app.get('/forecast', getPrevisao);

  // Requisições para os arquivos estáticos
  app.use(express.static('public'));
  
  // Porta criada pelo Heroku ou porta local
  var porta = process.env.PORT || 8000;
  // Start the server
  return app.listen(porta);
    
  // Heroku não aceita a requisição abaixo, comentada somente para uso local
  // return app.listen('8000', () => {
  //   // eslint-disable-next-line no-console
  //   console.log('Servidor local iniciado na porta ' + porta + '...');
  // });
}

startServer();

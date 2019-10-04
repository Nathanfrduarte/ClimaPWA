
const express = require('express');
const fetch = require('node-fetch');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

// CODELAB: Change this to add a delay (ms) before the server responds.
const FORECAST_DELAY = 0;

// const API_KEY = process.env.DARKSKY_API_KEY;
const API_KEY = 'd9c10be08af503c0c64748b3c4a95076';
const BASE_URL = `https://api.darksky.net/forecast`;

/**
 * Generates a fake forecast in case the weather API is not available.
 *
 * @param {String} location GPS location to use.
 * @return {Object} forecast object.
 *
 * Gets the weather forecast from the Dark Sky API for the given location.
 *
 * @param {Request} req request object from Express.
 * @param {Response} resp response object from Express.
 */


function getForecast(req, resp) {
  // u = document.getElementById('userLocation').value;
  const location = req.params.location || "-19.9023386,-44.1041379";
  const exclude = "?exclude="; //?exclude=minutely,hourly,daily,alerts,flags
  const language = "?lang=pt";
  const unit = "?units=auto";
  
  const url = `${BASE_URL}/${API_KEY}/${location}/${exclude}${language}${unit}`

  // https://api.darksky.net/forecast/d9c10be08af503c0c64748b3c4a95076/-18.5142135,-49.9495219?exclude=minutely,hourly,daily,alerts,flags?lang=pt?units=auto
  // Betim: -19.9417305,-44.332391
  // C = (F-32) /1,8

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
    console.error('Dark Sky API Error:', err.message);
    // resp.json(generateFakeForecast(location));
  });
}

/**
 * Starts the Express server.
 *
 * @return {ExpressServer} instance of the Express server.
 */
function startServer() {
  const app = express();

  // Redirect HTTP to HTTPS,
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

  // Logging for each request
  app.use((req, resp, next) => {
    const now = new Date();
    const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    const path = `"${req.method} ${req.path}"`;
    const m = `${req.ip} - ${time} - ${path}`;
    // eslint-disable-next-line no-console
    console.log(m);
    next();
  });

  // Handle requests for the data
  app.get('/forecast/:location', getForecast);
  app.get('/forecast/', getForecast);
  app.get('/forecast', getForecast);

  // Handle requests for static files
  app.use(express.static('public'));
  
  var porta = process.env.PORT || 8000;
  
  // return app.listen(porta);
  // Start the server
  return app.listen('8000', () => {
    // eslint-disable-next-line no-console
    console.log('Servidor local iniciado na porta ' + porta + '...');
  });
}

startServer();

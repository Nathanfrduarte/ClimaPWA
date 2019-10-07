function init() {

  getLocalizacao();
  climaApp.locaisSelecionados = carregarListaLocalizacao();
  // Atualizar lista de localizações
  updateDados();
  // Eventos para os botões
  document.getElementById('butRefresh').addEventListener('click', updateDados);
  document.getElementById('butAdd').addEventListener('click', mostrarAddDialog);
  document.getElementById('butDialogCancel').addEventListener('click', mostrarAddDialog);
  document.getElementById('butDialogAdd').addEventListener('click', addLocalizacao);  
}

// Permitir Localização atual
function getLocalizacao() {
  // Verificar se o navegador tem suporte para geoocalização
  if (!navigator.geolocation) {
    alert("Esse navegador não tem suporte para localização");
  } else {
    // PopUp para aceitar localização
    navigator.geolocation.getCurrentPosition(mostrarPosicao, error);

    function mostrarPosicao(position) {
      user_lat = position.coords.latitude;
      user_long = position.coords.longitude;
      document.getElementById('userLocation').value = user_lat + "," + user_long;  
    }

    function error() {
      alert("Erro: Permita sua localização para um melhor funcionamento");
    }
  }
}

const climaApp = {
  locaisSelecionados: {},
  addDialogContainer: document.getElementById('addDialogContainer'),
};

// Exibição da caixa de adição de novo clima
function mostrarAddDialog() {
  climaApp.addDialogContainer.classList.toggle('visible');
}

function addLocalizacao() {
  // Exibir
  mostrarAddDialog();

  // Pegar a capital selecionada
  const select = document.getElementById('selectCityToAdd');
  const selected = select.options[select.selectedIndex];
  const geo = selected.value;
  const label = selected.textContent;
  const location = { label: label, geo: geo };
  // Criar novo cartão e requisitar informação de clima
  const card = getCardClima(location);
  getAtualizacaoClima(geo).then((forecast) => {
    carregarClima(card, forecast);
  });
  // Salva a lista atualizada
  climaApp.locaisSelecionados[geo] = location;
  salvarListaLocalizacao(climaApp.locaisSelecionados);
}

// Função para remover card
function removerLocalizacao(evt) {
  const parent = evt.srcElement.parentElement;
  parent.remove();
  if (climaApp.locaisSelecionados[parent.id]) {
    delete climaApp.locaisSelecionados[parent.id];
    salvarListaLocalizacao(climaApp.locaisSelecionados);
  }
}

// Função para processar as informações do clima
function carregarClima(card, data) {
  // Achar última atualização
  const cardLastUpdatedElem = card.querySelector('.card-last-updated');
  const cardLastUpdated = cardLastUpdatedElem.textContent;
  const lastUpdated = parseInt(cardLastUpdated);

  // Se é novo, pula a atualização
  if (lastUpdated >= data.currently.time) {
    return;
  }
  cardLastUpdatedElem.textContent = data.currently.time;

  // Carrega a previsão no cartão
  card.querySelector('.description').textContent = data.currently.summary;
  const forecastFrom = luxon.DateTime
    .fromSeconds(data.currently.time)
    .setZone(data.timezone)
    .toFormat('DDDD t');
  card.querySelector('.date').textContent = forecastFrom;
  card.querySelector('.current .icon').className = `icon ${data.currently.icon}`;
  // Conversão de Fahrenheit para Celcius
  card.querySelector('.current .temperature .value').textContent = Math.round((data.currently.temperature-32)/1.8);
  card.querySelector('.current .humidity .value').textContent = Math.round(data.currently.humidity * 100);
  card.querySelector('.current .wind .value').textContent = Math.round(data.currently.windSpeed);
  // Formatação da data e hora com a biblioteca Luxon
  const sunrise = luxon.DateTime
    .fromSeconds(data.daily.data[0].sunriseTime)
    .setZone(data.timezone)
    .toFormat('t');
  card.querySelector('.current .sunrise .value').textContent = sunrise;
  const sunset = luxon.DateTime
    .fromSeconds(data.daily.data[0].sunsetTime)
    .setZone(data.timezone)
    .toFormat('t');
  card.querySelector('.current .sunset .value').textContent = sunset;

  // Próximos 7 dias
  const futureTiles = card.querySelectorAll('.future .oneday');
  futureTiles.forEach((tile, index) => {
    const forecast = data.daily.data[index + 1];
    const forecastFor = luxon.DateTime
      .fromSeconds(forecast.time)
      .setZone(data.timezone)
      .toFormat('ccc');
    tile.querySelector('.date').textContent = forecastFor;
    tile.querySelector('.icon').className = `icon ${forecast.icon}`;
    tile.querySelector('.temp-high .value').textContent = Math.round((forecast.temperatureHigh-32)/1.8);
    tile.querySelector('.temp-low .value').textContent = Math.round((forecast.temperatureLow-32)/1.8);
  });

  // Remover icone de "carregando"
  const spinner = card.querySelector('.card-spinner');
  if (spinner) {
    card.removeChild(spinner);
  }
}

// Últimas atualizações de clima
function getAtualizacaoClima(coords) {
  return fetch(`/forecast/${coords}`)
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      return null;
    });
}

// Função para pegar informações do cache
function getClimaCache(coords) {
  if (!('caches' in window)) {
    return null;
  }
  const url = `${window.location.origin}/forecast/${coords}`;
  return caches.match(url)
    .then((response) => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch((err) => {
      console.error('Erro ao pegar dados em cache', err);
      return null;
    });
}

// Função para pegar as informações do Card ou então clonar o modelo do cartão
function getCardClima(location) {
  const id = location.geo;
  const card = document.getElementById(id);
  if (card) {
    return card;
  }
  const novoCard = document.getElementById('weather-template').cloneNode(true);
  novoCard.querySelector('.location').textContent = location.label;
  novoCard.setAttribute('id', id);
  novoCard.querySelector('.remove-city').addEventListener('click', removerLocalizacao);
  document.querySelector('main').appendChild(novoCard);
  novoCard.removeAttribute('hidden');
  return novoCard;
}

// Pega os dados pais recentes
function updateDados() {
  Object.keys(climaApp.locaisSelecionados).forEach((key) => {
    const location = climaApp.locaisSelecionados[key];
    const card = getCardClima(location);

    getClimaCache(location.geo)
      .then((forecast) => {
        carregarClima(card, forecast);
      });

    getAtualizacaoClima(location.geo)
      .then((forecast) => {
        carregarClima(card, forecast);
      });
  });  
}

// Salvar localização(ões) na API Web Storage
function salvarListaLocalizacao(locations) {
  const data = JSON.stringify(locations);
  localStorage.setItem('locationList', data);
}

// Carregar localização(ões) salvas na API Web Storage
function carregarListaLocalizacao() {
  let locations = localStorage.getItem('locationList');
  if (locations) {
    try {
      locations = JSON.parse(locations);
    } catch (ex) {
      locations = {};
    }
  }
  if (!locations || Object.keys(locations).length === 0) {
    const key = "-19.9023386,-44.1041379";
    locations = {};
    locations[key] = { label: 'Belo Horizonte', geo: "-19.9023386,-44.1041379" };
  }
  return locations;
}

init();

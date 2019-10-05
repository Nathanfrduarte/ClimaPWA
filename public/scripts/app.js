/**
 * Initialize the app, gets the list of locations from local storage, then
 * renders the initial data.
 */

function init() {

  getLocalizacao();
  weatherApp.selectedLocations = loadLocationList();
  // Get the location list, and update the UI.
  updateData();

  // Set up the event handlers for all of the buttons.
  document.getElementById('butRefresh').addEventListener('click', updateData);
  document.getElementById('butAdd').addEventListener('click', toggleAddDialog);
  document.getElementById('butDialogCancel').addEventListener('click', toggleAddDialog);
  document.getElementById('butDialogAdd').addEventListener('click', addLocation);  
}

// Permitir Localização atual
function getLocalizacao() {
  // Verificar se o navegador tem suporte para geoocalização
  if (!navigator.geolocation) {
    alert("Esse navegador não tem suporte para localização");
  } else {
    //This will make appear a pop up asking for permission 
    navigator.geolocation.getCurrentPosition(showPosition, error);
    //In case the permission is granted 
    function showPosition(position) {
      user_lat = position.coords.latitude;
      user_long = position.coords.longitude;
      document.getElementById('userLocation').value = user_lat + "," + user_long;  
    }
    //In case the permission is denied 
    function error() {
      alert("Erro: Permita sua localização para um melhor funcionamento");
    }
  }
}

const weatherApp = {
  selectedLocations: {},
  addDialogContainer: document.getElementById('addDialogContainer'),
};

/**
 * Toggles the visibility of the add location dialog box.
 */
function toggleAddDialog() {
  weatherApp.addDialogContainer.classList.toggle('visible');
}

/**
 * Event handler for butDialogAdd, adds the selected location to the list.
 */
function addLocation() {
  // Hide the dialog
  toggleAddDialog();

  // Get the selected city
  const select = document.getElementById('selectCityToAdd');
  const selected = select.options[select.selectedIndex];
  const geo = selected.value;
  const label = selected.textContent;
  const location = { label: label, geo: geo };
  // Create a new card & get the weather data from the server
  const card = getForecastCard(location);
  getForecastFromNetwork(geo).then((forecast) => {
    renderForecast(card, forecast);
  });
  // Save the updated list of selected cities.
  weatherApp.selectedLocations[geo] = location;
  saveLocationList(weatherApp.selectedLocations);
}

/**
 * Event handler for .remove-city, removes a location from the list.
 *
 * @param {Event} evt
 */
function removeLocation(evt) {
  const parent = evt.srcElement.parentElement;
  parent.remove();
  if (weatherApp.selectedLocations[parent.id]) {
    delete weatherApp.selectedLocations[parent.id];
    saveLocationList(weatherApp.selectedLocations);
  }
}

/**
 * Renders the forecast data into the card element.
 *
 * @param {Element} card The card element to update.
 * @param {Object} data Weather forecast data to update the element with.
 */
function renderForecast(card, data) {
  // Find out when the element was last updated.
  const cardLastUpdatedElem = card.querySelector('.card-last-updated');
  const cardLastUpdated = cardLastUpdatedElem.textContent;
  const lastUpdated = parseInt(cardLastUpdated);

  // If the data on the element is newer, skip the update.
  if (lastUpdated >= data.currently.time) {
    return;
  }
  cardLastUpdatedElem.textContent = data.currently.time;

  // Render the forecast data into the card.
  card.querySelector('.description').textContent = data.currently.summary;
  const forecastFrom = luxon.DateTime
    .fromSeconds(data.currently.time)
    .setZone(data.timezone)
    .toFormat('DDDD t');
  card.querySelector('.date').textContent = forecastFrom;
  card.querySelector('.current .icon').className = `icon ${data.currently.icon}`;
  card.querySelector('.current .temperature .value').textContent = Math.round((data.currently.temperature-32)/1.8);
  card.querySelector('.current .humidity .value').textContent = Math.round(data.currently.humidity * 100);
  card.querySelector('.current .wind .value').textContent = Math.round(data.currently.windSpeed);
  // card.querySelector('.current .wind .direction').textContent = Math.round(data.currently.windBearing);
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

  // Render the next 7 days.
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

  // If the loading spinner is still visible, remove it.
  const spinner = card.querySelector('.card-spinner');
  if (spinner) {
    card.removeChild(spinner);
  }
}

/**
 * Get's the latest forecast data from the network.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getForecastFromNetwork(coords) {
  return fetch(`/forecast/${coords}`)
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      return null;
    });
}

/**
 * Get's the cached forecast data from the caches object.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getForecastFromCache(coords) {
  // CODELAB: Add code to get weather forecast from the caches object.
  // CODELAB: Add code to get weather forecast from the caches object.
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
      console.error('Error getting data from cache', err);
      return null;
    });
}

/**
 * Get's the HTML element for the weather forecast, or clones the template
 * and adds it to the DOM if we're adding a new item.
 *
 * @param {Object} location Location object
 * @return {Element} The element for the weather forecast.
 */
function getForecastCard(location) {
  const id = location.geo;
  const card = document.getElementById(id);
  if (card) {
    return card;
  }
  const newCard = document.getElementById('weather-template').cloneNode(true);
  newCard.querySelector('.location').textContent = location.label;
  newCard.setAttribute('id', id);
  newCard.querySelector('.remove-city').addEventListener('click', removeLocation);
  document.querySelector('main').appendChild(newCard);
  newCard.removeAttribute('hidden');
  return newCard;
}

/**
 * Gets the latest weather forecast data and updates each card with the
 * new data.
 */
function updateData() {
  Object.keys(weatherApp.selectedLocations).forEach((key) => {
    const location = weatherApp.selectedLocations[key];
    const card = getForecastCard(location);
    // CODELAB: Add code to call getForecastFromCache
    getForecastFromCache(location.geo)
      .then((forecast) => {
        renderForecast(card, forecast);
      });
    // Get the forecast data from the network.
    getForecastFromNetwork(location.geo)
      .then((forecast) => {
        renderForecast(card, forecast);
      });
  });  
}

/**
 * Saves the list of locations.
 *
 * @param {Object} locations The list of locations to save.
 */
function saveLocationList(locations) {
  const data = JSON.stringify(locations);
  localStorage.setItem('locationList', data);
}

/**
 * Loads the list of saved location.
 *
 * @return {Array}
 */
function loadLocationList() {
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

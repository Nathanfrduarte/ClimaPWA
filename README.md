# Clima PWA

O objetivo desta atividade foi experimentar a construção de uma aplicação web progressiva.

A seguinte aplicação pode ser acesssada em: https://climapwa.herokuapp.com

## Descrição da aplicação

Trata-se de uma aplicação web progressiva meteorológica, com design responsivo.
Nela é possível consultar informações climáticas de algumas capitais do Brasil, como a temperatura atual, umidade, velocidade do vento e os horários de amanhecer e anoitecer do dia, de acordo com a localização. 

É informado também as temperaturas máximas e mínimas dos próximos 7 dias, e de acordo com a imagem mostrada, é possível identificar se irão ser chuvosos ou ensolarados.

## Requisitos

* R01 - Conter pelo menos duas páginas HTML, formatadas adequadamente para smartphones por meio da CSS;
* R02 - Usar armazenamento local de dados, por meio da API Web Storage ou da API IndexedDB, considerando:
  * R02.1 - Os dados armazenados devem ser específicos do usuário (determinados automaticamente ou informados por meio de um formulário);
  * R02.2 - Os dados armazenados devem ser usados em alguma funcionalidade da aplicação (mesmo que apenas a apresentação em alguma pagina);
* R03 - A aplicação deve possuir um manifesto que permita a instalação na tela inicial dos dispositivos dos usuários;
* R04 - A aplicação deve possuir um service worker que:
  * R04.1 - Implemente corretamente a instalação e a ativação da aplicação;
  * R04.2 - Permita o funcionamento offline da aplicação

## Atendimento aos requisitos

* R01 - Há duas páginas HTML na aplicação. Uma delas sendo a página principal (Climas), que contém as informações meteorológicas, e a outra página com informações dos alunos que fizeram (Sobre), como nomes, redes sociais, dentre outras. Todas elas formatadas adequadamente em CSS utilizando técnicas de design responsivo para uso em desktops e mobile, para que se tenha a experiência de aplicativo como uma pwa propõe.
* R02 - Há o uso do armazenamento local dos dados através da API Web Storage.
  * R02.1 - É armazenado um dado específico do usuário, que é a sua localização. Ela é coletada automaticamente a partir de quando o usuário permite o uso da localização do dispoditivo de uso.
  * R02.2 - Com o dado da localização armazenado em uma lista, é possível utilizá-lo na página de climas para saber informações meteorológicas da posição atual do usuário.

```javascript
// Salvar localização(ões) na API Web Storage
function saveLocationList(locations) {
  const data = JSON.stringify(locations);
  localStorage.setItem('locationList', data);
}

// Carregar localização(ões) salvas
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
```

* R03 - A aplicação possui um manifesto (manifest.webmanifest) referenciado nas páginas e devidamente formatado e com todos os conjunto de informações sobre a necessário para o correto funcionamento e instalação.Worker devidamente devidamente implementado na aplicação. Onde estão localizados em um arquivo separado (service-worker.js) somente para suas funções.

Referência ao manifesto:

```html
<link rel="manifest" href="manifest.webmanifest">
```

Manifesto:

```json
{
  "name": "clima pwa",
  "short_name": "pwa",
  "start_url": "/index.html",
  "display": "standalone",
  "description": "construção de uma aplicação web progressiva para fins acadêmicos.",
  "background_color": "#111",
  "theme_color": "#3499eb",
  "icons": [{
    "src": "/images/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    }, {
      "src": "/images/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    }, {
      "src": "/images/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    }, {
      "src": "/images/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }, {
      "src": "/images/icons/icon-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    }, {
      "src": "/images/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }]
}
```

   * R04.1 - O service worker é capaz de se instalar, ficando pronto para ser executado e de ativar, deixando o código pronto para uso.
   * R04.2 - O service worker também permite o funcionamento offline da aplicação, já que recurera os recursos salvos em cache.

```javascript
// Instalar Service Worker
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Instalado');
  // Capturar cache existente
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Capturando cache existente');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Ativado');
  // Remover cache antigo
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removendo cache antigo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});
```
## API Utilizada

[Dark Sky API](https://darksky.net/dev)

## Necessário:

* Instalar NodeJs

## Rodar projeto:

```bash
npm install
node server.js
```
Acessar http://localhost:8080 em uma guia do browser

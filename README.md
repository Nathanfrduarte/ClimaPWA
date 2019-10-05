# Clima PWA

O objetivo desta atividade foi experimentar a construção de uma aplicação web progressiva.

## Descrição da aplicacão

Trata-se de uma aplicação web progressiva meteorológica, com design responsivo.

Nela é possível consultar informações climáticas de algumas capitais do Brasil, como a temperatura atual, humidade, velocidade do vento e os horários de amanhecer e anoitecer do dia, de acordo com a localização. 

É informado também as termperaturas máximas e mínimas dos próximos 7 dias, e de acordo com a imagem mostrada, é possível identificar se irão ser chuvosos ou ensolarados.

## Requisitos

* R01 - Conter pelo menos duas páginas HTML, formatadas adequadamente para smartphones por meio da CSS;
* R02 - Usar armazenamento local de dados, por meio da API Web Storage ou da API IndexedDB, considerando:
  * R02.1 - Os dados armazenados devem ser específicos do usuário (determinados automaticamente ou informados por meio de um formulário);
  * R02.2 - Os dados armazenados devem ser usados em alguma funcionalidade da aplicação (mesmo que apenas a apresentação em alguma pagina);
* R03 - A aplicação deve possuir um manifesto que permita a instalação na tela inicial dos dispositivos dos usuários;
* R04 - A aplicação deve possuir um service worker que:
* R05 - Implemente corretamente a instalação e a ativação da aplicação;
* R06 - Permita o funcionamento offline da aplicação

## Atendimento aos requisitos

* R01 - Há duas páginas HTML na aplicação. Uma delas sendo a página principal, que contém as informações meteorológicas, e a outra página com informações dos alunos que fizeram, como nomes, redes sociais, dentre outras. Todas elas formatadas adequadamente 
* R02 - 
  * R02.1 - 
  * R02.2 - 
* R03 - 
* R04 - 
* R05 - 

## Grupo

* Ana Luiza Pires Barbosa
* José Larajeiras Junior
* Maicon Wesleandro Souza
* Nathan de Freitas Duarte

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
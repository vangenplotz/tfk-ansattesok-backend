[![Build Status](https://travis-ci.org/vangenplotz/tfk-ansattesok-backend.svg?branch=master)](https://travis-ci.org/vangenplotz/tfk-ansattesok-backend)
[![Greenkeeper badge](https://badges.greenkeeper.io/vangenplotz/tfk-ansattesok-backend.svg)](https://greenkeeper.io/)

# Telemark Fylkeskommune, API
###### Relaterte prosjekter
[https://github.com/vangenplotz/tfk-ansattesok-frontend](https://github.com/vangenplotz/tfk-ansattesok-frontend)

## Utvikling
### Informasjon
Med mindre annet er spesifisert forventes det at alle terminal-kommandoer kjøres fra roten av prosjektet.

### Forutsetninger
For å kunne utvikle løsningen forventes det at man har [Docker](https://docker.com) og [Docker Compose](https://docs.docker.com/compose/) installert.

Det forventes at man har en `.env` fil i roten av prosjektet med følgende innhold:

```
COMPOSE_PROJECT_NAME=telemark
ELASTICSEARCH_URL=http://elastic:changeme@elasticsearch:9200
```

### Installasjon
Kjør `$ docker-compose build` i terminalen for å bygge image(s).

**MERK!** Dersom du endrer dependencies i `package.json` må du rebuilde container image(s).

### Starte applikasjonen

Kjør `$ docker-compose up` i terminalen for å starte applikasjonen.

### Data

For å fylle Elasticsearch med data fra `data/ansatte.json`, kjør:

`$ docker-compose -p telemark exec api yarn es:seed`

For å fjerne data fra Elasticsearch, kjør:

`$ docker-compose -p telemark exec api yarn es:clean`

### API Docs
API docs er tilgjengelig på endepunktet `/documentation`
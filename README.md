[![Build Status](https://travis-ci.org/vangenplotz/tfk-ansattesok-backend.svg?branch=master)](https://travis-ci.org/vangenplotz/tfk-ansattesok-backend)
# Telemark Fylkeskommune, API

## Development
### Info
Unless stated otherwise, all terminal commands are expected to be executed from the project root.

## Prerequisites
You must have Docker and Docker-Compose installed.

You must create a file called `.env` in the root directory with the following content

```
ELASTICSEARCH_URL=http://elastic:changeme@elasticsearch:9200
```

### Installation

Run `$ docker-compose -p telemark build` in your terminal to build the images.

**Note!** If you change dependencies in `package.json` you will need to rebuild the container images.

### Running the application

Run `$ docker-compose -p telemark up` in your terminal to start the application.

### Data

To fill Elasticsearch with data, run:
`$ docker-compose -p telemark exec api yarn es:seed`

To clean Elasticsearch, run:

`$ docker-compose -p telemark exec api yarn es:clean`
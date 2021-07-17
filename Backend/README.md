# Backend-Microservice

Libraries and Packages Used:
* **[Moleculer]()** - Microservice Framework
* **[Express]()** - As API gateway
* **[moleculer-db-adapter-mongoose]()** - MongoDB adapter for moleculer-db
* **[amqplib]()** - Transporter connection (rabbitmq)
* **[mongoose]()** - For Schema definition
* **[axios]()** - Making HTTP requests

## Installation

#### 1. Clone this repo

```
$ git clone git@github.com:umangraval/dyte-tasks-2022.git your-app-name
$ cd your-app-name
```

#### 2. Install dependencies

```
$ npm i
```

## Environment
To edit environment variables, create a file with name `.env` and copy the contents from `example.env` to start with.

| Var Name  | Type  | Default | Description  |
|---|---|---|---|
| SERVICEDIR  | string  | `services` | Folder of services |
|  PORT | number  | `3000` | Port to run the API server on |
|  MONGO_URL | string  | `mongodb://mongo/webhooks-doc` | URL for MongoDB |
|  TRANSPORTER  | string | `amqp://rabbitmq:5672` | URL for broker |

## Development

### Start dev server
Starting the dev server also starts MongoDB as a service in a docker container using the compose script at `docker-compose.yml`.

```
$ npm run dev
```

#### or Run with docker-compose

```
$ docker-compose up
```

Running the above commands results in 
* 🌏 **API Server** running at `http://localhost:3000`
* ⛁ **MongoDB** running at `mongodb://mongo/webhooks-doc`


---


### Directory Structure

```
+-- config
|   +-- config.js (secrets)
+-- mixins
|   +-- db.mixins.js (DB config and connection)
+-- models
|   +-- webhook.model.js (schema for webhook)
+-- services
|   +-- gateway.service.js (backend/ api gateway)
|   +-- webhook.service.js (webhook service)
+-- util
|   +-- API.js (axios config)
+-- moleculer.config.js (service settings)
+-- .env
+-- example.env
+-- .gitignore
+-- docker-compose.yml
+-- Dockerfile
+-- README.md
```
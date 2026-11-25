# Bike Garage – 3-tier web app

React frontend → Express API → MongoDB. Browse, search, add, edit and delete bikes,
including their description, image and specifications.


```
.
├── frontend/          React (Vite) app, served by nginx in Docker
│   ├── src/           App.jsx, api.js, components/
│   ├── public/images/ bundled bike images (classic.svg, sport.svg, adventure.svg)
│   ├── nginx.conf     serves the SPA and proxies /api → backend:5000
│   └── Dockerfile     multi-stage: node:22 build → nginx-unprivileged (alpine)
├── backend/           Express + Mongoose REST API
│   ├── src/           server.js, db.js, models/Bike.js, routes/bikes.js
│   └── Dockerfile     multi-stage: prod deps → node:22-alpine runtime (non-root)
├── mongodb/
│   ├── mongod.conf    MongoDB server config (auth enabled)
│   ├── init-mongo.js  creates the app user + seeds 3 sample bikes (first run only)
│   └── Dockerfile     multi-stage: alpine prep (CRLF fix) → mongo:7.0-jammy
└── docker-compose.yml
```

## Run with Docker

```bash
docker compose up --build
```

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:3000            |
| API      | http://localhost:5001/api/bikes  |
| MongoDB  | mongodb://localhost:27017        |

Credentials and host ports default to the values in `.env.example`; copy it to `.env` to change them.
The backend is published on host port **5001** (inside Docker it still listens on 5000), because 5000 is often already in use.
The seed script only runs when the `mongo-data` volume is empty. To reset the database:
`docker compose down -v`.

## Run locally (without Docker)

Needs a MongoDB with the `bikeapp` user (easiest: `docker compose up -d mongodb`).

```bash
cd backend  && npm install && npm run dev     # http://localhost:5000
cd frontend && npm install && npm run dev     # http://localhost:3000 (proxies /api)
```

## API

| Method | Path                     | Description                              |
|--------|--------------------------|------------------------------------------|
| GET    | `/api/bikes?search=text` | List bikes (search name/brand/category)  |
| GET    | `/api/bikes/:id`         | Get one bike                             |
| POST   | `/api/bikes`             | Add a bike                               |
| PUT    | `/api/bikes/:id`         | Update a bike                            |
| DELETE | `/api/bikes/:id`         | Delete a bike                            |
| GET    | `/api/health`            | Health check (includes DB status)        |

Bike document:

```json
{
  "name": "Interceptor 650",
  "brand": "Royal Enfield",
  "category": "Classic",
  "price": 303000,
  "description": "…",
  "image": "classic.svg",
  "specs": {
    "engine": "648 cc", "power": "47 hp", "torque": "52 Nm", "weight": "218 kg",
    "topSpeed": "165 km/h", "mileage": "25 km/l", "transmission": "6-speed"
  }
}
```

`image` can be a file name from `frontend/public/images/` or any full image URL.

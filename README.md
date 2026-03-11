# Weather API

A simple REST API that returns the current temperature for any given US ZIP code.

## Tech Stack

- **Node.js**: 18+ (uses built-in `fetch`)
- **Typescript**: Express
- **Framework**: Express
- **Weather data**: [Open-Meteo](https://open-meteo.com/) — free, no API key needed
- **Geocoding**: [Zippopotam.us](https://www.zippopotam.us/) — free, no API key needed
- **Testing**: Jest + Supertest

## Getting Started

```bash
npm install
npm start
```

Server will run at `http://localhost:8080`.

## API Endpoints

### GET /locations/{zip-code}

Returns the current temperature for the given US ZIP code.

**Query Parameters**

| Parameter | Values                  | Default       |
|-----------|-------------------------|---------------|
| `scale`   | `Fahrenheit`, `Celsius` | `Fahrenheit`  |

**Examples**

```
GET /locations/24060
→ { "temperature": 43, "scale": "Fahrenheit" }

GET /locations/90210?scale=Celsius
→ { "temperature": 25, "scale": "Celsius" }
```

**Error Responses**

| Status | Reason                          |
|--------|---------------------------------|
| 400    | Invalid ZIP code or scale value |
| 404    | ZIP code not found              |
| 500    | Upstream service failure        |

### GET /health

will return `{ "status": "ok" }`

## Testing

```bash
npm test
```
Testing the APIs so that they work properly and testing it under offline to see if they work as well.

## Notes

- I pick both Open-Meteo and Zippopotam.us becaue they are fully free and require no registration, making the project immediately runnable by anyone.
- The app uses a createApp() factory so the Express app can be tested without spinning up a real server. Geocoding and weather are in separate service files so either can be swapped out independently.
- Geocoding and weather logic are isolated in `src/services/` making them easy to swap (e.g. replace Open-Meteo with OpenWeatherMap) without touching route logic.
- Temperatures are rounded to the nearest integer to match real-world weather UX expectations.

## Potential Improvements

- Rate limiting (e.g. `express-rate-limit`) to prevent abuse
- Response caching (e.g. 10-minute TTL) to reduce upstream API calls
- Support for international postal codes

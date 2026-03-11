import { Scale } from '../types';

/**
 * Fetches the current temperature for given coordinates using Open-Meteo API.
 * Free, no API key required.
 */
export async function getCurrentTemperature(
  lat: number,
  lon: number,
  scale: Scale,
): Promise<number> {
  const unit = scale === 'Celsius' ? 'celsius' : 'fahrenheit';
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat.toString());
  url.searchParams.set('longitude', lon.toString());
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('temperature_unit', unit);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather service error: ${response.status}`);
  }

  const data = await response.json();
  return Math.round(data.current_weather.temperature);
}

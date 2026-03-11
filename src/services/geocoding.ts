import { LocationData } from '../types';

/**
 * Converts a US ZIP code to geographic coordinates using the Zippopotam.us API.
 */
export async function getLocationByZip(zipCode: string): Promise<LocationData> {
  const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

  if (response.status === 404) {
    throw new Error(`ZIP code ${zipCode} not found`);
  }

  if (!response.ok) {
    throw new Error(`Geocoding service error: ${response.status}`);
  }

  const data = await response.json();
  const place = data.places[0];

  return {
    lat: parseFloat(place.latitude),
    lon: parseFloat(place.longitude),
    city: place['place name'],
    state: place['state abbreviation'],
  };
}

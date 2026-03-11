export type Scale = 'Fahrenheit' | 'Celsius';

export interface WeatherResponse {
  temperature: number;
  scale: Scale;
}

export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  state: string;
}

/// <reference types="jest" />
/**
 * Claude help write some test cases here for better managing the test. 
 */
import supertest from 'supertest';
import { createApp } from '../src/server';
import { getLocationByZip } from '../src/services/geocoding';
import { getCurrentTemperature } from '../src/services/weather';

jest.mock('../src/services/geocoding');
jest.mock('../src/services/weather');

const mockGetLocationByZip = getLocationByZip as jest.MockedFunction<typeof getLocationByZip>;
const mockGetCurrentTemperature = getCurrentTemperature as jest.MockedFunction<typeof getCurrentTemperature>;

const request = supertest(createApp());

const mockLocation = { lat: 37.2296, lon: -80.4139, city: 'Blacksburg', state: 'VA' };

describe('GET /locations/:zipCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLocationByZip.mockResolvedValue(mockLocation);
  });

  describe('successful responses', () => {
    it('returns temperature in Fahrenheit by default', async () => {
      mockGetCurrentTemperature.mockResolvedValue(43);

      const res = await request.get('/locations/24060');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ temperature: 43, scale: 'Fahrenheit' });
      expect(mockGetLocationByZip).toHaveBeenCalledWith('24060');
      expect(mockGetCurrentTemperature).toHaveBeenCalledWith(37.2296, -80.4139, 'Fahrenheit');
    });

    it('returns temperature in Celsius when ?scale=Celsius', async () => {
      mockGetCurrentTemperature.mockResolvedValue(6);

      const res = await request.get('/locations/24060?scale=Celsius');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ temperature: 6, scale: 'Celsius' });
      expect(mockGetCurrentTemperature).toHaveBeenCalledWith(37.2296, -80.4139, 'Celsius');
    });

    it('returns temperature in Fahrenheit when ?scale=Fahrenheit', async () => {
      mockGetCurrentTemperature.mockResolvedValue(43);

      const res = await request.get('/locations/24060?scale=Fahrenheit');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ temperature: 43, scale: 'Fahrenheit' });
    });
  });

  describe('input validation', () => {
    it('returns 400 for non-numeric ZIP code', async () => {
      const res = await request.get('/locations/abcde');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for ZIP code shorter than 5 digits', async () => {
      const res = await request.get('/locations/1234');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for ZIP code longer than 5 digits', async () => {
      const res = await request.get('/locations/123456');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for invalid scale value', async () => {
      const res = await request.get('/locations/24060?scale=Kelvin');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('error handling', () => {
    it('returns 404 when ZIP code is not found', async () => {
      mockGetLocationByZip.mockRejectedValue(new Error('ZIP code 00000 not found'));

      const res = await request.get('/locations/00000');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 500 when weather service fails', async () => {
      mockGetCurrentTemperature.mockRejectedValue(new Error('Weather service error: 503'));

      const res = await request.get('/locations/24060');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('health check', () => {
    it('GET /health returns 200', async () => {
      const res = await request.get('/health');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });
});

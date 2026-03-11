import { Router, Request, Response } from 'express';
import { getLocationByZip } from '../services/geocoding';
import { getCurrentTemperature } from '../services/weather';
import { Scale } from '../types';

const router = Router();
/**
 * Used claude for help to get started for the api handling and communication with the server.
 */
router.get('/:zipCode', async (req: Request, res: Response) => {
  const { zipCode } = req.params;
  const scaleParam = req.query.scale as string | undefined;

  if (!/^\d{5}$/.test(zipCode)) {
    return res.status(400).json({ error: 'Invalid ZIP code. Must be exactly 5 digits.' });
  }

  let scale: Scale = 'Fahrenheit';
  if (scaleParam !== undefined) {
    if (scaleParam !== 'Fahrenheit' && scaleParam !== 'Celsius') {
      return res.status(400).json({ error: 'Invalid scale. Must be "Fahrenheit" or "Celsius".' });
    }
    scale = scaleParam;
  }
/**
 * Handles GET requests to /locations/:zipCode. Validates input, retrieves location data, and returns current temperature.
 */
  try {
    const location = await getLocationByZip(zipCode);
    const temperature = await getCurrentTemperature(location.lat, location.lon, scale);
    return res.status(200).json({ temperature, scale });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to retrieve weather data.' });
  }
});

export default router;

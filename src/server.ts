import express from 'express';
import locationsRouter from './routes/locations';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/locations', locationsRouter);

  return app;
}

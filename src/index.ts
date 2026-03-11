import { createApp } from './server';

const PORT = 8080;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Weather API running at http://localhost:${PORT}`);
});

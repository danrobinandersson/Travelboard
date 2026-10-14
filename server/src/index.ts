import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { ratesRouter } from './routes/rates.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/rates', ratesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
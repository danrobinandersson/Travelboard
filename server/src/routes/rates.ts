import { Router } from 'express';
import { getRates, RatesError } from '../services/ratesService.js';

export const ratesRouter = Router();

// GET /api/rates?base=SEK&target=EUR
ratesRouter.get('/', async (req, res) => {
  const { base, target } = req.query;

  if (typeof base !== 'string' || typeof target !== 'string') {
    res.status(400).json({ error: 'Query parameters "base" and "target" are required' });
    return;
  }

  try {
    res.json(await getRates(base, target));
  } catch (error) {
    if (error instanceof RatesError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Unexpected error in /api/rates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

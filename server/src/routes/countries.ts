import { Router } from 'express';
import { CountriesError, getCountries, getCountry } from '../services/countriesService.js';

export const countriesRouter = Router();

// GET /api/countries            -> all countries
// GET /api/countries?search=can -> countries whose name contains "can"
countriesRouter.get('/', async (req, res) => {
  const { search } = req.query;

  if (search !== undefined && typeof search !== 'string') {
    res.status(400).json({ error: 'Query parameter "search" must be text' });
    return;
  }

  try {
    res.json(await getCountries(search));
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/countries/PA -> one country
countriesRouter.get('/:code', async (req, res) => {
  try {
    res.json(await getCountry(req.params.code));
  } catch (error) {
    handleError(error, res);
  }
});

function handleError(error: unknown, res: import('express').Response) {
  if (error instanceof CountriesError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  console.error('Unexpected error in /api/countries:', error);
  res.status(500).json({ error: 'Internal server error' });
}
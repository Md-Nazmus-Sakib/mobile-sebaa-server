import express from 'express';
import { CountryController } from './country.controller';

const router = express.Router();

router.get('/', CountryController.getAllCountries); // Fetch all countries with optional search

export const CountryRoute = router;

import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';

import { CountryService } from './country.service';

const getAllCountries = catchAsync(async (req: Request, res: Response) => {
  const result = await CountryService.getAllCountries(
    req.query.search as string,
  );

  res.json(result);
});

export const CountryController = {
  getAllCountries,
};

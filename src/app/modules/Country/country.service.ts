import { Country } from './country.model';

export const CountryService = {
  getAllCountries: async (search?: string) => {
    const filter = search
      ? { name: { $regex: search, $options: 'i' } } // Case-insensitive search
      : {}; // If no search term is provided, fetch all countries

    return await Country.find(filter).sort({ name: 1 }); // Sorting countries alphabetically by name
  },
};

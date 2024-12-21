import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry extends Document {
  name: string; // Country name
}

const CountrySchema: Schema = new Schema<ICountry>({
  name: {
    type: String,
  },
});

export const Country = mongoose.model<ICountry>('Country', CountrySchema);

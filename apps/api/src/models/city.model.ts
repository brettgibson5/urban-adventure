// apps/api/src/app/models/city.model.ts
import mongoose, { Schema, Model, Document } from 'mongoose';
import { City } from '@shared';

// Create interface for the model that extends the base City interface
interface ICityModel extends Omit<City, 'id'>, Document {
  // Add any additional methods if needed
}

const citySchema = new Schema<ICityModel>(
  {
    name: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for better querying
citySchema.index({ name: 1, state: 1, country: 1 }, { unique: true });

// Create geospatial index for location-based queries
citySchema.index({
  'location.latitude': 1,
  'location.longitude': 1,
});

// Add method to get formatted name
citySchema.methods.getFormattedName = function (): string {
  return `${this.name}, ${this.state}, ${this.country}`;
};

// Static method to find nearby cities
citySchema.statics.findNearby = async function (
  latitude: number,
  longitude: number,
  radiusInKm = 50
) {
  // Earth's radius in kilometers
  const earthRadius = 6371;

  return this.find({
    'location.latitude': {
      $gte: latitude - (radiusInKm / earthRadius) * (180 / Math.PI),
      $lte: latitude + (radiusInKm / earthRadius) * (180 / Math.PI),
    },
    'location.longitude': {
      $gte:
        longitude -
        ((radiusInKm / earthRadius) * (180 / Math.PI)) /
          Math.cos((latitude * Math.PI) / 180),
      $lte:
        longitude +
        ((radiusInKm / earthRadius) * (180 / Math.PI)) /
          Math.cos((latitude * Math.PI) / 180),
    },
  }).select('name state country location');
};

export const CityModel = mongoose.model<ICityModel>('City', citySchema);

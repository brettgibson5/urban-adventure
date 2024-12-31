export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

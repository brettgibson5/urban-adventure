export interface Nature {
  id: string;
  userId: string;
  type: 'PLANT' | 'ANIMAL';
  species?: string;
  location: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  cityId: string;
  notes?: string;
  dateSpotted: Date;
  createdAt: Date;
  updatedAt: Date;
}

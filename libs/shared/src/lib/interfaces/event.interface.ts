export interface Event {
  id: string;
  userId: string; // creator
  cityId: string; // city where event takes place
  title: string;
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  startDate: Date;
  endDate: Date;
  category: string;
  maxAttendees?: number;
  createdAt: Date;
  updatedAt: Date;
}

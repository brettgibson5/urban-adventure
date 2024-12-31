export interface EventAttendance {
  id: string;
  eventId: string;
  userId: string;
  status: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE';
  createdAt: Date;
  updatedAt: Date;
}

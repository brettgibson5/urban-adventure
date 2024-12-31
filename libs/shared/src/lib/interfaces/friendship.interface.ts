export interface Friendship {
  id: string;
  requesterId: string; // User who sent the friend request
  addresseeId: string; // User who received the friend request
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: string;
  url: string;
  userId: string;
  entityType: 'CITY' | 'EVENT' | 'NATURE';
  entityId: string;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

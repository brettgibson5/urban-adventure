export interface ChecklistItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetCount: number; // How many times to complete (e.g., 10 gym visits)
  currentCount: number; // Current completion count
  dueDate: Date; // e.g., 12/31/24
  category?: string; // e.g., 'fitness', 'reading', etc.
  createdAt: Date;
  updatedAt: Date;
}

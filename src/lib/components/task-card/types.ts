export interface Card {
  _id: string;
  taskName: string;
  description: string;
  assignee: string;
  taskType: string;
  user_id: string;
  order: number;
  column: string;
}


export interface Task {
  id: string;
  userId: string;
  content: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  weekStart: Date;
  weekEnd: Date;
  aiSummary: string | null;
  status: "draft" | "pending" | "completed";
  rawNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskInput {
  content: string;
  date: string;
}

export interface AISummaryInput {
  weekStart: string;
  weekEnd: string;
}

export interface AISummaryOutput {
  summary: string;
  accomplishments: string[];
  challenges: string[];
  nextWeekGoals: string[];
}
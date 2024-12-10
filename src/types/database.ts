export type Frequency = 'daily' | 'weekly' | 'monthly';
export type CompletionStatus = 'completed' | 'skipped' | 'pending';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  streak_count: number;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  frequency: Frequency;
  start_date: string;
  end_date: string | null;
  reminder_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  status: CompletionStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  points: number;
  unlocked_at: string;
}
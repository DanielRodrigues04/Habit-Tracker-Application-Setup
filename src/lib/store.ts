import { Profile, Habit, HabitLog, Category, Achievement } from '../types/database';

// Simulated data store
let currentUser: Profile | null = null;
let habits: Habit[] = [];
let habitLogs: HabitLog[] = [];
let achievements: Achievement[] = [];

// Default categories
export const categories: Category[] = [
  { id: '1', name: 'Saúde', color: '#10B981', icon: 'heart', created_at: new Date().toISOString() },
  { id: '2', name: 'Produtividade', color: '#3B82F6', icon: 'briefcase', created_at: new Date().toISOString() },
  { id: '3', name: 'Lazer', color: '#F59E0B', icon: 'music', created_at: new Date().toISOString() },
  { id: '4', name: 'Educação', color: '#8B5CF6', icon: 'book-open', created_at: new Date().toISOString() },
  { id: '5', name: 'Finanças', color: '#10B981', icon: 'piggy-bank', created_at: new Date().toISOString() },
  { id: '6', name: 'Social', color: '#EC4899', icon: 'users', created_at: new Date().toISOString() },
];

// Auth functions
export const auth = {
  signUp: async (email: string, password: string) => {
    const userId = Math.random().toString(36).substring(7);
    const newUser: Profile = {
      id: userId,
      username: email.split('@')[0],
      avatar_url: null,
      streak_count: 0,
      points: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    currentUser = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
    return { user: newUser, error: null };
  },

  signIn: async (email: string, password: string) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return { user: currentUser, error: null };
    }
    return { user: null, error: 'User not found' };
  },

  signOut: async () => {
    currentUser = null;
    localStorage.removeItem('user');
    return { error: null };
  },

  getSession: async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return { data: { session: { user: currentUser } } };
    }
    return { data: { session: null } };
  },
};

// Habits CRUD
export const habitsApi = {
  create: async (habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Math.random().toString(36).substring(7),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    habits.push(newHabit);
    return { data: newHabit, error: null };
  },

  getAll: async () => {
    return { data: habits, error: null };
  },

  update: async (id: string, updates: Partial<Habit>) => {
    const index = habits.findIndex(h => h.id === id);
    if (index > -1) {
      habits[index] = { ...habits[index], ...updates, updated_at: new Date().toISOString() };
      return { data: habits[index], error: null };
    }
    return { data: null, error: 'Habit not found' };
  },

  delete: async (id: string) => {
    habits = habits.filter(h => h.id !== id);
    return { error: null };
  },
};

// Habit Logs CRUD
export const habitLogsApi = {
  create: async (log: Omit<HabitLog, 'id' | 'created_at' | 'updated_at'>) => {
    const newLog: HabitLog = {
      ...log,
      id: Math.random().toString(36).substring(7),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    habitLogs.push(newLog);
    return { data: newLog, error: null };
  },

  getAll: async () => {
    return { data: habitLogs, error: null };
  },

  update: async (id: string, updates: Partial<HabitLog>) => {
    const index = habitLogs.findIndex(l => l.id === id);
    if (index > -1) {
      habitLogs[index] = { ...habitLogs[index], ...updates, updated_at: new Date().toISOString() };
      return { data: habitLogs[index], error: null };
    }
    return { data: null, error: 'Log not found' };
  },
};

// Achievements CRUD
export const achievementsApi = {
  create: async (achievement: Omit<Achievement, 'id' | 'unlocked_at'>) => {
    const newAchievement: Achievement = {
      ...achievement,
      id: Math.random().toString(36).substring(7),
      unlocked_at: new Date().toISOString(),
    };
    achievements.push(newAchievement);
    return { data: newAchievement, error: null };
  },

  getAll: async () => {
    return { data: achievements, error: null };
  },
};
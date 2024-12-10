import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, CheckCircle2, XCircle, SkipForward, X } from 'lucide-react';
import { habitsApi, habitLogsApi, categories } from '../lib/store';
import type { Habit, HabitLog } from '../types/database';
import toast from 'react-hot-toast';

interface DashboardProps {
  session: {
    user: {
      id: string;
    };
  };
}

export default function Dashboard({ session }: DashboardProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category_id: '',
    frequency: 'daily',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: '',
  });
  const today = new Date();

  useEffect(() => {
    loadHabits();
    loadHabitLogs();
  }, []);

  const loadHabits = async () => {
    try {
      const { data, error } = await habitsApi.getAll();
      if (error) throw error;
      setHabits(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar hábitos');
    }
  };

  const loadHabitLogs = async () => {
    try {
      const { data, error } = await habitLogsApi.getAll();
      if (error) throw error;
      setHabitLogs(data || []);
      setLoading(false);
    } catch (error: any) {
      toast.error('Erro ao carregar registros');
      setLoading(false);
    }
  };

  const handleHabitStatus = async (habit: Habit, status: 'completed' | 'skipped') => {
    try {
      const todayStr = format(today, 'yyyy-MM-dd');
      const existingLog = habitLogs.find(
        log => log.habit_id === habit.id && format(new Date(log.date), 'yyyy-MM-dd') === todayStr
      );

      if (existingLog) {
        await habitLogsApi.update(existingLog.id, { status });
      } else {
        await habitLogsApi.create({
          habit_id: habit.id,
          user_id: session.user.id,
          date: todayStr,
          status,
          notes: null
        });
      }

      await loadHabitLogs();
      toast.success(status === 'completed' ? 'Hábito concluído!' : 'Hábito pulado');
    } catch (error: any) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await habitsApi.create({
        ...newHabit,
        user_id: session.user.id,
        reminder_time: null,
        end_date: newHabit.end_date || null,
      });
      await loadHabits();
      setIsModalOpen(false);
      setNewHabit({
        name: '',
        description: '',
        category_id: '',
        frequency: 'daily',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: '',
      });
      toast.success('Hábito criado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao criar hábito');
    }
  };

  const getHabitStatus = (habit: Habit) => {
    const todayStr = format(today, 'yyyy-MM-dd');
    const log = habitLogs.find(
      log => log.habit_id === habit.id && format(new Date(log.date), 'yyyy-MM-dd') === todayStr
    );
    return log?.status || 'pending';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Hábito
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {habits.map((habit) => {
            const category = categories.find(c => c.id === habit.category_id);
            const status = getHabitStatus(habit);

            return (
              <div
                key={habit.id}
                className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white"
              >
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: category?.color }}>
                      {category?.name}
                    </p>
                    <div className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">{habit.name}</p>
                      <p className="mt-3 text-base text-gray-500">{habit.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleHabitStatus(habit, 'completed')}
                        disabled={status !== 'pending'}
                        className={`p-2 rounded-full ${
                          status === 'completed'
                            ? 'text-green-600 bg-green-100'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <CheckCircle2 className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleHabitStatus(habit, 'skipped')}
                        disabled={status !== 'pending'}
                        className={`p-2 rounded-full ${
                          status === 'skipped'
                            ? 'text-yellow-600 bg-yellow-100'
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100'
                        }`}
                      >
                        <SkipForward className="h-6 w-6" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {habit.frequency === 'daily'
                        ? 'Diário'
                        : habit.frequency === 'weekly'
                        ? 'Semanal'
                        : 'Mensal'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Novo Hábito */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Novo Hábito</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateHabit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    required
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <select
                    required
                    value={newHabit.category_id}
                    onChange={(e) => setNewHabit({ ...newHabit, category_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frequência</label>
                  <select
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Início</label>
                  <input
                    type="date"
                    required
                    value={newHabit.start_date}
                    onChange={(e) => setNewHabit({ ...newHabit, start_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Término (opcional)</label>
                  <input
                    type="date"
                    value={newHabit.end_date}
                    onChange={(e) => setNewHabit({ ...newHabit, end_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Criar Hábito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
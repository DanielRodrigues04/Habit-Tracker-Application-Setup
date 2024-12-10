import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { auth } from './lib/store';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {!session ? <Auth /> : <Dashboard session={session} />}
      </div>
    </>
  );
}

export default App;
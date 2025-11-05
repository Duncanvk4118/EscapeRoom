import React from 'react';
import { Link } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '../Context/UserContext';

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="w-64 hidden md:block">
            <div className="bg-gray-800 border border-gray-700 rounded p-4 sticky top-20">
              <div className="mb-4 text-sm text-gray-300">Admin</div>
              <nav className="flex flex-col space-y-2">
                <Link to="/admin" className="text-gray-100 hover:text-orange-400">Dashboard</Link>
                <Link to="/admin/escape-rooms" className="text-gray-100 hover:text-orange-400">Escape Rooms</Link>
                <Link to="/admin/questions" className="text-gray-100 hover:text-orange-400">Questions</Link>
                <Link to="/admin/sessions" className="text-gray-100 hover:text-orange-400">Sessions</Link>
                <button onClick={logout} className="text-left text-red-400 mt-4">Logout</button>
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-gray-800 border border-gray-700 rounded p-6 text-gray-100">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

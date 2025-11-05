import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../../utils/api';
import AdminLayout from '../../Components/AdminLayout';

export default function SessionsList() {
  const [teams, setTeams] = useState([]);
  const [sessionsMeta, setSessionsMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const [t, s] = await Promise.all([api('/admin/teams'), api('/admin/er-game-sessions')]);
      if (!Array.isArray(t)) throw new Error('Unexpected teams response');
      if (!Array.isArray(s)) throw new Error('Unexpected sessions response');
      setTeams(t);
      // map sessions by ID for quick lookup
      const meta = {};
      s.forEach(sess => {
        const id = sess.ID || sess.id || sess.ID === 0 ? String(sess.ID || sess.id) : null;
        if (id) meta[id] = sess;
      });
      setSessionsMeta(meta);
      setError(null);
    } catch (e) {
      setTeams([]);
      setError(e.message || 'Failed');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetch(); }, []);

  // group teams by er_game_id (session id)
  const sessions = teams.reduce((acc, t) => {
    const sid = t.er_game_id != null ? String(t.er_game_id) : null;
    if (!acc[sid]) acc[sid] = [];
    acc[sid].push(t);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div>
        <h2 className="text-xl mb-4">Game Sessions</h2>
        {loading ? <div>Loading...</div> : (
          error ? <div className="text-red-400">{error}</div> : (
            <table className="w-full bg-gray-800 border border-gray-700 table-auto border-collapse">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-2 text-left border-r border-gray-700">Session ID</th>
                  <th className="p-2 text-left border-r border-gray-700">Team count</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="odd:bg-gray-800 even:bg-gray-700">
                {Object.keys(sessions).filter(sid => sid !== 'null').map(sid => {
                  const meta = sessionsMeta[sid];
                  return (
                  <tr key={sid}>
                    <td className="p-2 text-left border-r border-gray-700">{meta && (meta.name || meta.NAME) ? (meta.name || meta.NAME) : `Session ${sid}`}</td>
                    <td className="p-2 text-left border-r border-gray-700">{sessions[sid].length}</td>
                    <td className="p-2 text-left">
                      <Link to={`/admin/sessions/${sid}`} className="text-indigo-400">View</Link>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          )
        )}
      </div>
    </AdminLayout>
  );
}

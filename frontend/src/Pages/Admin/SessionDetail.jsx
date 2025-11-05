import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '../../utils/api';
import AdminLayout from '../../Components/AdminLayout';

export default function SessionDetail() {
  const { id } = useParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const teamsForSession = await api(`/admin/teams/session/${id}`);
      // backend returns team rows with total_points, total_questions, finished_questions
      const normalized = Array.isArray(teamsForSession) ? teamsForSession.map(t => ({
        ...t,
        progress: {
          totalPoints: t.total_points || 0,
          finished: t.finished_questions || 0,
          total: t.total_questions || 0,
        }
      })) : [];
      setTeams(normalized);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed');
      setTeams([]);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetch(); }, [id]);

  return (
    <AdminLayout>
      <div>
        <h2 className="text-xl mb-4">Session {id}</h2>
        {loading ? <div>Loading...</div> : (
          error ? <div className="text-red-400">{error}</div> : (
            <table className="w-full bg-gray-800 border border-gray-700 table-auto border-collapse">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-2 text-left border-r border-gray-700">Team</th>
                  <th className="p-2 text-left border-r border-gray-700">Token</th>
                  <th className="p-2 text-left border-r border-gray-700">Points</th>
                  <th className="p-2 text-left border-r border-gray-700">Finished / Total</th>
                  <th className="p-2 text-left">Inspect</th>
                </tr>
              </thead>
              <tbody className="odd:bg-gray-800 even:bg-gray-700">
                {teams.map(t => (
                  <tr key={t.id}>
                    <td className="p-2 text-left border-r border-gray-700">{t.name}</td>
                    <td className="p-2 text-left border-r border-gray-700"><code>{t.token}</code></td>
                    <td className="p-2 text-left border-r border-gray-700">{t.progress.totalPoints}</td>
                    <td className="p-2 text-left border-r border-gray-700">{t.progress.finished} / {t.progress.total}</td>
                    <td className="p-2 text-left">
                      <a className="text-sm text-indigo-400" href={`/admin/sessions/${id}/teams/${t.id}`}>Inspect</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </AdminLayout>
  );
}

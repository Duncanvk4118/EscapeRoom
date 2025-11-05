import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import AdminLayout from '../../Components/AdminLayout';
import api from '../../utils/api';

export default function TeamDetail(){
  const { sessionId, teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [session, setSession] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]);
  const [questions, setQuestions] = useState([]); // er-room questions (with question object)
  const [esq, setEsq] = useState([]); // er_session_questions for this team
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserName, setEditingUserName] = useState('');
  const [showDeleteUserId, setShowDeleteUserId] = useState(null);

  // moderation editor state
  const [editingEsqId, setEditingEsqId] = useState(null);
  const [editingEsqData, setEditingEsqData] = useState({ points: 0, correct: false, state: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [teamRes, sessionRes] = await Promise.all([
        api(`/admin/teams/${teamId}`),
        api(`/admin/er-game-sessions/${sessionId}`),
      ]);

      setTeam(teamRes);
      setSession(sessionRes);

      // fetch questions linked to the escape-room (use session.er_id)
      const erId = sessionRes && (sessionRes.er_id || sessionRes.erId || sessionRes.erId);
      let qList = [];
      if (erId) {
        qList = await api(`/admin/escape-rooms/${erId}/questions`);
      }

      // fetch team users (filter client-side)
      const allTeamUsers = await api('/admin/team-users');
      const usersForTeam = Array.isArray(allTeamUsers) ? allTeamUsers.filter(u => Number(u.team_id) === Number(teamId)) : [];

      // fetch er_session_questions for this team
      const esqList = await api(`/admin/er-session-questions/team/${teamId}`);

      setQuestions(Array.isArray(qList) ? qList : []);
      setTeamUsers(usersForTeam);
      setEsq(Array.isArray(esqList) ? esqList : []);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchAll(); }, [sessionId, teamId]);

  const findEsqByQuestionId = (questionId) => esq.find(x => Number(x.question_id) === Number(questionId));

  const startEditUsername = (user) => {
    setEditingUserId(user.id);
    setEditingUserName(user.username || '');
  };

  const saveEditUsername = async () => {
    if (!editingUserId) return;
    await api(`/admin/team-users/${editingUserId}`, { method: 'PATCH', body: JSON.stringify({ username: editingUserName }) });
    setEditingUserId(null);
    setEditingUserName('');
    await fetchAll();
  };

  const cancelEditUsername = () => {
    setEditingUserId(null);
    setEditingUserName('');
  };

  const confirmDeleteUser = (user) => {
    setShowDeleteUserId(user.id);
  };

  const doDeleteUser = async () => {
    if (!showDeleteUserId) return;
    await api(`/admin/team-users/${showDeleteUserId}`, { method: 'DELETE' });
    setShowDeleteUserId(null);
    await fetchAll();
  };

  const cancelDeleteUser = () => setShowDeleteUserId(null);

  const stateLabel = (s) => {
    switch (Number(s)) {
      case 1: return 'answering';
      case 2: return 'scanned';
      case 3: return 'finished';
      default: return 'unanswered';
    }
  };

  const startModeration = (esqRow) => {
    setEditingEsqId(esqRow.id);
    setEditingEsqData({ points: esqRow.points || 0, correct: !!esqRow.correct, state: esqRow.state != null ? esqRow.state : 0 });
  };

  const saveModeration = async () => {
    if (!editingEsqId) return;
    await api(`/admin/er-session-questions/${editingEsqId}`, { method: 'PATCH', body: JSON.stringify({ correct: editingEsqData.correct, points: Number(editingEsqData.points) || 0, state: Number(editingEsqData.state) || 0 }) });
    setEditingEsqId(null);
    setEditingEsqData({ points: 0, correct: false, state: 0 });
    await fetchAll();
  };

  const cancelModeration = () => {
    setEditingEsqId(null);
    setEditingEsqData({ points: 0, correct: false, state: 0 });
  };

  if (loading) return (
    <AdminLayout>
      <div>Loading...</div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div className="text-red-400">{error}</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div>
            <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl">Team {team ? team.name : teamId}</h2>
            {team && <div className="text-sm text-gray-300">Token: <code>{team.token}</code></div>}
            {session && <div className="text-sm text-gray-300">Session: {session.name}</div>}
          </div>
          <div>
            <a href={`/admin/sessions/${sessionId}`} className="text-sm text-blue-600">Back to session</a>
          </div>
        </div>

        <section className="mb-6">
          <h3 className="font-semibold mb-2">Team users</h3>
          <table className="w-full bg-gray-800 border border-gray-700 table-auto border-collapse">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-2 text-left border-r border-gray-200">ID</th>
                <th className="p-2 text-left border-r border-gray-200">Username</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="odd:bg-gray-800 even:bg-gray-700">
              {teamUsers.map(u => (
                editingUserId === u.id ? (
                  <tr key={u.id} className="bg-gray-700">
                    <td className="p-2 text-left border-r border-gray-700">{u.id}</td>
                    <td className="p-2 text-left border-r border-gray-700">
                      <input className="border border-gray-700 bg-gray-900 text-gray-100 px-2 py-1 w-full" value={editingUserName} onChange={(e)=>setEditingUserName(e.target.value)} />
                    </td>
                    <td className="p-2 text-left">
                      <button onClick={saveEditUsername} className="mr-2 text-sm text-green-400">Save</button>
                      <button onClick={cancelEditUsername} className="text-sm text-gray-300">Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={u.id}>
                    <td className="p-2 text-left border-r border-gray-700">{u.id}</td>
                    <td className="p-2 text-left border-r border-gray-700">{u.username}</td>
                    <td className="p-2 text-left">
                      <button onClick={()=>startEditUsername(u)} className="mr-2 text-sm text-indigo-400">Edit</button>
                      <button onClick={()=>confirmDeleteUser(u)} className="text-sm text-red-400">Delete</button>
                    </td>
                  </tr>
                )
              ))}
              {teamUsers.length === 0 && (
                <tr><td className="p-2" colSpan={3}>No users</td></tr>
              )}
            </tbody>
          </table>
        </section>
        {/* Delete confirmation modal */}
        {showDeleteUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded shadow-lg w-[90%] max-w-md text-gray-100">
              <h3 className="text-lg font-medium mb-2">Delete user?</h3>
              <p className="text-sm text-gray-300 mb-4">Are you sure you want to delete this team user (id: {showDeleteUserId})? This action cannot be undone.</p>
              <div className="flex justify-end space-x-2">
                <button onClick={cancelDeleteUser} className="px-3 py-1 rounded bg-gray-700">Cancel</button>
                <button onClick={doDeleteUser} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
              </div>
            </div>
          </div>
        )}

        <section>
          <h3 className="font-semibold mb-2">Questions & responses</h3>
          <table className="w-full bg-gray-800 border border-gray-700 table-auto border-collapse">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-2 text-left border-r border-gray-200">#</th>
                <th className="p-2 text-left border-r border-gray-200">Question</th>
                <th className="p-2 text-left border-r border-gray-200">Answer</th>
                <th className="p-2 text-left border-r border-gray-200">Correct</th>
                <th className="p-2 text-left border-r border-gray-200">Points</th>
                <th className="p-2 text-left border-r border-gray-200">State</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="odd:bg-gray-800 even:bg-gray-700">
              {questions.map((q, idx) => {
                const esqRow = findEsqByQuestionId(q.question_id) || {};
                return (
                  <React.Fragment key={q.er_question_id || q.question_id}>
                    <tr>
                      <td className="p-2 text-left border-r border-gray-200">{idx+1}</td>
                      <td className="p-2 text-left border-r border-gray-200">{q.question && q.question.question ? q.question.question : (q.question && q.question.text) || '—'}</td>
                      <td className="p-2 text-left border-r border-gray-200">{esqRow.answer || '-'}</td>
                      <td className="p-2 text-left border-r border-gray-200">{esqRow.correct ? 'Yes' : 'No'}</td>
                      <td className="p-2 text-left border-r border-gray-200">{esqRow.points != null ? esqRow.points : '-'}</td>
                      <td className="p-2 text-left border-r border-gray-200">{esqRow.state != null ? stateLabel(esqRow.state) : 'unanswered'}</td>
                      <td className="p-2 text-left">
                          {esqRow.id ? (
                            <button onClick={()=>startModeration(esqRow)} className="text-sm text-indigo-600">Moderate</button>
                          ) : (
                            <span className="text-sm text-gray-500">Not assigned</span>
                          )}
                      </td>
                    </tr>
                    {editingEsqId === (esqRow.id) && (
                      <tr className="bg-gray-700">
                        <td colSpan={7} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                            <div>
                              <label className="block text-sm text-gray-300">Points</label>
                              <input type="number" className="border border-gray-700 bg-gray-900 text-gray-100 px-2 py-1 w-full" value={editingEsqData.points} onChange={e => setEditingEsqData(d => ({ ...d, points: e.target.value }))} />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-300">Correct</label>
                              <input type="checkbox" checked={!!editingEsqData.correct} onChange={e => setEditingEsqData(d => ({ ...d, correct: e.target.checked }))} />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-300">State</label>
                              <select className="border border-gray-700 bg-gray-900 text-gray-100 px-2 py-1 w-full" value={editingEsqData.state} onChange={e => setEditingEsqData(d => ({ ...d, state: Number(e.target.value) }))}>
                                <option value={0}>unanswered</option>
                                <option value={1}>answering</option>
                                <option value={2}>scanned</option>
                                <option value={3}>finished</option>
                              </select>
                            </div>
                            <div className="flex space-x-2">
                              <button onClick={saveModeration} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                              <button onClick={cancelModeration} className="bg-gray-700 px-3 py-1 rounded">Cancel</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {questions.length === 0 && (
                <tr><td className="p-2" colSpan={7}>No questions linked to this escape room/session</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </AdminLayout>
  );
}

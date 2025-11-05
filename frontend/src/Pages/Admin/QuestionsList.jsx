import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../../utils/api';
import AdminLayout from '../../Components/AdminLayout';

export default function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const q = await api('/admin/questions');
      if (Array.isArray(q)) {
        setQuestions(q);
        setError(null);
      } else {
        setQuestions([]);
        setError(q && q.error ? q.error : 'Unexpected response from server');
      }
    } catch (e) { alert(e.message || 'Failed'); }
    setLoading(false);
  };

  useEffect(()=>{ fetch(); }, []);

  const del = async (id) => {
    if (!window.confirm('Delete question?')) return;
    try {
      await api(`/admin/questions/${id}`, { method: 'DELETE' });
      fetch();
    } catch (e) { alert(e.message || 'Delete failed'); }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Questions</h2>
          <Link to="/admin/questions/new" className="bg-green-600 text-white px-4 py-2">Create</Link>
        </div>

        {loading ? <div>Loading...</div> : (
          error ? <div className="text-red-400">{error}</div> : (
          <table className="w-full bg-gray-800 border border-gray-700 table-auto border-collapse">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-2 text-left border-gray-200">ID</th>
                <th className="p-2 text-left border-gray-200">Question</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="odd:bg-gray-800 even:bg-gray-700">
              {Array.isArray(questions) && questions.map(q => (
                <tr key={q.id}>
                  <td className="p-2 text-left border-r border-gray-700">{q.id}</td>
                  <td className="p-2 text-left border-r border-gray-700">{q.question}</td>
                  <td className="p-2 text-left">
                    <Link className="mr-2 text-indigo-400" to={`/admin/questions/${q.id}`}>Edit</Link>
                    <button className="text-red-400" onClick={()=>del(q.id)}>Delete</button>
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

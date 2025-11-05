import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import api from '../../utils/api';
import AdminLayout from '../../Components/AdminLayout';

export default function QuestionEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new' || !id;
  const [form, setForm] = useState({ type: 0, question: '', description: '', location: '', lat: '', long: '' });
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState({ answer: '', correct: false });

  const load = async () => {
    if (!isNew) {
      const q = await api(`/admin/questions/${id}`);
      setForm({ type: q.type || 0, question: q.question || '', description: q.description || '', location: q.location || '', lat: q.lat || '', long: q.long || '' });
      const a = await api(`/admin/questions/${id}/answers`);
      setAnswers(a || []);
    }
  };

  useEffect(()=>{ load(); }, [id]);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (isNew) {
        const r = await api('/admin/questions', { method: 'POST', body: JSON.stringify(form) });
        navigate('/admin/questions');
      } else {
        await api(`/admin/questions/${id}`, { method: 'PATCH', body: JSON.stringify(form) });
        alert('Saved');
      }
    } catch (e) { alert(e.message || 'Save failed'); }
  };

  const addAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.answer) return alert('Answer required');
    try {
      await api(`/admin/questions/${id}/answers`, { method: 'PATCH', body: JSON.stringify({ answer: newAnswer.answer, correct: newAnswer.correct }) });
      setNewAnswer({ answer: '', correct: false });
      const a = await api(`/admin/questions/${id}/answers`);
      setAnswers(a || []);
    } catch (e) { alert(e.message || 'Add answer failed'); }
  };

  const delAnswer = async (aid) => {
    if (!window.confirm('Delete answer?')) return;
    try {
      await api(`/admin/answers/${aid}`, { method: 'DELETE' });
      setAnswers(answers.filter(a => a.ID !== aid));
    } catch (e) { alert(e.message || 'Delete failed'); }
  };

  return (
    <AdminLayout>
      <div>
      <h2 className="text-xl mb-4">{isNew ? 'Create Question' : 'Edit Question'}</h2>
      <form onSubmit={save} className="mb-4 space-y-2">
        <input className="w-full border border-gray-700 bg-gray-900 text-gray-100 p-2" value={form.question} onChange={e=>setForm({...form, question: e.target.value})} placeholder="Question text" />
        <textarea className="w-full border border-gray-700 bg-gray-900 text-gray-100 p-2" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Description" />
        <div className="flex gap-2">
          <input className="border border-gray-700 bg-gray-900 text-gray-100 p-2 flex-1" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} placeholder="Location name" />
          <input className="border border-gray-700 bg-gray-900 text-gray-100 p-2 w-32" value={form.lat} onChange={e=>setForm({...form, lat: e.target.value})} placeholder="lat" />
          <input className="border border-gray-700 bg-gray-900 text-gray-100 p-2 w-32" value={form.long} onChange={e=>setForm({...form, long: e.target.value})} placeholder="long" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2" type="submit">Save</button>
      </form>

      {!isNew && (
        <div>
          <h3 className="font-semibold">Answers</h3>
          <ul className="mb-2">
            {answers.map(a => (
              <li key={a.ID} className="flex justify-between p-2 odd:bg-gray-800 even:bg-gray-700">
                <div>{a.answer} {a.correct ? '(correct)' : ''}</div>
                <div><button className="text-red-400" onClick={()=>delAnswer(a.ID)}>Delete</button></div>
              </li>
            ))}
          </ul>

          <form onSubmit={addAnswer} className="space-y-2">
            <input className="w-full border border-gray-700 bg-gray-900 text-gray-100 p-2" value={newAnswer.answer} onChange={e=>setNewAnswer({...newAnswer, answer: e.target.value})} placeholder="Answer text" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={newAnswer.correct} onChange={e=>setNewAnswer({...newAnswer, correct: e.target.checked})} /> Correct</label>
            <button className="bg-green-600 text-white px-4 py-2" type="submit">Add Answer</button>
          </form>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}

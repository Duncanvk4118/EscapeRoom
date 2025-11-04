import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode'; // client-side qr code generating :P
import { useParams, useNavigate } from 'react-router';
import api from '../../utils/api';
import AdminLayout from '../../Components/AdminLayout';

export default function EscapeRoomEditor() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [links, setLinks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [qrModal, setQrModal] = useState(null); // { dataUrl, token, filename }
  const [unlinkConfirmId, setUnlinkConfirmId] = useState(null);

  const fetch = async () => {
    try {
      const r = await api(`/admin/escape-rooms/${id}`);
      setRoom(r);
      const erqs = await api(`/admin/escape-rooms/${id}/questions`);
      setLinks(erqs);
      const qs = await api('/admin/questions');
      setQuestions(qs);
    } catch (e) { console.error(e); alert(e.message || 'Failed'); }
  };

  useEffect(()=>{ fetch(); }, [id]);

  const linkQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return alert('Select question');
    try {
      await api(`/admin/escape-rooms/${id}/questions`, { method: 'POST', body: JSON.stringify({ question_id: selectedQuestion }) });
      setSelectedQuestion('');
      fetch();
    } catch (e) { alert(e.message || 'Link failed'); }
  };

  const unlink = async (questionId) => {
    try {
      await api(`/admin/escape-rooms/${id}/questions/${questionId}`, { method: 'DELETE' });
      setUnlinkConfirmId(null);
      fetch();
    } catch (e) { alert(e.message || 'Unlink failed'); }
  };

  const askUnlink = (questionId) => setUnlinkConfirmId(questionId);
  const cancelUnlink = () => setUnlinkConfirmId(null);

  const genToken = async (er_question_id, { showDropdown = true } = {}) => {
    try {
        const r = await api(`/admin/er-question/${er_question_id}/token`, { method: 'POST' });
        // get token for question and save it locally
        const data = r.token;
        let dataUrl = null;
        try {
            dataUrl = await QRCode.toDataURL(data, { margin: 1, width: 300 });
        } catch (err) {
            console.error('QR generate failed', err);
        }
        const saved = { token: r.token, expiresAt: r.expiresAt, show: showDropdown, dataUrl };
        return saved;
    } catch (e) { alert(e.message || 'Token failed'); }
  };

  const getFriendlyName = (erq) => {
    const idVal = erq.er_question_id || erq.id;
    // get friendly name to save qr code.
    const qid = erq && erq.question && erq.question.id ? erq.question.id : idVal;
    return `question_${qid}`;
  };

  const handleGenerateAndOpen = async (erq) => {
    const idVal = erq.er_question_id || erq.id;
    const saved = await genToken(idVal, { showDropdown: false });
    if (saved) {
      const filename = `${getFriendlyName(erq)}.png`;
      // label for modal like "Question 1"
      const qid = erq && erq.question && erq.question.id ? erq.question.id : idVal;
      const qLabel = `Question ${qid}`;
      setQrModal({ dataUrl: saved.dataUrl, token: saved.token, filename, qLabel });
    }
  };

  const generateQrDataUrl = async (data) => {
    try {
      return await QRCode.toDataURL(data, { margin: 1, width: 300 });
    } catch (err) {
      console.error('QR generation failed', err);
      return null;
    }
  };

  const downloadDataUrl = (dataUrl, filename) => {
    if (!dataUrl) return;
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlObj;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlObj);
  };

  const exportAllQRCodes = async () => {
   //to be made in future, probs gonna be moved to backend
  };



  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTeamsCount, setCreateTeamsCount] = useState(4);
  const [createSessionName, setCreateSessionName] = useState('New session');
  const navigate = useNavigate();

  const createSessionRequest = async (e) => {
    e && e.preventDefault();
    const teams = Number(createTeamsCount) || 0;
    if (!teams || teams <= 0) return;
    try {
      const r = await api(`/admin/escape-rooms/${id}/create-session`, { method: 'POST', body: JSON.stringify({ teams_count: teams, session_name: createSessionName }) });
      setShowCreateModal(false);
      setCreateTeamsCount(4);
      setCreateSessionName('New session');
      fetch();
      // redirect to sessions list
      navigate('/admin/sessions');
    } catch (e) { alert(e.message || 'Create session failed'); }
  };

  if (!room) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div>
        <h2 className="text-xl mb-2">Manage: {room.name}</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Linked Questions</h3>
        <table className="w-full bg-gray-800 border border-gray-700 mt-2">
          <thead><tr><th className="p-2 text-left">ERQ ID</th><th className="p-2 text-left">Question</th><th className="p-2 text-left">Actions</th></tr></thead>
          <tbody className="odd:bg-gray-800 even:bg-gray-700">
            {links.map(l => (
              <tr key={l.er_question_id || l.id}>
                <td className="p-2">{l.er_question_id || l.id}</td>
                <td className="p-2">{l.question && l.question.question ? l.question.question : (l.question ? l.question : '')}</td>
                <td className="p-2">
                  <div className="flex items-start gap-3">
                    <button className="mr-2 text-indigo-400" onClick={() => handleGenerateAndOpen(l)}>Generate Token</button>
                      <button className="text-red-400" onClick={() => askUnlink(l.question_id || l.question_id)}>Unlink</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* QR modal */}
      {qrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-[90%] max-w-sm text-gray-100">
        <h3 className="text-lg font-medium mb-2">{qrModal.qLabel || 'Question'}</h3>
            <div className="mb-4 flex flex-col items-center">
              {qrModal.dataUrl ? (
                <img src={qrModal.dataUrl} alt="qr" className="w-48 h-48 mb-3" />
              ) : (
                <div className="w-48 h-48 bg-gray-700 mb-3 flex items-center justify-center">QR...</div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded bg-gray-700" onClick={() => setQrModal(null)}>Close</button>
              <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => { downloadDataUrl(qrModal.dataUrl, qrModal.filename); setQrModal(null); }}>Download QR Code</button>
            </div>
          </div>
        </div>
      )}
      {unlinkConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-[90%] max-w-md text-gray-100">
            <h3 className="text-lg font-medium mb-2">Unlink question?</h3>
            <p className="text-sm text-gray-300 mb-4">Are you sure you want to unlink ER question id {unlinkConfirmId}?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={cancelUnlink} className="px-3 py-1 rounded bg-gray-700">Cancel</button>
              <button onClick={() => unlink(unlinkConfirmId)} className="px-3 py-1 rounded bg-red-600 text-white">Unlink</button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={linkQuestion} className="mb-4">
        <label className="block mb-1">Link existing question</label>
        <select value={selectedQuestion} onChange={(e)=>setSelectedQuestion(e.target.value)} className="border border-gray-700 bg-gray-900 text-gray-100 p-2 w-full mb-2">
          <option value="">-- select question --</option>
          {questions.map(q => <option key={q.id} value={q.id}>{q.question}</option>)}
        </select>
        <button className="bg-green-600 text-white px-4" type="submit">Link</button>
      </form>

      <div>
        <button className="bg-blue-600 text-white px-4" onClick={() => setShowCreateModal(true)}>Create Session (teams)</button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-[90%] max-w-md text-gray-100">
            <h3 className="text-lg font-medium mb-2">Create Session</h3>
            <form onSubmit={createSessionRequest} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Number of teams</label>
                <input type="number" min={1} value={createTeamsCount} onChange={e => setCreateTeamsCount(e.target.value)} className="w-full p-2 rounded bg-gray-900 text-gray-100 border border-gray-700" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Session name</label>
                <input value={createSessionName} onChange={e => setCreateSessionName(e.target.value)} className="w-full p-2 rounded bg-gray-900 text-gray-100 border border-gray-700" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-3 py-1 rounded bg-gray-700" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-green-600">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}

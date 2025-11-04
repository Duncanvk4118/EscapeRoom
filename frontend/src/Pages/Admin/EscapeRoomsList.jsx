import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../../utils/api';
import AdminLayout from '../../Components/AdminLayout';

export default function EscapeRoomsList() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/escape-rooms');
      if (Array.isArray(data)) {
        setRooms(data);
        setError(null);
      } else {
        // unexpected response (maybe an error object)
        setRooms([]);
        setError(data && data.error ? data.error : 'Unexpected response from server');
      }
    } catch (e) {
      console.error(e);
      setRooms([]);
      setError(e.message || 'Failed');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    if (!name) return alert('Name required');
    try {
      const r = await api('/admin/escape-rooms', { method: 'POST', body: JSON.stringify({ name }) });
      setName('');
      fetchRooms();
    } catch (err) { alert(err.message || 'Create failed'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete escape room?')) return;
    try {
      await api(`/admin/escape-rooms/${id}`, { method: 'DELETE' });
      fetchRooms();
    } catch (e) { alert(e.message || 'Delete failed'); }
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-xl mb-4">Escape Rooms</h2>
        <form onSubmit={createRoom} className="mb-4 flex gap-2">
          <input className="border border-gray-700 bg-gray-900 text-gray-100 p-2 flex-1" value={name} onChange={(e)=>setName(e.target.value)} placeholder="New escape room name" />
          <button className="bg-blue-600 text-white px-4" type="submit">Create</button>
        </form>

        {loading ? <div>Loading...</div> : (
          error ? <div className="text-red-400">{error}</div> : (
          <table className="w-full bg-gray-800 border border-gray-700 table-auto border-collapse">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 text-left  border-gray-200">ID</th>
                <th className="p-2 text-left  border-gray-200">Name</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="odd:bg-gray-800 even:bg-gray-700">
              {Array.isArray(rooms) && rooms.map(r => (
                <tr key={r.id}>
                  <td className="p-2 text-left border-gray-700">{r.id}</td>
                  <td className="p-2 text-left border-gray-700">{r.name}</td>
                  <td className="p-2 text-left">
                    <Link to={`/admin/escape-rooms/${r.id}`} className="mr-2 text-indigo-400">Manage</Link>
                    <button className="text-red-400" onClick={()=>del(r.id)}>Delete</button>
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

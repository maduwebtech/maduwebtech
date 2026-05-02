import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import api from '../api/axios';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    fetchComments();
  }, [status]);

  const fetchComments = async () => {
    const { data } = await api.get('/admin/comments/all', { params: { status } });
    setComments(data.comments);
  };

  const handleAction = async (id, action) => {
    await api.patch(`/admin/comments/${id}/status`, { status: action });
    fetchComments();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this comment?')) {
      await api.delete(`/admin/comments/${id}`);
      fetchComments();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Comments Management</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-lg capitalize ${status === s ? 'bg-primary text-white' : 'bg-white'}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Post</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Comment</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {comments.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 text-sm max-w-xs truncate">{c.post?.title}</td>
                  <td className="px-4 py-3 text-sm">{c.name}</td>
                  <td className="px-4 py-3 text-sm max-w-md truncate">{c.message}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {status === 'pending' && (
                      <>
                        <button onClick={() => handleAction(c._id, 'approved')} className="p-2 text-green-600 hover:bg-green-50 rounded">
                          <FaCheck size={16} />
                        </button>
                        <button onClick={() => handleAction(c._id, 'rejected')} className="p-2 text-orange-600 hover:bg-orange-50 rounded">
                          <FaTimes size={16} />
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(c._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {comments.length === 0 && <p className="p-8 text-center text-gray-500">No comments found</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminComments;

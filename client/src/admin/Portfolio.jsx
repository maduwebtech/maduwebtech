import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import api from '../api/axios';

const AdminPortfolio = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    websiteUrl: '',
    image: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await api.get('/portfolio/admin/all');
    setItems(data.items);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/portfolio/${editingItem._id}`, form);
      } else {
        await api.post('/portfolio', form);
      }
      setShowForm(false);
      setEditingItem(null);
      setForm({ title: '', description: '', websiteUrl: '', image: '', order: 0, isActive: true });
      fetchItems();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      description: item.description,
      websiteUrl: item.websiteUrl,
      image: item.image,
      order: item.order,
      isActive: item.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this portfolio item?')) {
      await api.delete(`/portfolio/${id}`);
      fetchItems();
    }
  };

  const toggleStatus = async (id) => {
    await api.patch(`/portfolio/${id}/status`);
    fetchItems();
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-400 hover:text-white">
              <FaArrowLeft />
            </Link>
            <h1 className="text-xl font-bold">Portfolio Management</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/admin" className="text-sm hover:text-primary">Dashboard</Link>
            <Link to="/" className="text-sm hover:text-primary">View Site</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <h2 className="font-semibold">Portfolio Projects ({items.length})</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingItem(null);
              setForm({ title: '', description: '', websiteUrl: '', image: '', order: 0, isActive: true });
            }}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> {showForm ? 'Cancel' : 'Add Project'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="font-semibold mb-4">{editingItem ? 'Edit Project' : 'Add New Project'}</h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website URL *</label>
                <input
                  type="url"
                  value={form.websiteUrl}
                  onChange={(e) => setForm({...form, websiteUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  placeholder="https://example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="2"
                  maxLength="500"
                  placeholder="Brief description of the project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({...form, image: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({...form, order: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({...form, isActive: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update' : 'Save'} Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Project</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <div>
                        <p className="font-medium">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 truncate max-w-xs">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      <FaExternalLinkAlt size={12} />
                      Visit
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        title="Toggle Status"
                      >
                        {item.isActive ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="p-8 text-center text-gray-500">No portfolio items found</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPortfolio;

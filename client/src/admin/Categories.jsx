import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../api/axios';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', color: '#ec6630', description: '' });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data.categories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/categories/${editing}`, form);
    } else {
      await api.post('/categories', form);
    }
    setForm({ name: '', slug: '', color: '#ec6630', description: '' });
    setEditing(null);
    setShowForm(false);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, color: cat.color, description: cat.description });
    setEditing(cat._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this category?')) {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Categories</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-6">
          <FaPlus className="inline mr-2" /> Add Category
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => setForm({...form, slug: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({...form, color: e.target.value})}
                className="h-10 border rounded-lg"
              />
            </div>
            <button type="submit" className="mt-4 btn-primary">
              {editing ? 'Update' : 'Create'}
            </button>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Color</th>
                <th className="px-4 py-3 text-left">Posts</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className="w-6 h-6 rounded inline-block" style={{ backgroundColor: cat.color }}></span>
                  </td>
                  <td className="px-4 py-3">{cat.postCount}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;

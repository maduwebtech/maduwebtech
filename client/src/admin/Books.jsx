import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaBook, FaList } from 'react-icons/fa';
import api from '../api/axios';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showChapters, setShowChapters] = useState(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    subject: 'Computer Science',
    description: '',
    chapters: ['']
  });
  const [editing, setEditing] = useState(null);

  const subjects = ['Computer Science', 'Programming', 'Web Development', 'Database', 'Networking', 'Other'];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data } = await api.get('/books/admin/all');
    setBooks(data.books);
  };

  const addChapterField = () => {
    setForm({ ...form, chapters: [...form.chapters, ''] });
  };

  const updateChapter = (index, value) => {
    const newChapters = [...form.chapters];
    newChapters[index] = value;
    setForm({ ...form, chapters: newChapters });
  };

  const removeChapter = (index) => {
    setForm({ ...form, chapters: form.chapters.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      chapters: form.chapters.filter(c => c.trim() !== '')
    };

    if (editing) {
      await api.put(`/books/${editing}`, payload);
    } else {
      await api.post('/books', payload);
    }
    setForm({ title: '', author: '', subject: 'Computer Science', description: '', chapters: [''] });
    setEditing(null);
    setShowForm(false);
    fetchBooks();
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      subject: book.subject,
      description: book.description,
      chapters: book.chapters?.map(c => c.name) || ['']
    });
    setEditing(book._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this book? All its MCQs will also be deleted.')) {
      await api.delete(`/books/${id}`);
      fetchBooks();
    }
  };

  const handleAddChapter = async (bookId, chapterName) => {
    if (!chapterName.trim()) return;
    await api.post(`/books/${bookId}/chapters`, { name: chapterName });
    fetchBooks();
  };

  const handleDeleteChapter = async (bookId, chapterId) => {
    if (confirm('Delete this chapter?')) {
      await api.delete(`/books/${bookId}/chapters/${chapterId}`);
      fetchBooks();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Books Management</h1>
          <Link to="/admin/mcqs" className="text-sm hover:text-primary">Manage MCQs</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-6">
          <FaPlus className="inline mr-2" /> Add Book
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Book Title"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm({...form, author: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <select
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              rows="2"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Chapters</label>
              {form.chapters.map((chapter, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    placeholder={`Chapter ${idx + 1}`}
                    value={chapter}
                    onChange={(e) => updateChapter(idx, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  {form.chapters.length > 1 && (
                    <button type="button" onClick={() => removeChapter(idx)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded">
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addChapterField} className="text-primary text-sm hover:underline">
                + Add another chapter
              </button>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'} Book</button>
              <button type="button" onClick={() => {setShowForm(false); setEditing(null);}} className="text-gray-600">Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Chapters</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {books.map((book) => (
                <tr key={book._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FaBook className="text-primary" />
                      <div>
                        <p className="font-medium">{book.title}</p>
                        {book.author && <p className="text-sm text-gray-500">by {book.author}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{book.subject}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setShowChapters(showChapters === book._id ? null : book._id)}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <FaList /> {book.chapters?.length || 0} chapters
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(book)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => handleDelete(book._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && <p className="p-8 text-center text-gray-500">No books found</p>}
        </div>

        {/* Chapters Modal */}
        {showChapters && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {books.find(b => b._id === showChapters)?.title} - Chapters
              </h3>
              <div className="space-y-2 mb-4">
                {books.find(b => b._id === showChapters)?.chapters?.map((chapter, idx) => (
                  <div key={chapter._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>{idx + 1}. {chapter.name}</span>
                    <button 
                      onClick={() => handleDeleteChapter(showChapters, chapter._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  id="newChapter"
                  placeholder="New chapter name"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('newChapter');
                    handleAddChapter(showChapters, input.value);
                    input.value = '';
                  }}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
              <button onClick={() => setShowChapters(null)} className="w-full py-2 border rounded-lg hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooks;

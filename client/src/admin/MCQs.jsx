import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaBook, FaArrowLeft } from 'react-icons/fa';
import api from '../api/axios';

const AdminMCQs = () => {
  const [mcqs, setMcqs] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    book: '',
    chapter: '',
    difficulty: 'medium',
    questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }]
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchMCQs();
    fetchBooks();
  }, []);

  const fetchMCQs = async () => {
    const { data } = await api.get('/mcqs/admin/all');
    setMcqs(data.mcqSets);
  };

  const fetchBooks = async () => {
    const { data } = await api.get('/books/admin/all');
    setBooks(data.books);
  };

  const getBookChapters = (bookId) => {
    const book = books.find(b => b._id === bookId);
    return book?.chapters || [];
  };

  const getBookName = (bookId) => {
    const book = books.find(b => b._id === bookId);
    return book?.title || 'Unknown Book';
  };

  const getChapterName = (bookId, chapterId) => {
    const book = books.find(b => b._id === bookId);
    const chapter = book?.chapters?.find(c => c._id === chapterId);
    return chapter?.name || 'Unknown Chapter';
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [...form.questions, { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...form.questions];
    newQuestions[index][field] = value;
    setForm({ ...form, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...form.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: newQuestions });
  };

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Validate that we have at least one question
      if (!form.questions || form.questions.length === 0) {
        throw new Error('Please add at least one question');
      }
      
      // Validate each question has all options filled
      for (let i = 0; i < form.questions.length; i++) {
        const q = form.questions[i];
        if (!q.question.trim()) {
          throw new Error(`Question ${i + 1} is empty`);
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].trim()) {
            throw new Error(`Option ${String.fromCharCode(65 + j)} in Question ${i + 1} is empty`);
          }
        }
      }
      
      if (editing) {
        await api.put(`/mcqs/${editing}`, form);
      } else {
        await api.post('/mcqs', form);
      }
      setShowForm(false);
      setEditing(null);
      setSelectedBook(null);
      setForm({ title: '', book: '', chapter: '', difficulty: 'medium', questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }] });
      fetchMCQs();
    } catch (err) {
      console.error('Error saving MCQ:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save MCQ set');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (mcq) => {
    setForm({
      title: mcq.title,
      book: mcq.book?._id || mcq.book,
      chapter: mcq.chapter?._id || mcq.chapter,
      difficulty: mcq.difficulty,
      questions: mcq.questions
    });
    setSelectedBook(mcq.book?._id || mcq.book);
    setEditing(mcq._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this MCQ set?')) {
      await api.delete(`/mcqs/${id}`);
      fetchMCQs();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-400 hover:text-white">
              <FaArrowLeft />
            </Link>
            <h1 className="text-xl font-bold">MCQ Management</h1>
          </div>
          <Link to="/admin/books" className="text-sm hover:text-primary flex items-center gap-2">
            <FaBook /> Manage Books
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary mb-6">
            <FaPlus className="inline mr-2" /> Add MCQ Set
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm mb-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <input
                placeholder="MCQ Set Title"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={form.book}
                onChange={(e) => {
                  setSelectedBook(e.target.value);
                  setForm({...form, book: e.target.value, chapter: ''});
                }}
                className="px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Book</option>
                {books.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
              </select>
              <select
                value={form.chapter}
                onChange={(e) => setForm({...form, chapter: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                required
                disabled={!form.book}
              >
                <option value="">{form.book ? 'Select Chapter' : 'Select Book First'}</option>
                {getBookChapters(form.book).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({...form, difficulty: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <h3 className="font-semibold mb-4">Questions</h3>
            {form.questions.map((q, qIdx) => (
              <div key={qIdx} className="border rounded-lg p-4 mb-4">
                <input
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  required
                />
                <div className="grid md:grid-cols-2 gap-2 mb-2">
                  {q.options.map((opt, oIdx) => (
                    <input
                      key={oIdx}
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                      value={opt}
                      onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                      className="px-4 py-2 border rounded-lg"
                      required
                    />
                  ))}
                </div>
                <select
                  value={q.correctIndex}
                  onChange={(e) => updateQuestion(qIdx, 'correctIndex', parseInt(e.target.value))}
                  className="px-4 py-2 border rounded-lg mr-2"
                >
                  <option value={0}>A</option>
                  <option value={1}>B</option>
                  <option value={2}>C</option>
                  <option value={3}>D</option>
                </select>
                <input
                  placeholder="Explanation (optional)"
                  value={q.explanation}
                  onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full mt-2"
                />
              </div>
            ))}

            <div className="flex gap-4">
              <button type="button" onClick={addQuestion} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg" disabled={saving}>
                + Add Question
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : (editing ? 'Update MCQ Set' : 'Save MCQ Set')}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setError(null); }} className="text-gray-600" disabled={saving}>Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Chapter</th>
                <th className="px-4 py-3 text-left">Questions</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mcqs.map((mcq) => (
                <tr key={mcq._id}>
                  <td className="px-4 py-3 font-medium">{mcq.title}</td>
                  <td className="px-4 py-3 text-sm">{getBookName(mcq.book)}</td>
                  <td className="px-4 py-3 text-sm">{getChapterName(mcq.book, mcq.chapter)}</td>
                  <td className="px-4 py-3">{mcq.questions?.length || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(mcq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => handleDelete(mcq._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {mcqs.length === 0 && <p className="p-8 text-center text-gray-500">No MCQ sets found. Create a book and chapters first.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminMCQs;

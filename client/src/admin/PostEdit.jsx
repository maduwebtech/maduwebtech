import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import api from '../api/axios';
import RichEditor from '../components/RichEditor';
import slugify from 'slugify';

const AdminPostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    status: 'draft',
    postType: 'blog',
    body: '',
    tags: '',
    youtubeUrl: '',
    sourceCodeUrl: '',
    downloadUrl: '',
    shortDescription: '',
    metaDescription: ''
  });
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
    
    if (isEdit) {
      api.get(`/posts/${id}`).then(({ data }) => {
        const post = data.post;
        setForm({
          title: post.title,
          slug: post.slug,
          category: post.category?._id || '',
          status: post.status,
          postType: post.postType || 'blog',
          body: post.body,
          tags: post.tags?.join(', ') || '',
          youtubeUrl: post.youtubeUrl || '',
          sourceCodeUrl: post.sourceCodeUrl || '',
          downloadUrl: post.downloadUrl || '',
          shortDescription: post.shortDescription || '',
          metaDescription: post.metaDescription || ''
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    if (publish) data.append('status', 'published');
    if (thumbnail) data.append('image', thumbnail);

    try {
      if (isEdit) {
        await api.put(`/posts/${id}`, data);
      } else {
        await api.post('/posts', data);
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
    }
    setSaving(false);
  };

  const generateSlug = () => {
    if (form.title) {
      setForm({...form, slug: slugify(form.title, { lower: true, strict: true })});
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{isEdit ? 'Edit Post' : 'New Post'}</h1>
          <button onClick={() => navigate('/admin/posts')} className="text-sm hover:text-primary">
            <FaTimes /> Cancel
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <form className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({...form, slug: e.target.value})}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    required
                  />
                  <button type="button" onClick={generateSlug} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                    Generate
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Post Type</label>
                <select
                  value={form.postType}
                  onChange={(e) => setForm({...form, postType: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="blog">Blog Article</option>
                  <option value="free_source_code">Free Source Code</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({...form, tags: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="react, javascript, tutorial"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Short Description</label>
              <textarea
                value={form.shortDescription}
                onChange={(e) => setForm({...form, shortDescription: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows="2"
                maxLength="300"
                placeholder="Brief description shown in cards (max 300 chars)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Content</label>
              <RichEditor value={form.body} onChange={(v) => setForm({...form, body: v})} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={form.youtubeUrl}
                  onChange={(e) => setForm({...form, youtubeUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Source Code URL</label>
                <input
                  type="url"
                  value={form.sourceCodeUrl}
                  onChange={(e) => setForm({...form, sourceCodeUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {form.postType === 'free_source_code' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Download URL</label>
                <input
                  type="url"
                  value={form.downloadUrl}
                  onChange={(e) => setForm({...form, downloadUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Direct download link for source code (Google Drive, GitHub, etc.)"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => setForm({...form, metaDescription: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows="2"
                maxLength="160"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={saving}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              <FaSave className="inline mr-2" /> Save Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={saving}
              className="btn-primary"
            >
              <FaSave className="inline mr-2" /> Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPostEdit;

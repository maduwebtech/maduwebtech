import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaCode, FaNewspaper, FaArrowLeft } from 'react-icons/fa';
import api from '../api/axios';

const AdminPosts = () => {
  const [searchParams] = useSearchParams();
  const postTypeFromUrl = searchParams.get('type') || '';
  
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ status: '', category: '', search: '', postType: postTypeFromUrl });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, [filters]);

  const getPageTitle = () => {
    if (filters.postType === 'free_source_code') return 'Free Source Code Projects';
    if (filters.postType === 'blog') return 'Blog Posts';
    return 'All Posts';
  };

  const fetchPosts = async () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.postType) params.postType = filters.postType;
    
    const { data } = await api.get('/posts/admin/all', { params });
    setPosts(data.posts);
    setLoading(false);
  };

  const getPostTypeLabel = (type) => {
    if (type === 'free_source_code') return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Free Source</span>;
    if (type === 'blog') return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Blog</span>;
    return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{type}</span>;
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this post?')) {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    }
  };

  const toggleStatus = async (id) => {
    await api.patch(`/posts/${id}/status`);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-400 hover:text-white">
              <FaArrowLeft />
            </Link>
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/admin" className="text-sm hover:text-primary">Dashboard</Link>
            <Link to="/" className="text-sm hover:text-primary">View Site</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Post Type Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({...filters, postType: ''})}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${!filters.postType ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaNewspaper /> All Posts
            </button>
            <button
              onClick={() => setFilters({...filters, postType: 'free_source_code'})}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${filters.postType === 'free_source_code' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaCode /> Free Source Code
            </button>
            <button
              onClick={() => setFilters({...filters, postType: 'blog'})}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${filters.postType === 'blog' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <FaNewspaper /> Blog Posts
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Search posts..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <Link to="/admin/posts/new" className="btn-primary flex items-center gap-2">
              <FaPlus /> New Post
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-xs">{post.title}</p>
                  </td>
                  <td className="px-4 py-3">{getPostTypeLabel(post.postType)}</td>
                  <td className="px-4 py-3 text-sm">{post.category?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => toggleStatus(post._id)} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Toggle Status">
                        {post.status === 'published' ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                      <Link to={`/admin/posts/${post._id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <FaEdit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(post._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && <p className="p-8 text-center text-gray-500">No posts found</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPosts;

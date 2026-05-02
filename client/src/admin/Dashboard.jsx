import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaNewspaper, FaFolder, FaQuestionCircle, FaComment, FaEye, FaPlus, FaCheck, FaTimes, FaUser, FaSignOutAlt, FaBook, FaCog, FaHome, FaCode, FaNewspaper as FaBlogIcon, FaBriefcase } from 'react-icons/fa';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalPosts: 0, totalCategories: 0, totalMCQSets: 0, totalComments: 0, pendingComments: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/admin' },
    { icon: FaCode, label: 'Free Source Code', path: '/admin/posts?type=free_source_code' },
    { icon: FaBlogIcon, label: 'Blog Posts', path: '/admin/posts?type=blog' },
    { icon: FaFolder, label: 'Categories', path: '/admin/categories' },
    { icon: FaBook, label: 'Books & MCQs', path: '/admin/books' },
    { icon: FaQuestionCircle, label: 'MCQ Sets', path: '/admin/mcqs' },
    { icon: FaBriefcase, label: 'Portfolio', path: '/admin/portfolio' },
    { icon: FaComment, label: 'Comments', path: '/admin/comments' },
    { icon: FaCog, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  useEffect(() => {
    api.get('/admin/dashboard/stats').then(({ data }) => {
      setStats(data.stats);
      setRecentPosts(data.recentPosts);
      setRecentComments(data.recentComments);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { icon: FaNewspaper, label: 'Total Posts', value: stats.totalPosts, color: 'bg-blue-500' },
    { icon: FaFolder, label: 'Categories', value: stats.totalCategories, color: 'bg-green-500' },
    { icon: FaQuestionCircle, label: 'MCQ Sets', value: stats.totalMCQSets, color: 'bg-purple-500' },
    { icon: FaComment, label: 'Comments', value: stats.totalComments, color: 'bg-orange-500' },
  ];

  const handleCommentAction = async (id, status) => {
    await api.patch(`/admin/comments/${id}/status`, { status });
    setRecentComments(recentComments.filter(c => c._id !== id));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex-shrink-0 hidden md:block">
        <div className="p-4 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2">
            <FaCode className="text-primary text-xl" />
            <span className="font-bold text-lg">Madu Web Tech</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
              <item.icon className="text-gray-400" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-dark text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm hover:text-primary hidden sm:block">View Site</Link>
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <FaUser size={14} />
                </div>
                <span className="hidden sm:inline text-sm">Admin</span>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile Settings</Link>
                  <Link to="/admin/settings?tab=password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Change Password</Link>
                  <hr className="my-1" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    <FaSignOutAlt className="inline mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {/* Mobile Menu */}
          <div className="md:hidden bg-darker p-2 overflow-x-auto">
            <div className="flex gap-2">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path} className="flex-shrink-0 px-3 py-2 bg-gray-700 rounded-lg text-sm whitespace-nowrap">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card) => (
                <div key={card.label} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                    <card.icon />
                  </div>
                  <p className="text-gray-500 text-sm">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Link to="/admin/posts/new" className="btn-primary flex items-center gap-2">
                  <FaPlus /> New Post
                </Link>
                <Link to="/admin/categories" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">Manage Categories</Link>
                <Link to="/admin/mcqs" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">Manage MCQs</Link>
                {stats.pendingComments > 0 && (
                  <Link to="/admin/comments" className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg">
                    {stats.pendingComments} Pending Comments
                  </Link>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Posts */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-semibold">Recent Posts</h2>
                  <Link to="/admin/posts" className="text-primary text-sm">View All</Link>
                </div>
                <div className="divide-y">
                  {recentPosts.map((post) => (
                    <div key={post._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                      <div>
                        <p className="font-medium truncate max-w-xs">{post.title}</p>
                        <p className="text-sm text-gray-500">{post.category?.name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {post.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Comments */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-semibold">Recent Comments</h2>
                  <Link to="/admin/comments" className="text-primary text-sm">View All</Link>
                </div>
                <div className="divide-y">
                  {recentComments.map((comment) => (
                    <div key={comment._id} className="p-4 hover:bg-gray-50">
                      <p className="text-sm line-clamp-2 mb-2">{comment.message}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">by {comment.name}</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleCommentAction(comment._id, 'approved')} className="text-green-600 hover:bg-green-50 p-1 rounded">
                            <FaCheck size={14} />
                          </button>
                          <button onClick={() => handleCommentAction(comment._id, 'rejected')} className="text-red-600 hover:bg-red-50 p-1 rounded">
                            <FaTimes size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentComments.length === 0 && <p className="p-4 text-gray-500 text-center">No pending comments</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

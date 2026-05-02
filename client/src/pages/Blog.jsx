import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaCalendar, FaEye, FaUser, FaArrowRight } from 'react-icons/fa';
import api from '../api/axios';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1) => {
    try {
      const { data } = await api.get(`/posts?postType=blog&page=${pageNum}&limit=12`);
      if (pageNum === 1) {
        setPosts(data.posts || []);
      } else {
        setPosts(prev => [...prev, ...(data.posts || [])]);
      }
      setHasMore(data.posts?.length === 12);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <>
      <Helmet>
        <title>Blog | Madu Web Tech</title>
        <meta name="description" content="Read latest articles on web development, programming tips, and tech tutorials at Madu Web Tech blog." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark to-darker text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Latest Blog Articles
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest web development trends, tips, and tutorials.
          </p>
        </div>
      </section>

      {/* Google Ad Placeholder - Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-sm">Google Ad Placeholder - Responsive</p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No Articles Yet</h2>
              <p className="text-gray-500">Check back soon for new blog posts!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article key={post._id} className="card overflow-hidden group">
                    <Link to={`/post/${post.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.thumbnail || '/placeholder-blog.jpg'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span 
                            className="inline-block px-2 py-1 text-white text-xs rounded"
                            style={{ backgroundColor: post.category?.color || '#3B82F6' }}
                          >
                            {post.category?.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/post/${post.slug}`}>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.shortDescription || post.body?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaUser size={12} />
                          {post.author?.name || 'Admin'}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendar size={12} />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye size={12} />
                          {post.views}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    Load More <FaArrowRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Google Ad Placeholder - Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-sm">Google Ad Placeholder - Responsive</p>
        </div>
      </div>
    </>
  );
};

export default Blog;

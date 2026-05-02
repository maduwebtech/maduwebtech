import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { getCategory } from '../api/categories';
import PostCard from '../components/PostCard';

const Category = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await getCategory(slug);
        setCategory(data.category);
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [slug, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Link to="/" className="text-primary hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} Tutorials - Madu Web Tech</title>
      </Helmet>

      <div className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name} Tutorials</h1>
          <p className="text-gray-400 mt-2">{pagination.total || 0} tutorials available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No tutorials found in this category yet.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
            <span className="px-4 py-2 bg-primary text-white rounded-lg">
              {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50"
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Category;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../api/axios';
import PostCard from '../components/PostCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.get(`/posts?search=${query}`).then(({ data }) => {
        setResults(data.posts);
        setLoading(false);
      });
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Search</h1>
      <form onSubmit={handleSearch} className="max-w-2xl mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tutorials..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12">Searching...</div>
      ) : query ? (
        <>
          <p className="text-gray-600 mb-6">{results.length} results for &quot;{query}&quot;</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
          {results.length === 0 && <p className="text-gray-500 text-center py-12">No results found.</p>}
        </>
      ) : null}
    </div>
  );
};

export default Search;

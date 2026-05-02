import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaBook, FaQuestionCircle } from 'react-icons/fa';
import api from '../api/axios';

const MCQ = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/books').then(({ data }) => {
      setBooks(data.books);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <>
      <Helmet><title>MCQ Books - Madu Web Tech</title></Helmet>
      <div className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">MCQ Books</h1>
          <p className="text-gray-400 mt-2">Select a book to view chapters and practice MCQs</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link key={book._id} to={`/mcqs/book/${book.slug}`} className="card p-6 hover:-translate-y-1 group">
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded" />
                  ) : (
                    <FaBook className="text-gray-400 text-2xl" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{book.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{book.subject}</p>
                  <span className="text-primary text-sm">{book.chapters?.length || 0} chapters</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {books.length === 0 && (
          <div className="text-center py-12">
            <FaQuestionCircle className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">No books available yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MCQ;

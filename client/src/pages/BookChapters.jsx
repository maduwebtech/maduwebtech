import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaArrowLeft, FaBookOpen, FaQuestionCircle } from 'react-icons/fa';
import api from '../api/axios';

const BookChapters = () => {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/books/${slug}`).then(({ data }) => {
      setBook(data.book);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-primary"></div></div>;

  if (!book) return <div className="text-center py-20">Book not found</div>;

  return (
    <>
      <Helmet><title>{book.title} - Chapters - Madu Web Tech</title></Helmet>
      
      <div className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/mcqs" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4">
            <FaArrowLeft /> Back to Books
          </Link>
          <h1 className="text-3xl font-bold text-white">{book.title}</h1>
          <p className="text-gray-400 mt-2">{book.subject} • {book.chapters?.length || 0} Chapters</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {book.description && (
          <p className="text-gray-600 mb-8">{book.description}</p>
        )}

        <h2 className="text-xl font-semibold mb-6">Select a Chapter</h2>
        
        <div className="space-y-3">
          {book.chapters?.map((chapter, index) => (
            <Link
              key={chapter._id}
              to={`/mcqs/book/${slug}/chapter/${chapter._id}`}
              className="card p-4 flex items-center justify-between hover:shadow-md group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">{chapter.name}</h3>
                  <p className="text-sm text-gray-500">{chapter.mcqCount || 0} MCQs available</p>
                </div>
              </div>
              <FaBookOpen className="text-gray-400 group-hover:text-primary" />
            </Link>
          ))}
        </div>

        {(!book.chapters || book.chapters.length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaQuestionCircle className="text-gray-300 text-4xl mx-auto mb-4" />
            <p className="text-gray-500">No chapters available for this book yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default BookChapters;

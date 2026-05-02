import { Link } from 'react-router-dom';
import { FaCalendar, FaCode } from 'react-icons/fa';
import { format } from 'date-fns';

const PostCard = ({ post }) => {
  return (
    <div className="card overflow-hidden group">
      <Link to={`/post/${post.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <FaCode className="text-4xl text-gray-300" />
            </div>
          )}
          <div 
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: post.category?.color || '#ec6630' }}
          >
            {post.category?.name}
          </div>
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/post/${post.slug}`}>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaCalendar className="mr-2" />
          {post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : 'Draft'}
        </div>
        
        {post.sourceCodeUrl && (
          <a
            href={post.sourceCodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <FaCode className="mr-1" /> View Source Code
          </a>
        )}
      </div>
    </div>
  );
};

export default PostCard;

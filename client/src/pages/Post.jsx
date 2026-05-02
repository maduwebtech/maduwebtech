import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaCalendar, FaUser, FaCode, FaYoutube, FaComments, FaDownload } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../api/axios';
import PostCard from '../components/PostCard';

const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', message: '' });
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${slug}`);
        setPost(data.post);
        setRelatedPosts(data.relatedPosts);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/comments', {
        postId: post._id,
        ...commentForm
      });
      setCommentForm({ name: '', email: '', message: '' });
      setCommentSubmitted(true);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/" className="text-primary hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Madu Web Tech</title>
        <meta name="description" content={post.metaDescription || post.title} />
      </Helmet>

      {/* Thumbnail */}
      <div className="relative h-64 md:h-96 bg-gray-200">
        {post.thumbnail ? (
          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-dark to-darker flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Madu Web Tech</span>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div 
            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4"
            style={{ backgroundColor: post.category?.color || '#ec6630' }}
          >
            {post.category?.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-500 text-sm gap-6">
            <span className="flex items-center"><FaCalendar className="mr-2" />
              {post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : 'Draft'}
            </span>
            <span className="flex items-center"><FaUser className="mr-2" />
              {post.author?.name || 'Admin'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Download button for free source code posts */}
          {post.postType === 'free_source_code' && post.downloadUrl && (
            <a href={post.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <FaDownload /> Download Source Code
            </a>
          )}
          {post.postType === 'free_source_code' && !post.downloadUrl && (
            <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <FaCode /> Source code available below
            </div>
          )}
          {post.sourceCodeUrl && (
            <a href={post.sourceCodeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2">
              <FaCode /> View on GitHub
            </a>
          )}
          {post.youtubeUrl && (
            <a href={post.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2">
              <FaYoutube /> Watch on YouTube
            </a>
          )}
        </div>

        {/* YouTube Embed */}
        {post.youtubeUrl && (
          <div className="mb-8 aspect-video bg-gray-900 rounded-xl overflow-hidden">
            <iframe
              src={post.youtubeUrl.replace('watch?v=', 'embed/')}
              title="YouTube video"
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{tag}</span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaComments /> Leave a Comment
          </h2>

          {commentSubmitted ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg">
              Comment submitted successfully! It will appear after approval.
            </div>
          ) : (
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({...commentForm, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <textarea
                placeholder="Your Message"
                rows="4"
                value={commentForm.message}
                onChange={(e) => setCommentForm({...commentForm, message: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                required
              ></textarea>
              <button type="submit" className="btn-primary">Submit Comment</button>
            </form>
          )}

          {/* Approved Comments */}
          {post.comments?.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-lg">Comments</h3>
              {post.comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{comment.name}</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-600">{comment.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <PostCard key={related._id} post={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post;

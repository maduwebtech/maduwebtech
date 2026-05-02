import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaYoutube, FaArrowRight, FaCode, FaDownload, FaNewspaper, FaBook, FaUserTie } from 'react-icons/fa';
import api from '../api/axios';

const Home = () => {
  const [freeProjects, setFreeProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, blogsRes] = await Promise.all([
          api.get('/posts?postType=free_source_code&limit=4'),
          api.get('/posts?postType=blog&limit=6')
        ]);
        setFreeProjects(projectsRes.data.posts || []);
        setBlogPosts(blogsRes.data.posts || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Madu Web Tech - Learn Coding with Free Tutorials</title>
        <meta name="description" content="Learn web development with free tutorials and source code. HTML, CSS, JavaScript, React, PHP tutorials at Madu Web Tech." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark to-darker text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Madu Web Tech
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Free source code projects, tutorials, MCQs for practice, and portfolio services. 
              Everything you need to become a web developer!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/free-source-code" className="btn-primary text-center flex items-center justify-center gap-2">
                <FaDownload /> Free Source Code
              </Link>
              <Link to="/blog" className="btn-secondary text-center flex items-center justify-center gap-2">
                <FaNewspaper /> Read Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Free Source Code Projects Section */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Free Source Code</h2>
              <p className="text-gray-500">Download complete projects with source code</p>
            </div>
            <Link to="/free-source-code" className="text-primary hover:underline flex items-center gap-1">
              View All <FaArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : freeProjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <FaCode className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Free projects coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {freeProjects.map((project) => (
                <div key={project._id} className="card overflow-hidden group">
                  <Link to={`/post/${project.slug}`}>
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={project.thumbnail || '/placeholder-project.jpg'}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/post/${project.slug}`}>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {project.shortDescription || project.body?.replace(/<[^>]*>/g, '').slice(0, 80)}...
                    </p>
                    <Link to={`/post/${project.slug}`} className="text-primary text-sm font-medium hover:underline">
                      View & Download →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Blog Articles</h2>
              <p className="text-gray-500">Tutorials, tips, and web development insights</p>
            </div>
            <Link to="/blog" className="text-primary hover:underline flex items-center gap-1">
              View All <FaArrowRight />
            </Link>
          </div>
          
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
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12 bg-light rounded-lg">
              <FaNewspaper className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Blog articles coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <article key={post._id} className="card overflow-hidden group">
                  <Link to={`/post/${post.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.thumbnail || '/placeholder-blog.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span 
                          className="px-2 py-1 text-white text-xs rounded"
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
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {post.shortDescription || post.body?.replace(/<[^>]*>/g, '').slice(0, 120)}...
                    </p>
                    <div className="text-sm text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MCQs & Portfolio CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-purple-600/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 text-center hover:-translate-y-1 transition-transform">
              <FaBook className="text-5xl text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Practice with MCQs</h3>
              <p className="text-gray-600 mb-6">
                Test your knowledge with our comprehensive MCQ sets organized by books and chapters.
              </p>
              <Link to="/mcqs" className="btn-primary inline-flex items-center gap-2">
                Start Practicing
              </Link>
            </div>
            <div className="card p-8 text-center hover:-translate-y-1 transition-transform">
              <FaUserTie className="text-5xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Hire Me</h3>
              <p className="text-gray-600 mb-6">
                Need a website or web application? Let's work together on your next project!
              </p>
              <Link to="/portfolio" className="btn-secondary inline-flex items-center gap-2">
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube CTA Section */}
      <section className="py-16 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaYoutube className="text-6xl text-red-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Subscribe on YouTube</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Get video tutorials, project walkthroughs, and coding tips delivered straight to your feed.
          </p>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            <FaYoutube /> Subscribe Now
          </a>
        </div>
      </section>
    </>
  );
};

export default Home;

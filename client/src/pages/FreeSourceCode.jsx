import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaDownload, FaCalendar, FaEye, FaCode } from 'react-icons/fa';
import api from '../api/axios';

const FreeSourceCode = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/posts?postType=free_source_code&limit=100');
      setProjects(data.posts || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Free Source Code Projects | Madu Web Tech</title>
        <meta name="description" content="Download free web development projects with complete source code. React, PHP, JavaScript projects for learning." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark to-darker text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Free Source Code Projects
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Download complete web development projects with source code. 
            Perfect for learning and building your portfolio.
          </p>
        </div>
      </section>

      {/* Google Ad Placeholder - Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-sm">Google Ad Placeholder - Responsive</p>
        </div>
      </div>

      {/* Projects Grid */}
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
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <FaCode className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Projects Yet</h2>
              <p className="text-gray-500">Check back soon for free source code projects!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project._id} className="card overflow-hidden group">
                  <Link to={`/post/${project.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.thumbnail || '/placeholder-project.jpg'}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-2 py-1 bg-primary/90 text-white text-xs rounded">
                          {project.category?.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/post/${project.slug}`}>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.shortDescription || project.body?.replace(/<[^>]*>/g, '').slice(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <FaCalendar size={12} />
                        {new Date(project.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye size={12} />
                        {project.views}
                      </span>
                    </div>
                    {project.downloadUrl ? (
                      <a
                        href={project.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaDownload /> Download Source Code
                      </a>
                    ) : (
                      <Link
                        to={`/post/${project.slug}`}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <FaDownload /> View & Download
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
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

export default FreeSourceCode;

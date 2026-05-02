import { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaEnvelope, FaGithub, FaLinkedin, FaBriefcase } from 'react-icons/fa';
import api from '../api/axios';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/portfolio');
      setProjects(data.items);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">My Portfolio</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            A collection of my web development projects and work
          </p>
          <a
            href="mailto:contact@maduwebtech.com"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaEnvelope /> Hire Me
          </a>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Projects Yet</h2>
            <p className="text-gray-500">Projects will be added soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{project.title.charAt(0)}</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  )}
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <FaExternalLinkAlt size={14} /> Visit Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16 border-t">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-gray-600 mb-8">
            Have a project in mind? I'd love to hear about it.
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="mailto:contact@maduwebtech.com"
              className="flex items-center gap-2 text-gray-700 hover:text-primary"
            >
              <FaEnvelope size={20} /> Email
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-primary"
            >
              <FaGithub size={20} /> GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-primary"
            >
              <FaLinkedin size={20} /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Google Ads Placeholder */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-sm">Google Ads - Responsive</p>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

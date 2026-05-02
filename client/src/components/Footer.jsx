import { Link } from 'react-router-dom';
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaCode } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaCode className="text-primary text-2xl" />
              <span className="font-display font-bold text-xl text-white">Madu Web Tech</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Learn web development with free tutorials and source code. 
              Master HTML, CSS, JavaScript, React, PHP and more.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><FaYoutube size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><FaLinkedin size={20} /></a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/mcqs" className="hover:text-primary transition-colors">MCQs</Link></li>
              <li><Link to="/category/html-css" className="hover:text-primary transition-colors">HTML/CSS</Link></li>
              <li><Link to="/category/javascript" className="hover:text-primary transition-colors">JavaScript</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Subscribe to get the latest tutorials and updates.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-darker text-white px-4 py-2 rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Madu Web Tech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

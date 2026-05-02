import { Helmet } from 'react-helmet-async';

const About = () => (
  <>
    <Helmet><title>About - Madu Web Tech</title></Helmet>
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">About Me</h1>
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to Madu Web Tech! I&apos;m passionate about teaching web development 
              and helping others learn coding skills through practical tutorials.
            </p>
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'PHP', 'MySQL'].map(s => (
                <span key={s} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
            <span className="text-gray-400">Profile Image</span>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default About;

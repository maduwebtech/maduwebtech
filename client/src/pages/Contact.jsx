import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Helmet><title>Contact - Madu Web Tech</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          {submitted ? (
            <div className="text-center text-green-600">Message sent successfully!</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                required
              />
              <textarea
                placeholder="Message"
                rows="4"
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                required
              />
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Contact;

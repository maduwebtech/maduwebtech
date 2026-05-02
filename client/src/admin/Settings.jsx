import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import api from '../api/axios';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    tagline: '',
    socialLinks: {},
    aboutPage: {}
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(({ data }) => {
      setSettings(data.settings);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await api.put('/admin/settings', settings);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <input
              value={settings.siteName || ''}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tagline</label>
            <input
              value={settings.tagline || ''}
              onChange={(e) => setSettings({...settings, tagline: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <h3 className="font-semibold pt-4 border-t">Social Links</h3>
          {['youtube', 'facebook', 'instagram', 'twitter', 'linkedin', 'fiverr'].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium mb-1 capitalize">{platform}</label>
              <input
                value={settings.socialLinks?.[platform] || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, [platform]: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder={`https://${platform}.com/yourprofile`}
              />
            </div>
          ))}

          <button type="submit" disabled={saving} className="btn-primary w-full">
            <FaSave className="inline mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;

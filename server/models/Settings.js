import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Madu Web Tech'
  },
  tagline: {
    type: String,
    default: 'Learn Coding with Free Tutorials'
  },
  logo: {
    type: String,
    default: ''
  },
  favicon: {
    type: String,
    default: ''
  },
  socialLinks: {
    youtube: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    fiverr: { type: String, default: '' }
  },
  newsletterEnabled: {
    type: Boolean,
    default: true
  },
  newsletterProvider: {
    type: String,
    default: 'email'
  },
  analyticsId: {
    type: String,
    default: ''
  },
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: { type: String, default: '' }
  },
  aboutPage: {
    title: { type: String, default: 'About Me' },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    skills: [{ type: String }],
    services: [{ name: String, description: String, icon: String }]
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;

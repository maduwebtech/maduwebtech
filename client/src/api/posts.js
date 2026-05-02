import api from './axios';

export const getPosts = (params) => api.get('/posts', { params });
export const getPost = (slug) => api.get(`/posts/${slug}`);
export const getLatestPosts = (limit = 6) => api.get(`/posts/latest?limit=${limit}`);

export const getAdminPosts = (params) => api.get('/posts/admin/all', { params });
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const togglePostStatus = (id) => api.patch(`/posts/${id}/status`);

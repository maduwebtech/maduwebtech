import api from './axios';

export const getMCQSets = () => api.get('/mcqs');
export const getMCQSet = (id) => api.get(`/mcqs/${id}`);
export const getMCQSetsByCategory = (category) => api.get(`/mcqs/category/${category}`);

export const getAdminMCQSets = () => api.get('/mcqs/admin/all');
export const createMCQSet = (data) => api.post('/mcqs', data);
export const updateMCQSet = (id, data) => api.put(`/mcqs/${id}`, data);
export const deleteMCQSet = (id) => api.delete(`/mcqs/${id}`);

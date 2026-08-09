import { apiClient } from './client';

export const getJobPostings = () => apiClient.get('/job-postings').then((r) => r.data);
export const getJobPosting = (jobPostingId) =>
	apiClient.get(`/job-postings/${jobPostingId}`).then((r) => r.data);
export const deleteJobPosting = (jobPostingId) =>
	apiClient.delete(`/job-postings/${jobPostingId}`).then((r) => r.data);

export const analyzeByUrl = (url) =>
	apiClient.post('/job-postings/url', { url }).then((r) => r.data);

export const analyzeByFile = (file) => {
	const formData = new FormData();
	formData.append('file', file);
	return apiClient.post('/job-postings/file', formData).then((r) => r.data);
};

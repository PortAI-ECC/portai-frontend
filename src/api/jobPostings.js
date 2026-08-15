import { apiClient, currentUserId } from './client';
import { listOf } from './normalize';

// 응답은 { success, data, error } 봉투로 오는데 client 인터셉터가 벗겨 주므로
// 여기서는 알맹이만 다룬다. 식별자는 jobPostingId 가 아니라 id 다.
export const getJobPostings = () => apiClient.get('/job-postings').then((r) => listOf(r.data));

export const getJobPosting = (jobPostingId) =>
	apiClient.get(`/job-postings/${jobPostingId}`).then((r) => r.data);

export const deleteJobPosting = (jobPostingId) =>
	apiClient.delete(`/job-postings/${jobPostingId}`).then((r) => r.data);

export const analyzeByUrl = (url) =>
	apiClient.post('/job-postings/url', { url }).then((r) => r.data);

// 경로가 /file 이 아니라 /pdf 다. userId 는 쿼리가 아니라 폼 필드로 받는다.
export const analyzeByFile = (file) => {
	const formData = new FormData();
	formData.append('file', file);

	const userId = currentUserId();
	if (userId !== undefined && userId !== null) formData.append('userId', userId);

	return apiClient.post('/job-postings/pdf', formData).then((r) => r.data);
};

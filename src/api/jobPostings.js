import { apiClient } from './client';

// 분석 이력 목록 조회·삭제는 Notion 명세서 본문이 비어 있고 쓰는 화면도 없어
// 아직 만들지 않았다. 필요해지면 그때 실제 응답 예시로 추가할 것.
export const getJobPosting = (jobPostingId) =>
	apiClient.get(`/job-postings/${jobPostingId}`).then((r) => r.data);

export const analyzeByUrl = (url) =>
	apiClient.post('/job-postings/url', { url }).then((r) => r.data);

export const analyzeByFile = (file) => {
	const formData = new FormData();
	formData.append('file', file);
	return apiClient.post('/job-postings/file', formData).then((r) => r.data);
};

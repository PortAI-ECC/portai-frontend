import { apiClient } from './client';
import { listOf } from './normalize';
import { RESULT_SECTIONS } from '../constants/resultTypes';

// 응답은 { success, data, error } 봉투로 오는데 client 인터셉터가 벗겨 준다.
// 식별자는 generationId 가 아니라 id 다.
export const getGenerations = () => apiClient.get('/generations').then((r) => listOf(r.data));

export const getGeneration = (generationId) =>
	apiClient.get(`/generations/${generationId}`).then((r) => r.data);

// types 를 주지 않으면 서버가 면접 질문까지 만든다. 이 서비스가 만드는 건
// 자기소개 사이트라 화면에 있는 결과물 종류만 골라서 요청한다.
const DEFAULT_TYPES = RESULT_SECTIONS.map(({ key }) => key);

export const createGeneration = ({ types = DEFAULT_TYPES, ...payload }) =>
	apiClient.post('/generations', { ...payload, types }).then((r) => r.data);

// 재생성은 기존 id 를 다시 쓰는 게 아니라 새 id 로 만들어진다.
// 호출한 쪽은 응답의 id 로 폴링 대상을 바꿔야 한다.
export const regenerate = (generationId) =>
	apiClient.post(`/generations/${generationId}/regenerate`).then((r) => r.data);

export const updateResult = (generationId, type, payload) =>
	apiClient.patch(`/generations/${generationId}/results/${type}`, payload).then((r) => r.data);

export const deleteGeneration = (generationId) =>
	apiClient.delete(`/generations/${generationId}`).then((r) => r.data);

// 다운로드는 결과물 종류별로 따로 받는다.
export const downloadFile = (generationId, type) =>
	apiClient
		.get(`/generations/${generationId}/results/${type}/download`, { responseType: 'blob' })
		.then((r) => r.data);

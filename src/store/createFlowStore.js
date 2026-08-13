import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RECORD_CATEGORIES } from '../constants/recordCategories';

const emptyFreeTexts = Object.fromEntries(RECORD_CATEGORIES.map(({ key }) => [key, '']));

const initialState = {
	// 필드명은 /api/profile 스키마를 따른다.
	// major 만 예외로, 프로필이 아니라 education.major 로 가는 값이다.
	// photoName 도 예외 — 실제 File 은 직렬화가 안 돼 저장할 수 없어 파일명만 기억해 둔다.
	// (채용 공고 업로드의 fileName 과 같은 방식)
	basicInfo: {
		name: '',
		major: '',
		email: '',
		phone: '',
		desiredJob: '',
		introOneLiner: '',
		photoName: '',
	},
	links: [],
	freeTexts: emptyFreeTexts,
	jobPosting: { mode: 'url', url: '', text: '', fileName: '' },
	// 분석 요청이 끝나면 받는 id. 결과물 생성 요청에 그대로 실어 보낸다.
	jobPostingId: null,
	// DB 명세서(preferences 테이블)의 enum/JSON 컬럼과 1:1로 대응한다.
	preferences: { keywords: [], emphasizedTypes: [], style: '' },
	templateId: null,
	generationId: null,
	// 여기까지 가봤다는 표시. 진행바에서 앞 단계로 되돌아갈 수 있는 범위를 정한다.
	maxVisitedStep: 0,
	// 'create' = 새로 만드는 중, 'manage' = 마이페이지에서 기존 사이트를 다시 연 것.
	// 재수집처럼 '이미 만든 사이트를 계속 관리할 때만' 의미 있는 동작을 가른다.
	entryMode: 'create',
};

// 5단계 생성 폼은 페이지를 이동하며 이어지므로, 새로고침에도 살아남도록 persist 한다.
export const useCreateFlowStore = create(
	persist(
		(set) => ({
			...initialState,

			setBasicInfo: (patch) =>
				set((state) => ({ basicInfo: { ...state.basicInfo, ...patch } })),

			setLinks: (links) => set({ links }),
			addLink: (link) => set((state) => ({ links: [...state.links, link] })),
			removeLink: (id) => set((state) => ({ links: state.links.filter((l) => l.id !== id) })),

			setFreeText: (key, value) =>
				set((state) => ({ freeTexts: { ...state.freeTexts, [key]: value } })),

			setJobPosting: (patch) =>
				set((state) => ({ jobPosting: { ...state.jobPosting, ...patch } })),

			setJobPostingId: (jobPostingId) => set({ jobPostingId }),

			visitStep: (step) =>
				set((state) => ({ maxVisitedStep: Math.max(state.maxVisitedStep, step) })),

			setPreferences: (patch) =>
				set((state) => ({ preferences: { ...state.preferences, ...patch } })),

			addPreferenceKeyword: (keyword) =>
				set((state) =>
					state.preferences.keywords.includes(keyword)
						? state
						: {
								preferences: {
									...state.preferences,
									keywords: [...state.preferences.keywords, keyword],
								},
							},
				),

			removePreferenceKeyword: (keyword) =>
				set((state) => ({
					preferences: {
						...state.preferences,
						keywords: state.preferences.keywords.filter((item) => item !== keyword),
					},
				})),

			toggleEmphasizedType: (type) =>
				set((state) => {
					const selected = state.preferences.emphasizedTypes.includes(type);
					return {
						preferences: {
							...state.preferences,
							emphasizedTypes: selected
								? state.preferences.emphasizedTypes.filter((item) => item !== type)
								: [...state.preferences.emphasizedTypes, type],
						},
					};
				}),

			setTemplateId: (templateId) => set({ templateId }),
			setGenerationId: (generationId) => set({ generationId }),

			setEntryMode: (entryMode) => set({ entryMode }),

			reset: () => set(initialState),
		}),
		{ name: 'portai-create-flow' },
	),
);

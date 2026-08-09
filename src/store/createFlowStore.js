import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RECORD_CATEGORIES } from '../constants/recordCategories';

const emptyFreeTexts = Object.fromEntries(RECORD_CATEGORIES.map(({ key }) => [key, '']));

const initialState = {
	// 필드명은 /api/profile 스키마를 그대로 따른다.
	basicInfo: { name: '', email: '', phone: '', desiredJob: '', introOneLiner: '' },
	links: [],
	freeTexts: emptyFreeTexts,
	jobPosting: { mode: 'url', url: '', text: '', fileName: '' },
	templateId: null,
	generationId: null,
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

			setTemplateId: (templateId) => set({ templateId }),
			setGenerationId: (generationId) => set({ generationId }),

			reset: () => set(initialState),
		}),
		{ name: 'portai-create-flow' },
	),
);

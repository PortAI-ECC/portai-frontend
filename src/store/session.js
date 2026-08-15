import { useAuthStore } from './authStore';
import { useCreateFlowStore } from './createFlowStore';

/**
 * 세션을 끝낼 때 남는 게 없도록 한자리에서 지운다.
 *
 * 두 스토어 모두 persist 라 토큰만 비워서는 로컬스토리지에 그대로 남는다.
 * 특히 createFlowStore 에는 이름·이메일·전화번호가 들어 있어, 공용 PC 라면
 * 다음 사람에게 그대로 보인다.
 *
 * 세션이 끝나는 길이 둘이라 함수로 묶는다 — 헤더의 로그아웃 버튼과,
 * refresh 가 실패해 세션이 만료되는 경우(api/client.js 인터셉터)다.
 */
export function endSession() {
	useAuthStore.getState().signOut();
	useCreateFlowStore.getState().reset();
}

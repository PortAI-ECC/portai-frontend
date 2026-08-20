import Modal from '../common/Modal';
import RecordManagerPanel from './RecordManagerPanel';

/** 마이페이지에서 여는 모달 껍데기. 실제 목록·등록 폼은 RecordManagerPanel 이 담당한다. */
function RecordManagerModal({ open, categoryKey, title, onClose, onChanged }) {
	return (
		<Modal open={open} onClose={onClose} title={`${title} 관리`} width="820px">
			<RecordManagerPanel categoryKey={categoryKey} title={title} onChanged={onChanged} />
		</Modal>
	);
}

export default RecordManagerModal;

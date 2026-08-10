import styled from '@emotion/styled';
import { controlStyle } from '../../styles/controlStyle';

const StyledInput = styled.input`
	${controlStyle}
	height: 44px;
`;

// 브라우저 맞춤법 검사는 '임베디드' 같은 멀쩡한 한국어 직무명에도 빨간 줄을
// 그어 거슬린다. 이 폼들은 사전에 없는 고유명사를 자주 받으므로 기본으로 끈다.
function Input(props) {
	return <StyledInput spellCheck={false} {...props} />;
}

export default Input;

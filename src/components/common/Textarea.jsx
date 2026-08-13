import styled from '@emotion/styled';
import { controlStyle } from '../../styles/controlStyle';

const StyledTextarea = styled.textarea`
	${controlStyle}
	min-height: 110px;
	line-height: 1.6;
`;

// Input 과 같은 이유로 맞춤법 검사를 끈다.
function Textarea(props) {
	return <StyledTextarea spellCheck={false} {...props} />;
}

export default Textarea;

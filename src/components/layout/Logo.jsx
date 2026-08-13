import styled from '@emotion/styled';

const Mark = styled.svg`
	width: 26px;
	height: 26px;
	flex: none;
`;

// 발표자료 표지의 체브론 심볼.
function Logo(props) {
	return (
		<Mark viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
			<path d="M3 6h7l6 12 6-12h7L16 27 3 6Z" fill="currentColor" strokeLinejoin="round" />
		</Mark>
	);
}

export default Logo;

import styled from '@emotion/styled';
import { controlStyle } from '../../styles/controlStyle';

const Select = styled.select`
	${controlStyle}
	height: 44px;
	/* 브라우저 기본 화살표가 파스텔 배경에서 튀어 직접 그린다. */
	appearance: none;
	background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
		linear-gradient(135deg, currentColor 50%, transparent 50%);
	background-position:
		calc(100% - 20px) calc(50% + 2px),
		calc(100% - 15px) calc(50% + 2px);
	background-size:
		5px 5px,
		5px 5px;
	background-repeat: no-repeat;
	padding-right: 40px;
`;

export default Select;

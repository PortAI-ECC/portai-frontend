import styled from '@emotion/styled';

const Card = styled.section`
	background: ${({ theme }) => theme.colors.surface};
	backdrop-filter: blur(16px);
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.xl};
	box-shadow: ${({ theme }) => theme.shadows.card};
	padding: ${({ padding = '28px' }) => padding};
`;

export default Card;

import { Global, css, useTheme } from '@emotion/react';

function GlobalStyle() {
	const theme = useTheme();

	return (
		<Global
			styles={css`
				*,
				*::before,
				*::after {
					box-sizing: border-box;
					margin: 0;
					padding: 0;
				}

				html,
				body,
				#root {
					min-height: 100%;
				}

				/* 세로 스크롤바 자리를 늘 비워 둔다. 페이지 길이에 따라 스크롤바가
				   생겼다 없어지면 화면 폭이 그만큼 달라져, 가운데 정렬한 것들이
				   좌우로 흔들린다(활동이력 분야를 옮길 때 눈에 띄었다). */
				html {
					scrollbar-gutter: stable;
				}

				body {
					font-family: ${theme.font.family};
					color: ${theme.colors.text};
					/* 여러 radial 을 겹치므로, 어느 색점도 덮지 않는 영역을 받아줄 바탕색이 필요하다. */
					background-color: ${theme.colors.pageBase};
					background-image: ${theme.gradients.page};
					background-attachment: fixed;
					-webkit-font-smoothing: antialiased;
					line-height: 1.5;
				}

				button {
					font: inherit;
					color: inherit;
					background: none;
					border: none;
					cursor: pointer;
				}

				input,
				textarea,
				select {
					font: inherit;
					color: inherit;
				}

				textarea {
					resize: vertical;
				}

				a {
					color: inherit;
					text-decoration: none;
				}

				ul,
				ol {
					list-style: none;
				}

				img {
					display: block;
					max-width: 100%;
				}

				:focus-visible {
					outline: 2px solid ${theme.colors.primary};
					outline-offset: 2px;
				}
			`}
		/>
	);
}

export default GlobalStyle;

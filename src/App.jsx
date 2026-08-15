import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './routes/PrivateRoute';
import { ROUTES } from './constants/routes';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import PortfolioPage from './pages/PortfolioPage';
import NotFoundPage from './pages/NotFoundPage';
import BasicInfoPage from './pages/create/BasicInfoPage';
import LinksPage from './pages/create/LinksPage';
import FreeTextPage from './pages/create/FreeTextPage';
import JobPostingPage from './pages/create/JobPostingPage';
import DraftResultPage from './pages/create/DraftResultPage';
import FinalPreviewPage from './pages/create/FinalPreviewPage';
import DeployedPage from './pages/create/DeployedPage';
import PortfolioTemplateDemo from './components/result/templates/PortfolioTemplateDemo';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<BrowserRouter>
				<Routes>
					{/* 배포된 포트폴리오는 헤더 없이 단독으로 보여준다. */}
					<Route path={ROUTES.PORTFOLIO} element={<PortfolioPage />} />

					{/* 임시 확인용: 포트폴리오 템플릿 6종 + 강조 선택 데모. DraftResultPage·
					    FinalPreviewPage 가 쓰는 것과 같은 매핑 함수를 로그인·백엔드 없이
					    검증하는 자리라 실제 배선과 별개로 계속 둔다. */}
					<Route path="/dev/portfolio-templates" element={<PortfolioTemplateDemo />} />

					<Route element={<AppLayout />}>
						<Route path={ROUTES.HOME} element={<HomePage />} />
						<Route path={ROUTES.LOGIN} element={<LoginPage />} />
						<Route path={ROUTES.SIGNUP} element={<SignUpPage />} />

						<Route path={ROUTES.CREATE_BASIC} element={<BasicInfoPage />} />
						<Route path={ROUTES.CREATE_LINKS} element={<LinksPage />} />
						<Route path={ROUTES.CREATE_TEXT} element={<FreeTextPage />} />
						<Route path={ROUTES.CREATE_JOB} element={<JobPostingPage />} />
						<Route path={ROUTES.CREATE_DRAFT} element={<DraftResultPage />} />
						<Route path={ROUTES.CREATE_PREVIEW} element={<FinalPreviewPage />} />
						<Route path={ROUTES.CREATE_DONE} element={<DeployedPage />} />

						<Route element={<PrivateRoute />}>
							<Route path={ROUTES.MYPAGE} element={<MyPage />} />
						</Route>

						<Route
							path="/create"
							element={<Navigate to={ROUTES.CREATE_BASIC} replace />}
						/>
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;

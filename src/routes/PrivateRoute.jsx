import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsLoggedIn, useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';

function PrivateRoute() {
	const isLoggedIn = useAuthStore(selectIsLoggedIn);
	const location = useLocation();

	if (!isLoggedIn) {
		return <Navigate to={ROUTES.HOME} state={{ from: location.pathname }} replace />;
	}

	return <Outlet />;
}

export default PrivateRoute;

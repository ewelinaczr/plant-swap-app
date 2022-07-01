import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "./hooks/useAuthStatus";
import Spinner from "./Spinner";

const PrivateRoute = () => {
	const { loggedIn, checkingStatus } = useAuthStatus();

	if (checkingStatus) {
		return <Spinner />;
		return <h3>loading...</h3>;
	}

	return loggedIn ? <Outlet /> : <Navigate to='/log-in' />;
};

export default PrivateRoute;


import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";



function ProtectedRoute() {

    const { isAuthenticated, checking } = useSelector(
        (state) => state.auth
    );

    if (checking) {
        return <p>Checking authentication...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;

}

export default ProtectedRoute;

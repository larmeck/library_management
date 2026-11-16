
import { useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { useDispatch } from "react-redux";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./services/api";
import {
    setCredentials,
    logout,
    setChecking
} from "./features/auth/authSlice";


function AppContent() {

    const dispatch = useDispatch();


    useEffect(() => {

        async function checkAuthentication() {

            const access = localStorage.getItem("access");

            if (!access) {

                dispatch(logout());

                return;
            }

            try {

                const response = await api.get("me/");

                dispatch(setCredentials({
                    user: response.data
                }));

            } catch (error) {

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                dispatch(logout());

            } finally {

                dispatch(setChecking(false));

            }

        }

        checkAuthentication();

    }, [dispatch]);


    return (

        <Routes>

            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />


            <Route
                path="/login"
                element={<Login />}
            />


            <Route element={<ProtectedRoute />}>

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Route>


            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />

        </Routes>

    );

}


function App() {

    return (

        <BrowserRouter>

            <AppContent />

        </BrowserRouter>

    );

}

export default App;


import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { setCredentials } from "../features/auth/authSlice";



const validationSchema = Yup.object({

    username: Yup.string()
        .required("Username is required"),

    password: Yup.string()
        .required("Password is required")

});



function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleLogin(values) {

        try {

            setLoading(true);
            setError("");

            const response = await api.post("login/", values);

            const access = response.data.access;
            const refresh = response.data.refresh;

            
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

          
            const userResponse = await api.get("me/");

            
            dispatch(setCredentials({ user: userResponse.data}));
            navigate("/dashboard");

        } 
        
        
        catch (error) {

            setError(
                error.response?.data?.detail || "Invalid username or password"
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="auth-container">

            <h2>Login</h2>

            {error && (<p className="error">{error}</p> )}

            <Formik

                initialValues={{
                    username: "",
                    password: ""
                }}

                validationSchema={validationSchema}

                onSubmit={handleLogin}

            >

                <Form>

                    <label>Username</label>

                    <Field
                        type="text"
                        name="username"
                        placeholder="Enter username"
                    />

                    <ErrorMessage
                        name="username"
                        component="div"
                        className="error"
                    />


                    <label>Password</label>

                    <Field
                        type="password"
                        name="password"
                        placeholder="Enter password"
                    />

                    <ErrorMessage
                        name="password"
                        component="div"
                        className="error"
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading ? "Logging in..." : "Login"}

                    </button>

                </Form>

            </Formik>

            <p>
                Don't have an account? Contact your administrator
                to create one.
            </p>

        </div>

    );

}

export default Login;


import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    user: null,
    isAuthenticated: false,
    checking: true
};


const authSlice = createSlice({

    name: "auth",
    initialState,

    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user; 
            state.isAuthenticated = true;
            state.checking = false;
        },
        setChecking: (state, action) => {
            state.checking = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.checking = false;
        }

    }

});

export const {setCredentials,setChecking,logout} = authSlice.actions;

export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    idToken: localStorage.getItem('token') || '',
    isLoggedIn: localStorage.getItem('token') !== '' ? true : false,
    email: localStorage.getItem('email') || '' 
}

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state) {
            state.isLoggedIn = true;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.email = '';
            state.idToken = '';
        },
        setEmail(state, action) {
            state.email = action.payload;
            if(action.payload === '') {
                localStorage.removeItem('email')
            } else {
                localStorage.setItem('email', state.email)
            }
        },
        setIdToken(state, action) {
            state.idToken = action.payload;
            if(action.payload === '') {
                localStorage.removeItem('token')
            } else {
                localStorage.setItem('token', state.idToken)
            }
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
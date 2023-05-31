import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    idToken: localStorage.getItem('token') || '',
    isLoggedIn: localStorage.getItem('token') !== '' ? true : false
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
        },
        setIdToken(state, action) {
            state.idToken = action.payload
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
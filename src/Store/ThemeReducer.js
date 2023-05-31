import { createSlice } from "@reduxjs/toolkit";

const initialThemeState = {
    changeTheme: 'light',
    showThemeButton: false,
}

const themeSlice = createSlice({
    name: 'theme',
    initialState: initialThemeState,
    reducers: {
        showThemeButton(state) {
            state.showThemeButton = true;
        },
        changeTheme(state) {
            state.changeTheme = state.changeTheme === 'light' ? 'dark' : 'light';
        }
    }
})

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
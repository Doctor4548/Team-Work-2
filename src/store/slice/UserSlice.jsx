import { createSlice } from "@reduxjs/toolkit";



const initialState={
    loginin_user: localStorage.getItem("token")||"",
    user_info: localStorage.getItem('userInfo')||{}
}

export const users=createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action){
            state.loginin_user=action.payload.data;
            localStorage.setItem("token",action.payload.data);

        },
        logout(state, action){
            state.loginin_user="";
            state.user_info={};
            localStorage.removeItem('userInfo');
            localStorage.removeItem("token");
        },
        saveUserName(state, action){
            state.user_info=action.payload;
            localStorage.setItem('userInfo', action.payload);
        }
//
    },
});

export const{newUser, login, logout, saveUserName}=users.actions;

export default users.reducer;
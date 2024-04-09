import { createSlice } from "@reduxjs/toolkit";

const initialState={
    visitedPage: ["/"],
    lastPage: ""
}

const visited=createSlice({
    name: "visited",
    initialState,
    reducers: {
        enterNewPage(state,action){
            state.visitedPage.push(action.payload);
            //state.lastPage=action.payload;
        },
        gotoLastPage(state,action){
             state.lastPage=state.visitedPage.pop();
        },


    }
})

export const{enterNewPage, gotoLastPage}=visited.actions

export default visited.reducer
import { createSlice } from "@reduxjs/toolkit";

const initialState={
    commentContent:[],
    cidList: [],
    sendMinorComment: false,
}

const comment = createSlice({
    name: 'cidList',
    initialState,
    reducers:{
        viewComment(state, action){
            state.cidList.push(action.payload);
        },
        cancelView(state,action){
            state.cidList.splice(state.cidList.indexOf(action.payload), 1);
        },
        commentChange(state, action){
            state.commentContent.push(action.payload);
        },
        minorCommentStatus(state, action){
            state.sendMinorComment= !state.sendMinorComment;
        }

    }

})

export const{viewComment, cancelView, commentChange, minorCommentStatus}=comment.actions;
export default comment.reducer;

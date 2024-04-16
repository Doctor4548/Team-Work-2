import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyWords: '',
    genre: 0,
    filtered: false
}

const filter = createSlice({
    name : 'filter',
    initialState,
    reducers: {
        filterType(state, action){
            state.genre = action.payload;
        },
        searchKeyWord(state, action){
            state.keyWords = action.payload;
        },
        justFilter(state,action){
            state.filtered = action.payload
        }

    }
})

export const {filterType, searchKeyWord, justFilter}=filter.actions;
export default filter.reducer;
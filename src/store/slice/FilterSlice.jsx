import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyWords: '',
    genre: 0,
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
        }

    }
})

export const {filterType, searchKeyWord}=filter.actions;
export default filter.reducer;
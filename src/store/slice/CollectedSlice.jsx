import { createSlice } from "@reduxjs/toolkit";

const initialState={
    collectedMusics: [],
    choose: {},
    alreadyLikedMusics: [],
    alreadyCollectedMusics: [],
    addedOrRemovedCollect: false,
    collectName:'',
}

export const collected=createSlice({
    name: "collected",
    initialState,
    reducers:{
        getCollected(state,action){
            state.collectedMusics=action.payload
        },
        collectUserChoose(state, action){
            state.choose=action.payload;
        },
        likeCollection(state, action){
            if(!state.alreadyLikedMusics.includes(action.payload)){
                state.alreadyLikedMusics.push(action.payload);
            }
        },
        collectCollection(state, action){
            if(!state.alreadyCollectedMusics.includes(action.payload)){
                state.alreadyCollectedMusics.push(action.payload);
            }
        },
        resetCollection(state,action){
            state.alreadyCollectedMusics=[];
            state.alreadyLikedMusics=[];
            state.collectedMusics=[];
            state.choose={};
        },
        changeCollectStatus(state, action){
            state.addedOrRemovedCollect= !state.addedOrRemovedCollect;
        },
        dislikeCollection(state,action){
            state.alreadyLikedMusics.splice(state.alreadyLikedMusics.indexOf(action.payload),1);
        },
        uncollectCollection(state, action){
            state.alreadyCollectedMusics.splice(state.alreadyCollectedMusics.indexOf(action.payload),1);
        },
        changeCollectName(state,action){
            state.collectName=action.payload;
        }
    }
});


export const{changeCollectName, getCollected, collectUserChoose, resetCollection, changeCollectStatus, likeCollection, collectCollection,dislikeCollection,uncollectCollection}=collected.actions
export default collected.reducer
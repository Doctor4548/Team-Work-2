import { configureStore } from "@reduxjs/toolkit";

import UserReduce from "./slice/UserSlice";
import VisitedReduce from "./slice/VisitedPageSlice"
import CollectedSlice from "./slice/CollectedSlice";
import FilterSlice from "./slice/FilterSlice";
import CommentSlice from "./slice/CommentSlice";

export const store=configureStore({
    reducer:{
        user: UserReduce,
        visited: VisitedReduce,
        collected: CollectedSlice,
        filter: FilterSlice,
        cidList: CommentSlice
    }
})
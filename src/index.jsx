import React from "react";
import "./style.css";
import ReactDOM from "react-dom/client"

import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route} from "react-router-dom";
import { Provider } from "react-redux";

import Home from "./page/Home";
import MainContent from "./page/MainContent.jsx";
import Musics from "./page/Musics.jsx";
import SpecificMusic from "./page/SpecificMusic.jsx";

import UserRegister from "./page/UserRegister.jsx";
import UserLogin from "./page/UserLogin.jsx";
import Collected from "./page/Collected.jsx";

import {store} from "./store/Store.jsx"

const router=createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Home />}>
        <Route index element={<MainContent />} />
        <Route path="login" element={<UserLogin />}/>
        <Route path="register" element={<UserRegister />}/>
        <Route path="specific">
            <Route path=":choose" element={<SpecificMusic />}/>
        </Route>
        <Route path="musics">
            <Route path=":choose" element={<Musics />}/>
        </Route>
        <Route path="collected" element={<Collected />}>
            <Route path=":choose" />
        </Route>
    </Route>
))




function App(){
    return(
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />)
import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { gotoLastPage, goback } from "../store/slice/VisitedPageSlice";
import { useNavigate } from "react-router";

import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import { searchKeyWord, justFilter } from "../store/slice/FilterSlice";

export default function Headers() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const paths = useSelector((state) => { return state.visited.visitedPage });


    function lastPage() {
        if (paths.length > 0) {
            dispatch(gotoLastPage());
            const path = paths[paths.length - 1];

            const urls = path.split("/").slice(1);
            navigate(`./${urls.join("/")}`);
        }
        else {
            navigate(`./`);
        }
    }

    const onSearch = (value, _e, info) => {
        dispatch(searchKeyWord(value));
        dispatch(justFilter(true));
    }

    const { Search } = Input;
    const suffix = (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1677ff',
            }}
        />
    );
    function searchContentChange(e){
        if(e.target.value===''){
            dispatch(searchKeyWord(''))
        }
    }

    return (
        <div className="header">
            <div onClick={lastPage} className="headerLeft">
                <LeftOutlined />
            </div>

            <div className="headerRight">
                <Search
                    placeholder="Search Musics"
                    onSearch={onSearch}
                    onChange={searchContentChange}
                    className="header-search"
                    style={{
                        width: 250,
                    }}
                />
            </div>

        </div>
    )
}
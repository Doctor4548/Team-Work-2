import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { filterType, justFilter } from "../store/slice/FilterSlice";
import { enterNewPage } from "../store/slice/VisitedPageSlice";
import axios from "axios";

export default function Musics() {
    const {choose} = useParams();

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const genre = useSelector((state) => { return state.filter.genre });
    const keyWords = useSelector((state) => { return state.filter.keyWords });
    const filtered = useSelector((state)=>{return state.filter.filtered})

    const [musicGenres, setMusicGenres] = React.useState([]);
    const [musicList, setMusicList] = React.useState([]);
    const [pageNum, setPageNum] = React.useState(1);
    const [secondLoading, setSecondLoading] = React.useState(false);

    const [lastScrollY, setLastScrollY]=React.useState(0);


    const genres = musicGenres.map((item) => {
        return (
            <button key={item.gid} className="filter-type" onClick={() => { searchGenre(item.gid) }}>{item.gname}</button>
        )
    })

    function searchGenre(genreID) {
        //console.log(searchParams.toString());        
        //navigate(`../${choose}?searchGenre=`);
        dispatch(filterType(genreID));
        dispatch(justFilter(true));
    }

    async function getMusicGenres() {
        await axios({
            headers: {
                'Content-Type': "application/json",
            },
            method: "GET",
            url: "http://47.251.46.15/genre",
            data: {

            }

        }).then((code) => {
            //console.log(code);
            setMusicGenres(code.data.data);
        })
    }

    const musics = musicList.map((item) => {
        return (
            <div className="page-music" onClick={() => { gotoSpecific(item.sid) }} key={item.sid}>
                <img src={item.image} className="page-music-image"></img>
                <span className="music-title">{item.title}</span>
            </div>
        )
    })


    async function getMusic() {
        if (genre > 0 && keyWords !== '') {
            await axios({
                headers: {
                    'Content-Type': "application/json",
                },
                method: "POST",
                url: "http://47.251.46.15/songs",
                data: {
                    keyWords: keyWords,
                    genre: genre.toString(),
                    pageNum: pageNum,
                }

            }).then((code) => {

                if(code.data.data.rows.length>0){
                    setSecondLoading(false);
                }

                if(filtered){
                    setMusicList(code.data.data.rows);
                }else{
                    setMusicList((old) => {
                        return [...old, ...code.data.data.rows]
                    })
                }

                dispatch(justFilter(false));

            })
        } else if (genre > 0) {
            await axios({
                headers: {
                    'Content-Type': "application/json",
                },
                method: "POST",
                url: "http://47.251.46.15/songs",
                data: {
                    genre: genre.toString(),
                    pageNum: pageNum,
                }

            }).then((code) => {

                if(code.data.data.rows.length>0){
                    setSecondLoading(false);
                }

                if(filtered){
                    setMusicList(code.data.data.rows);
                }else{
                    setMusicList((old) => {
                        return [...old, ...code.data.data.rows]
                    })
                }

                dispatch(justFilter(false));
                


            })
        } else if (keyWords !== '') {
            await axios({
                headers: {
                    'Content-Type': "application/json",
                },
                method: "POST",
                url: "http://47.251.46.15/songs",
                data: {
                    keyWords: keyWords,
                    pageNum: pageNum,
                }

            }).then((code) => {
                if(code.data.data.rows.length>0){
                    setSecondLoading(false);
                }

                if(filtered){
                    setMusicList(code.data.data.rows);
                }else{
                    setMusicList((old) => {
                        return [...old, ...code.data.data.rows]
                    })
                }

                dispatch(justFilter(false));


            })
        } else {
            await axios({
                headers: {
                    'Content-Type': "application/json",
                },
                method: "POST",
                url: "http://47.251.46.15/songs",
                data: {
                    pageNum: pageNum,
                }

            }).then((code) => {
                if(code.data.data.rows.length>0){
                    setSecondLoading(false);
                }

                if(filtered){
                    setMusicList(code.data.data.rows);
                }else{
                    setMusicList((old) => {
                        return [...old, ...code.data.data.rows]
                    })
                }

                dispatch(justFilter(false));



                /*if(code.data.data.pageNum*code.data.data.pageSize>=code.data.data.total){
                    setDisplayAllMusics(true);
                }*/

            })
        }
    }
    


    window.onscroll = function () {
        // 判断是否滚动到页面底部
        if(choose === 'placeholder'){
            if(window.scrollY>lastScrollY){

                if (!secondLoading && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                    setPageNum((old) => (old + 1));
                    setSecondLoading(true);
    
                    window.scrollTo({
                        top: lastScrollY-30,
                        behavior: "smooth"
                    })
                }
        
            }
            setLastScrollY(window.scrollY);
        }


    };


    React.useEffect(() => {

        if(filtered){            
            setPageNum(1);
            setSecondLoading(false);
            setLastScrollY(0);
            setMusicList([]);
        }

        getMusicGenres();
        getMusic();
    }, [genre, keyWords, pageNum]);



    React.useEffect(() => {
        searchGenre(0)
    }, [])

    function gotoSpecific(id) {
        const path = location.pathname;
        dispatch(enterNewPage(path))
        navigate(`../../specific/${id}`)
    }



    return (
        <div className="musics-page">
            <div className="filter-container">
                <button className="filter-type" onClick={() => { searchGenre(0) }}>All</button>
                {genres}
            </div>
            <div className="page-musics">
                {musics}
            </div>

        </div>
    )
}
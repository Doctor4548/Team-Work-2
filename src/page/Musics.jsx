import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { filterType, searchKeyWord } from "../store/slice/FilterSlice";
import { enterNewPage } from "../store/slice/VisitedPageSlice";
import axios from "axios";

export default function Musics() {
    const { choose } = useParams();
    const [searchParams] = useSearchParams();

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const genre = useSelector((state)=>{return state.filter.genre});
    const keyWords = useSelector((state)=>{return state.filter.keyWords});


    const [musicGenres, setMusicGenres] = React.useState([]);
    const [musicList, setMusicList] = React.useState([]);
    const [pageNum, setPageNum] = React.useState(1);
    const [displayAllMusics, setDisplayAllMusics] = React.useState(false);
    const [secondLoading, setSecondLoading] = React.useState(false);


    const genres = musicGenres.map((item) => {
        return (
            <button key={item.gid} className="filter-type" onClick={() => { searchGenre(item.gid) }}>{item.gname}</button>
        )
    })

    function searchGenre(genreID) {
        //console.log(searchParams.toString());        
        //navigate(`../${choose}?searchGenre=`);
        dispatch(filterType(genreID));
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
        return(
        <div className="page-music" onClick={() => { gotoSpecific(item.sid) }} key={item.sid}>
            <img src={item.image} className="page-music-image"></img>
            <span className="music-title">{item.title}</span>
        </div>
        )
    })


    async function getMusic() {
        if(genre>0&&keyWords!==''){
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
                setMusicList((old)=>{
                    return [...old, ...code.data.data.rows]
                })

                if(code.data.data.pageNum*code.data.data.pageSize>=code.data.data.total){
                    setDisplayAllMusics(true);
                }

            })
        }else if(genre > 0){
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
                setMusicList((old)=>{
                    return [...old, ...code.data.data.rows]
                })

                if(code.data.data.pageNum*code.data.data.pageSize>=code.data.data.total){
                    setDisplayAllMusics(true);
                }

            })
        }else if(keyWords!==''){
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
                setMusicList((old)=>{
                    return [...old, ...code.data.data.rows]
                })

                if(code.data.data.pageNum*code.data.data.pageSize>=code.data.data.total){
                    setDisplayAllMusics(true);
                }

            })
        }else{
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

                setMusicList((old)=>{
                    return [...old, ...code.data.data.rows]
                })

                if(code.data.data.pageNum*code.data.data.pageSize>=code.data.data.total){
                    setDisplayAllMusics(true);
                }
                
            })
        }
    }


    window.onscroll = function() {
        // 判断是否滚动到页面底部
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !displayAllMusics) {
            console.log(pageNum);

          setPageNum((old)=>(old+1));
          setSecondLoading(true);

        }
      };


    React.useEffect(() => {
        getMusicGenres();
        getMusic();
    }, [genre, keyWords, pageNum]);

    React.useEffect(()=>{
        searchGenre(0)
    },[])

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
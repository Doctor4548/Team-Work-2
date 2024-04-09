import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { filterType } from "../store/slice/FilterSlice";
import { enterNewPage } from "../store/slice/VisitedPageSlice";
import { changeCollectStatus } from "../store/slice/CollectedSlice";
import { Button, message, Popconfirm } from 'antd';


export default function Collected() {
    const { choose } = useParams();
    const userToken = useSelector((state) => { return state.user.loginin_user });
    const genre = useSelector((state) => { return state.filter.genre });
    const collectName = useSelector((state)=>{return state.collected.collectName});
    const [newName, setNewName] = React.useState(collectName);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [musicGenres, setMusicGenres] = React.useState([]);
    const [collectedMusics, setCollectedMusics] = React.useState([]);


    async function getCollected() {
        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "GET",
            url: `http://47.251.46.15/lists/${choose}`,
            data: {

            }
        }).then((code) => {
            setCollectedMusics(code.data.data.rows);
        });
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

    React.useEffect(() => {
        getCollected();
        getMusicGenres();
    }, [choose]);

    React.useEffect(() => {
        searchGenre(0);
    }, []);

    React.useEffect(()=>{
        setNewName(collectName);
    }, [collectName])

    function searchGenre(genreID) {
        //console.log(searchParams.toString());        
        //navigate(`../${choose}?searchGenre=`);
        dispatch(filterType(genreID));
    }

    const genres = musicGenres.map((item) => {
        return (
            <button key={item.gid} className="filter-type" onClick={() => { searchGenre(item.gid) }}>{item.gname}</button>
        )
    });

    function gotoSpecific(id) {
        const path = location.pathname;
        dispatch(enterNewPage(path))
        navigate(`../../specific/${id}`)
    }

    const displayCollected = collectedMusics.map((item) => {
        if (genre === 0) {
            return (
                <div className="page-music" onClick={() => { gotoSpecific(item.sid) }} key={item.sid}>
                    <img src={item.image} className="page-music-image"></img>
                    <span className="music-title">{item.title}</span>
                </div>
            )
        } else if (genre === item.genre) {
            return (
                <div className="page-music" onClick={() => { gotoSpecific(item.sid) }} key={item.sid}>
                    <img src={item.image} className="page-music-image"></img>
                    <span className="music-title">{item.title}</span>
                </div>
            )
        }


    })

    async function unCollected() {
        await axios({
            headers: {
                'Content-Type': "application/json",
                'Authorization': userToken
            },
            method: "DELETE",
            url: `http://47.251.46.15/lists/${choose}`,
        }).then((code) => {
            dispatch(changeCollectStatus())
            navigate('../../');

        }).catch((err) => {
            console.log(err);
        })
    }

    const confirm = (e) => {
        unCollected();
        message.success('Delete Successfully');
    };

    const cancel = (e) => {
        
    };

    async function updateCollect(){
        await axios({
            headers: {
                'Content-Type': "application/json",
                'Authorization': userToken
            },
            method: 'PATCH',
            url: `http://47.251.46.15/lists/${choose}?name=${newName}`,
        }).then((code) => {
            dispatch(changeCollectStatus())
        }).catch((err) => {
            console.log(err);
        })
    }


    return (
        <div className="collect-page">
            <div className="editCollection">
                {newName.trim()!==collectName && <button onClick={()=>{setNewName(collectName)}}>Reset</button>}
                {collectName!=='我喜欢的音乐' && <input value={newName} onChange={(e)=>{setNewName(e.target.value)}}/>}
                {newName.trim()!==collectName && newName.trim()!=='' && <button onClick={updateCollect}>Update</button>}
            </div>
 
            <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <Button danger className="collect-button">X</Button>
            </Popconfirm>
            <div className="filter-container">
                <button className="filter-type" onClick={() => { searchGenre(0) }}>All</button>
                {genres}
            </div>
            <div className="page-musics">
                {displayCollected}
            </div>

        </div>
    )
}
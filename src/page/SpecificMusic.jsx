import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { CaretRightOutlined, PauseOutlined, LikeOutlined, HeartOutlined, CommentOutlined } from "@ant-design/icons";
import MinorComment from "./MinorComment";
import { viewComment, cancelView, minorCommentStatus } from "../store/slice/CommentSlice";
import { Button, Modal, Switch, message, Popconfirm } from 'antd';
import { likeCollection, collectCollection, changeCollectStatus, dislikeCollection, uncollectCollection } from "../store/slice/CollectedSlice";


export default function SpecificMusic() {
    const { choose } = useParams();
    const [loading, setLoading] = React.useState(false);
    const [commentFilter, setCommentFilter] = React.useState(false);
    const [comments, setComments] = React.useState({});
    const [displayLikedComments, setDisplayLikedComments] = React.useState([]);

    const [commentContent, setCommentContent] = React.useState('');
    const [secondComment, setSecondComment] = React.useState('')

    const [reply, setReply] = React.useState("");

    const [musicDetail, setMusicDetail] = React.useState({});
    const [collectUserChoose, setCollectUserChoose] = React.useState(0);
    const [collectUserCreate, setCollectUserCreate] = React.useState('');
    const [collectSwitch, setCollectSwitch] = React.useState(true);

    const alreadyLiked = useSelector((state) => { return state.collected.alreadyLikedMusics });
    const alreadyCollected = useSelector((state) => { return state.collected.alreadyCollectedMusics });
    const sendMinorComment = useSelector((state) => { return state.cidList.sendMinorComment });

    const userToken = useSelector((state) => { return state.user.loginin_user });
    const userInfo = useSelector((state) => { return state.user.user_info });
    const commentDoNotExist = useSelector((state) => { return state.cidList.commentContent });
    const cidList = useSelector((state) => { return state.cidList.cidList });
    const collectedList = useSelector((state) => { return state.collected.collectedMusics });

    const [collectedImIn, setCollectedImIn] = React.useState('');
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    async function whichCollectThisMusicIsIn(){
        
        collectedList.map((collect) => {
            if (collect.name !== '我喜欢的音乐') {
                axios({
                    headers: {
                        'Content-Type': "application/json",
                        "Authorization": userToken
                    },
                    method: "GET",
                    url: `http://47.251.46.15/lists/${collect.lid}`,
                    data: {

                    }
                }).then((code) => {
                    code.data.data.rows.map((data) => {
                        if (data.sid === parseInt(choose)) {
                            setCollectedImIn(collect.name);
                            //console.log(data, musicDetail.title, collect.name);

                        }
                    })
                });
            }

        })
    }


    React.useEffect(()=>{
        whichCollectThisMusicIsIn();
    }, [loading, choose])


    const showModal = () => {

        if (userToken === '' || userToken === undefined) {
            navigate('../../login');
        } else {
            setIsModalOpen(true);
        }

    };

    const handleOk = async () => {//doing
        setIsModalOpen(false);

        if (collectSwitch) {
            //select
            if (collectUserChoose > 0) {//select one
                setLoading(true);
                await axios({
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': userToken
                    },
                    method: "POST",
                    url: `http://47.251.46.15/collects?lid=${collectUserChoose}&sid=${choose}`,

                }).then((code) => {
                    dispatch(collectCollection(parseInt(choose)))
                    setLoading(false);

                }).catch((err) => {
                    setLoading(false);
                    console.log(err);
                })

            }
        } else {
            //create
            if (collectUserCreate.trim() !== '') {
                setLoading(true);
                await axios({
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': userToken
                    },
                    method: "POST",
                    url: `http://47.251.46.15/lists?name=${collectUserCreate}`,

                }).then((code) => {
                    dispatch(changeCollectStatus())
                    setLoading(false);
                }).catch((err) => {
                    setLoading(false);
                    console.log(err);
                })
            }

        }

        //console.log(collectUserChoose);
        //console.log(collectUserCreate);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dispatch = useDispatch();

    async function getThisMusic() {

        await axios({
            headers: {
                'Content-Type': "application/json",
            },
            method: "GET",
            url: `http://47.251.46.15/songs/${choose}`,

        }).then((code) => {
            setMusicDetail(code.data.data);
        })
    }

    async function getComments() {
        await axios({
            headers: {
                'Content-Type': "application/json",
            },
            method: "GET",
            url: `http://47.251.46.15/comments?sid=${choose}`,

        }).then((code) => {
            setComments(code.data.data)

        }).catch((err) => {
            console.log(err);
        })
    }


    React.useEffect(() => {
        getThisMusic();
    }, [loading]);

    React.useEffect(() => {
        getComments();//
    }, [loading, sendMinorComment])

    React.useEffect(() => {
        setLoading(true);
        if (comments.rows) {
            if (userToken !== '') {
                comments.rows.map((item) => {

                    checkIfLiked(item.cid);
                })
            }
        }
        setLoading(false);
    }, [comments.rows]);


    function topLikes() {
        setCommentFilter(false);
    }

    function mostRecent() {
        setCommentFilter(true);
    }


    async function clickDislike() {
        dispatch(dislikeCollection(parseInt(choose)));
        dispatch(changeCollectStatus());

        setLoading(true);

        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "DELETE",
            url: `http://47.251.46.15/likes/${musicDetail.sid}`,
            data: {

            }

        }).then((data) => {
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
            console.log(err);
        })

    }

    async function clickDiscollect() {

        collectedList.map((collect) => {
            if (collect.name !== '我喜欢的音乐') {
                axios({
                    headers: {
                        'Content-Type': "application/json",
                        "Authorization": userToken
                    },
                    method: "GET",
                    url: `http://47.251.46.15/lists/${collect.lid}`,
                    data: {

                    }
                }).then((code) => {
                    code.data.data.rows.map((data) => {
                        if (data.sid === musicDetail.sid) {
                            dispatch(uncollectCollection(parseInt(choose)));
                            dispatch(changeCollectStatus());

                            setLoading(true);

                            axios({
                                headers: {
                                    'Content-Type': "application/json",
                                    "Authorization": userToken
                                },
                                method: "DELETE",
                                url: `http://47.251.46.15/collects?lid=${collect.lid}&sid=${musicDetail.sid}`,
                                data: {

                                }

                            }).then((data) => {
                                setLoading(false);
                            }).catch((err) => {
                                setLoading(false);
                                console.log(err);
                            })
                        }
                    })
                });
            }

        })


    }

    async function clickLike() {
        dispatch(changeCollectStatus());
        setLoading(true);

        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "POST",
            url: `http://47.251.46.15/likes/${musicDetail.sid}`,
            data: {

            }

        }).then((data) => {
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
            console.log(err);
        })
    }

    function clickReply(id) {
        setReply(id);
    }

    function cancel() {
        setReply("");
    }

    const redStyle = {
        color: "red"
    }

    async function sendComment(sid, parentCid, content) {
        setLoading(true);
        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "POST",
            url: `http://47.251.46.15/comments/publish`,
            data: {
                sid: sid,
                parentCid: parentCid,
                content: content
            }

        }).then(() => {
            setLoading(false);
            setCommentContent('');
        }).catch((err) => {
            setLoading(false);
            console.log(err);
        })

    }



    async function replyTheComment(cid) {
        setLoading(true);
        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "POST",
            url: `http://47.251.46.15/comments/publish`,
            data: {
                sid: choose,
                parentCid: cid,
                content: secondComment
            }

        }).then((data) => {
            setLoading(false);
            setSecondComment('');
            dispatch(minorCommentStatus());
            setReply('')
        }).catch((err) => {
            console.log(err);
            setLoading(false);
            setSecondComment('');
        })
    }


    async function deleteComment(cid) {
        setLoading(true);
        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "DELETE",
            url: `http://47.251.46.15/comments/${cid}`,
            data: {

            }

        }).then(() => {
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        })
    }

    async function likeTheComment(cid) {
        setLoading(true);
        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "POST",
            url: `http://47.251.46.15/comments/${cid}`,
            data: {

            }

        }).then(() => {
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        })
    }



    async function checkIfLiked(cid) {

        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "POST",
            url: `http://47.251.46.15/comments?cid=${cid}`,
            data: {

            }

        }).then((data) => {

            if (!displayLikedComments.includes(cid) && data.data.data === '已点赞') {
                console.log(cid);
                setDisplayLikedComments((old) => { return [...old, cid] });
            }
            else if (data.data.data === '还没点赞' && displayLikedComments.includes(cid)) {
                let temp = displayLikedComments.slice();
                temp = temp.filter((item) => {
                    return item !== cid
                });
                setDisplayLikedComments(temp);
                //console.log(cid, temp);
            }

        }).catch((err) => {
            console.log(err);
        })
    }



    async function disLikeTheComment(cid) {//疑似跨域问题
        setLoading(true);
        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "PATCH",
            url: `http://47.251.46.15/comments/${cid}`,
            data: {

            }

        }).then((data) => {
            setLoading(false);

        }).catch((err) => {
            setLoading(false);
            console.log(err);
        })
    }


    const storeInCollected = collectedList.map((item, index) => {
        if (item.name !== '我喜欢的音乐') {
            return (
                <option key={index.toString() + item.lid.toString()} value={item.lid}>{item.name}</option>
            )
        }

    })



    let mainComment = (<div></div>);
    if (comments.rows) {


        mainComment = comments.rows.map((item, index) => {
            const id = index.toString() + "mainComment";

            return (
                <div className="comment" key={id}>
                    <div className="comment-header">
                        <img className="comment-avatar" src={item.avatar} />
                        <div>
                            <div className="comment-username">{item.username}</div>
                            <div className="comment-time">{item.timestamp}</div>
                        </div>
                        {userInfo == item.uid && <div className="delete-comment" onClick={() => { deleteComment(item.cid) }}>X</div>}
                    </div>

                    <div className="comment-content">
                        {item.content}
                    </div>

                    <div className="comment-footer">

                        {displayLikedComments.includes(item.cid) ?
                            <div className="comment-like" onClick={() => { disLikeTheComment(item.cid) }} style={redStyle}><LikeOutlined style={redStyle} /><span>{item.likes}</span></div>
                            :
                            <div className="comment-like" onClick={() => { likeTheComment(item.cid) }}><LikeOutlined /><span>{item.likes}</span></div>
                        }



                        {reply === id ? <div className="comment-response" onClick={cancel}>Cancel</div> : <div className="comment-response" onClick={() => { clickReply(id) }}>Reply</div>}
                        {commentDoNotExist.includes(item.cid) &&

                            (!cidList.includes(item.cid) ?
                                <div className="comment-view" onClick={() => { dispatch(viewComment(item.cid)) }}>View comments</div>
                                :
                                <div className="comment-view" onClick={() => { dispatch(cancelView(item.cid)) }}>Collapsed</div>
                            )

                        }
                    </div>
                    {
                        reply === id ?
                            <div className="reply-content">
                                <textarea disabled={userToken === ''} className="reply" placeholder="Reply to the user" onChange={(e) => { setSecondComment(e.target.value) }} value={secondComment}></textarea>
                                <button disabled={userToken === '' || secondComment === ''} className="reply-button" onClick={() => { replyTheComment(item.cid) }}>Reply</button>
                            </div>
                            :
                            null
                    }

                    <MinorComment item={item} choose={choose} />
                </div>
            )
        })
    }


    let musicPlay = (<div></div>);
    const songPath = musicDetail.songPath;
    if (songPath !== undefined) {
        musicPlay = (
            <audio controls className="musicPlaying" id="audio">
                <source src={songPath} ></source>
            </audio>
        )
    }

    const confirm = (e) => {
        clickDiscollect();
        message.success(`Successfully delete ${musicDetail.title} from ${collectedImIn}`);
    };


    return (
        <div className="specific-page">
            <div className="specific-header">
                <img src={musicDetail.image} className="specific-image" />
                <div className="specific-describe">
                    <h1 className="specific-title">{musicDetail.title}</h1>
                    <span className="specific-title">轻柔而悠扬：这种音乐通常具有柔和的旋律和和谐的和弦，可以帮助人们放松身心。
                        节奏缓慢：较慢的节奏可以帮助降低心率，使人们更容易入睡。</span>
                    <div className="specific-features">

                        {
                            alreadyLiked.includes(parseInt(choose)) ?
                                <button onClick={clickDislike}><LikeOutlined className="feature" style={redStyle} /><span style={redStyle} className="feature-letter">Like {musicDetail.likes}</span></button>
                                :
                                <button onClick={clickLike}><LikeOutlined className="feature" /><span className="feature-letter">Like {musicDetail.likes}</span></button>
                        }

                        {
                            alreadyCollected.includes(parseInt(choose)) ?
                                <Popconfirm
                                    title="Delete music from Collect"
                                    description={`Are you sure to delete ${musicDetail.title} from ${collectedImIn}`}
                                    onConfirm={confirm}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <button><HeartOutlined className="feature" style={redStyle}/><span style={redStyle} className="feature-letter">Collect</span></button>
                                </Popconfirm>

                                :
                                <button onClick={showModal}><HeartOutlined className="feature" /><span className="feature-letter">Collect</span></button>


                        }

                        <Modal title="Which Collects You Want Save" okText="Submit" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <div>Choose Your Collected</div>
                            <Switch checkedChildren="Select" value={collectSwitch} onChange={(e) => { setCollectUserChoose(0); setCollectSwitch(e); setCollectUserCreate('') }} unCheckedChildren="Create" defaultChecked />
                            <select onChange={(e) => { setCollectUserChoose(e.target.value) }} disabled={!collectSwitch}>
                                <option value={0}>--Select--</option>
                                {storeInCollected}
                            </select>
                            <div>Or Create a new one</div>
                            <input onChange={(e) => { setCollectUserCreate(e.target.value) }} disabled={collectSwitch} />
                        </Modal>

                    </div>
                    {musicPlay}


                </div>

            </div>



            <div className="specific-comments">
                <div className="specific-comment">
                    <CommentOutlined />
                    <span>Comment</span>
                </div>
                {commentFilter ?
                    <div className="comment-filter" onClick={topLikes}>Recent Comments</div>
                    :
                    <div className="comment-filter" onClick={mostRecent}>Top like comments</div>
                }
                {mainComment}

                <div className="reply-music">
                    <textarea disabled={userToken === ''} className="reply" placeholder="Send the comment" onChange={(e) => { setCommentContent(e.target.value) }} value={commentContent}></textarea>
                    <button disabled={userToken === '' || commentContent === ''} className="reply-button" onClick={() => { sendComment(choose, 0, commentContent) }}>Send</button>
                </div>
            </div>



        </div>
    )
}

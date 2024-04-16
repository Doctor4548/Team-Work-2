import React from "react";
import axios from "axios";
import { LikeOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { commentChange, minorCommentStatus} from "../store/slice/CommentSlice";

export default function MinorComment(props) {

    const [minorComments, setMinorComments] = React.useState({});
    const [secondCommentContent, setSecondCommentContnent] = React.useState('');
    const [reply, setReply] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [displayLikedComments, setDisplayLikedComments] = React.useState([]);


    const userToken = useSelector((state) => { return state.user.loginin_user });
    const cidList = useSelector((state)=>{return state.cidList.cidList});
    const userInfo = useSelector((state)=>{return state.user.user_info});
    const commentDoNotExist = useSelector((state)=>{return state.cidList.commentContent});
    const sendMinorComment = useSelector((state)=>{return state.cidList.sendMinorComment});


    const dispatch = useDispatch();
    //console.log(cidList);

    React.useEffect(() => {
        axios({
            headers: {
                'Content-Type': "application/json",
            },
            method: "GET",
            url: `http://47.251.46.15/comments?sid=${props.choose}&cid=${props.item.cid}`,

        }).then((code) => {

            if(code.data.data.rows.length>0&&!commentDoNotExist.includes(code.data.data.rows[0].parentCid)){
                dispatch(commentChange(code.data.data.rows[0].parentCid));
            }

            setMinorComments(code.data.data);

        }).catch((err) => {
            console.log(err);
        })


    }, [loading, sendMinorComment]);

    React.useEffect(()=>{
        setLoading(true);
        if(minorComments.rows){
            if(userToken!==''){
                minorComments.rows.map((item)=>{
                    
                    checkIfLiked(item.cid);
                })
            }
        }
        setLoading(false);
    },[minorComments.rows]);


    async function checkIfLiked(cid){
        
        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken
            },
            method: "POST",
            url: `http://47.251.46.15/comments?cid=${cid}`,
            data: {

            }

        }).then((data)=>{
            if(data.data.data==='已点赞'&&!displayLikedComments.includes(cid)){
                setDisplayLikedComments((old)=>{return [...old, cid]})
            }else if (data.data.data==='还没点赞'&&displayLikedComments.includes(cid)){
                let temp = displayLikedComments.slice();
                temp = temp.filter((item)=>{
                    return item!==cid
                });
                setDisplayLikedComments(temp);
                //console.log(cid, temp);
            }
        }).catch((err)=>{
            console.log(err);
        })
    }



    async function replyTheComment() {
        setLoading(true);
        await axios({
            headers: {
                'Content-Type': "application/json",
                "Authorization": userToken

            },
            method: "POST",
            url: `http://47.251.46.15/comments/publish`,
            data: {
                sid: props.choose,
                parentCid: props.item.cid,
                content: secondCommentContent
            }

        }).then((code) => {
            setReply('');
            setSecondCommentContnent('');
            dispatch(minorCommentStatus());
            setLoading(false);

        }).catch((err) => {
            setLoading(false);
            setReply('');
            console.log(err);
        })
    }

    async function deleteComment(cid){
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

        }).then(()=>{
            setLoading(false);
        }).catch((err)=>{
            console.log(err);
            setLoading(false);
        })
    }

    async function likeTheComment(cid){
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

        }).then(()=>{
            setLoading(false);
        }).catch((err)=>{
            console.log(err);
            setLoading(false);
        })
    }

    const redStyle = {
        color: 'red'
    }

    async function disLikeTheComment(cid){
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

        }).then((data)=>{
            setLoading(false);
            
        }).catch((err)=>{
            setLoading(false);
            console.log(err);
        })
    }



    let secondComment = (<div></div>);
    if (minorComments.rows&&minorComments.rows.length>0) {
        if(cidList.includes(minorComments.rows[0].parentCid)){
            secondComment = minorComments.rows.map((item) => {
                return (
                    <div className="comment-comment" key={item.cid}>
                        <div className="comment-in-comment">
                            <div className="comment-header">
                                <img className="comment-avatar" src={item.avatar} />
                                <div>
                                    <div className="comment-username">{item.username}</div>
                                    <div className="comment-time">{item.timestamp}</div>
                                </div>
                            {userInfo==item.uid && <div className="delete-comment" onClick={()=>{deleteComment(item.cid)}}>X</div>}

                            </div>
    
                            <div className="comment-content">
                                {item.content}
                            </div>
    
                            <div className="comment-footer">

                            {displayLikedComments.includes(item.cid)?
                            <div className="comment-like" onClick={()=>{disLikeTheComment(item.cid)}} style={redStyle}><LikeOutlined style={redStyle}/><span>{item.likes}</span></div>
                            :
                            <div className="comment-like" onClick={()=>{likeTheComment(item.cid)}}><LikeOutlined/><span>{item.likes}</span></div>    
                        }

                                {reply === item.cid ?
                                    <div className="comment-response" onClick={() => { setReply(''); setSecondCommentContnent('') }}>Cancel</div> :
                                    <div className="comment-response" onClick={() => { setReply(item.cid) }}>Reply</div>
                                }
                            </div>
                            {
                                reply === item.cid ?
                                    <div className="reply-content">
                                        <textarea disabled={userToken===''} className="reply" placeholder="Reply to the user" value={secondCommentContent=== ''? `@${item.username} ${secondCommentContent}` : secondCommentContent} onChange={(e) => { setSecondCommentContnent(e.target.value) }} ></textarea>
                                        <button disabled={userToken===''||secondCommentContent===''} className="reply-button" onClick={() => { replyTheComment() }}>Reply</button>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>
                )
            })            
        }else{
            secondComment=(
                <div className="comment-comment" key={minorComments.rows[0].cid}>
                <div className="comment-in-comment">
                    <div className="comment-header">
                        <img className="comment-avatar" src={minorComments.rows[0].avatar} />
                        <div>
                            <div className="comment-username">{minorComments.rows[0].username}</div>
                            <div className="comment-time">{minorComments.rows[0].timestamp}</div>
                        </div>
                    {userInfo==minorComments.rows[0].uid && <div className="delete-comment" onClick={()=>{deleteComment(minorComments.rows[0].cid)}}>X</div>}

                    </div>

                    <div className="comment-content">
                        {minorComments.rows[0].content}
                    </div>

                    <div className="comment-footer">

                        {displayLikedComments.includes(minorComments.rows[0].cid)?
                            <div className="comment-like" onClick={()=>{disLikeTheComment(minorComments.rows[0].cid)}} style={redStyle}><LikeOutlined style={redStyle}/><span>{minorComments.rows[0].likes}</span></div>
                            :
                            <div className="comment-like" onClick={()=>{likeTheComment(minorComments.rows[0].cid)}}><LikeOutlined/><span>{minorComments.rows[0].likes}</span></div>    
                        }

                        {reply === minorComments.rows[0].cid ?
                            <div className="comment-response" onClick={() => { setReply(''); setSecondCommentContnent('') }}>Cancel</div> :
                            <div className="comment-response" onClick={() => { setReply(minorComments.rows[0].cid) }}>Reply</div>
                        }
                    </div>
                    {
                        reply === minorComments.rows[0].cid ?
                            <div className="reply-content">
                                <textarea disabled={userToken===''} className="reply" placeholder="Reply to the user" value={secondCommentContent=== ''? `@${minorComments.rows[0].username} ${secondCommentContent}` : secondCommentContent} onChange={(e) => { setSecondCommentContnent(e.target.value) }} ></textarea>
                                <button disabled={userToken===''||secondCommentContent===''} className="reply-button" onClick={() => { replyTheComment() }}>Reply</button>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
            )
        }

    }

    


    return (
        <>
            {secondComment}
        </>

    )
}
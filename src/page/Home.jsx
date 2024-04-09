
import { Outlet } from "react-router";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  HeartOutlined,
  LikeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Modal } from 'antd';
import Headers from "./Headers";

import axios from "axios";

import { Avatar, Space } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slice/UserSlice";
import { getCollected, resetCollection, likeCollection, collectCollection, changeCollectName } from "../store/slice/CollectedSlice";


const { Header, Sider, Content } = Layout;

export default function Home() {
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [smallAvatarSrc, setSmallAvatarSrc] = useState(null);

  const [uploadImage, setUploadImage] = useState(null);
  const [uploadAudio, setUploadAudio] = useState(null);
  const [titleContent, setTitleContent] = useState("");
  const [artistContent, setArtistContent] = useState("");
  const [musicGenre, setMusicGenre] = useState(0);

  const [changePassword, setChangePassword] = useState(false);
  const [changeNickname, setChangeNickname] = useState(false);

  const [oldUserName, setOldUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRepeat, setNewRepeat] = useState("");
  const [newNickname, setNewNickName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [oldNickName, setOldNickName] = useState("");

  const [passwordNoMatch, setPasswordNotMatch] = useState(false);
  const [musicGenres, setMusicGenres] = useState([]);


  const userToken = useSelector((state) => { return state.user.loginin_user });
  const collectedMusics = useSelector((state) => { return state.collected.collectedMusics });
  const addedOrRemovedCollect = useSelector((state) => { return state.collected.addedOrRemovedCollect });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  async function getUserInformation() {
    await axios({
      headers: {
        'Content-Type': "application/json",
        "Authorization": userToken
      },
      method: "GET",
      url: "http://47.251.46.15/users"
    }).then((code) => {
      setOldNickName(code.data.data.nickname);
      setOldUserName(code.data.data.username);
      setAvatar(code.data.data.avatar);

    }).catch((err) => {
      setOldUserName("")
      setOldNickName("");
      setAvatar("");
      dispatch(logout());
    })

  }




  async function getMusicCollected() {
    await axios({
      headers: {
        'Content-Type': "application/json",
        "Authorization": userToken
      },
      method: "GET",
      url: "http://47.251.46.15/lists"
    }).then((code) => {
      dispatch(getCollected(code.data.data));

      code.data.data.map((collect)=>{
        axios({
          headers: {
              'Content-Type': "application/json",
              "Authorization": userToken
          },
          method: "GET",
          url: `http://47.251.46.15/lists/${collect.lid}`,
          data: {

          }
      }).then((data)=>{
        data.data.data.rows.map((thing)=>{
          
          if(collect.name==='我喜欢的音乐'){
            dispatch(likeCollection(thing.sid));
            //console.log('liked', thing.sid)
          }else{
            dispatch(collectCollection(thing.sid));
            //console.log('collected', thing.sid)

          }
          //console.log(thing.sid);
        })
        
      })

    })

    }).catch((err) => {
      setOldUserName("")
      setOldNickName("");
      setAvatar("");
      dispatch(logout());
    })

  }

  async function getMusicGenre() {
    await axios({
      headers: {
        'Content-Type': "application/json",
      },
      method: "GET",
      url: "http://47.251.46.15/genre",
      data: {

      }
    }).then((data) => {
      setMusicGenres(data.data.data);
    }).catch((err) => {
      console.log(err);
    })


  }

  React.useEffect(() => {
    if(userToken!==''&&userToken!==undefined){
      getUserInformation();
      getMusicCollected();
      getMusicGenre();
    }
  }, [isModalOpen, userToken]);

  React.useEffect(()=>{
    if(userToken!==''&&userToken!==undefined){
      getMusicCollected();
    }
  },[addedOrRemovedCollect]);





  const showModal = async () => {
    if (userToken === "" || userToken === undefined) {
      navigate("./login");
    }
    else {
      setIsModalOpen(true);
    }
  };

  function showSecondModal() {
    if (userToken === "" || userToken === undefined) {
      navigate("./login");
    }
    else {
      setIsSecondModalOpen(true);
    }
  }

  function removeToken() {
    setOldUserName("")
    setOldNickName("");
    setAvatar("");
    dispatch(resetCollection());
    dispatch(logout());
  }

  const handleOk = () => {
    setSmallAvatarSrc(null);
    document.getElementById('myFile').value = null;
    setChangePassword(false);
    setChangeNickname(false);
    setNewNickName("");
    setNewPassword("");
    setNewRepeat("");
    setPasswordNotMatch(false);

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSmallAvatarSrc(null);
    document.getElementById('myFile').value = null;
    setChangePassword(false);
    setChangeNickname(false);
    setNewNickName("");
    setNewPassword("");
    setNewRepeat("");
    setPasswordNotMatch(false);

    setIsModalOpen(false);
  };

  function titleChange(e) {
    setTitleContent(e.target.value);
  }

  function artistChange(e) {
    setArtistContent(e.target.value);
  }

  function updatePassword() {
    setChangePassword(true);
  }

  function updateNickname() {
    setChangeNickname(true);
  }

  function passWordChange(e) {
    setNewPassword(e.target.value);
  }

  function repeat_passWordChange(e) {
    setNewRepeat(e.target.value);
  }

  function nickNameChange(e) {
    setNewNickName(e.target.value);
  }



  function avatarChange(e) {
    let file = e.target.files[0];

    setAvatarSrc(file);

    let reader = new FileReader();
    reader.onload = function (e) {
      setSmallAvatarSrc(e.target.result);
    }
    reader.readAsDataURL(file);
  }

  function uploadImg(e) {
    let file = e.target.files[0];
    setUploadImage(file);
    let reader = new FileReader();
    reader.onload = function (e) {
      //setUploadImage(e.target.result);
    }
    reader.readAsDataURL(file);
  }

  function uploadMusic(e) {
    let file = e.target.files[0];
    let reader = new FileReader();

    setUploadAudio(file);

    reader.onload = function (e) {

      //setUploadAudio(e.target.result);
    }
    reader.readAsDataURL(file);
  }



  async function updateUser() {

    if (changePassword) {
      if (newRepeat !== newPassword) {
        setPasswordNotMatch(true);
        return;
      }
      else if (smallAvatarSrc === null) {
        await axios({
          headers: {
            'Content-Type': "application/json",
            "Authorization": userToken
          },
          method: "POST",
          url: "http://47.251.46.15/users",
          data: {
            "nickname": newNickname,
            "password": newPassword
          }
        }).then((code) => {
          setIsModalOpen(false);
        })
      }
      else {

        await axios({
          headers: {
            'Content-Type': "application/json",
            "Authorization": userToken
          },
          method: "POST",
          url: "http://47.251.46.15/users",
          data: {
            "nickname": newNickname,
            "password": newPassword
          }
        }).then((code) => {
          setIsModalOpen(false);
        });

        let formData = new FormData();
        formData.append('avatar', avatarSrc);


        try {
          await axios.post('http://47.251.46.15/users/avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': userToken
            }
          });
          setIsModalOpen(false);

        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
    else if (changeNickname) {

      await axios({
        headers: {
          'Content-Type': "application/json",
          "Authorization": userToken
        },
        method: "POST",
        url: "http://47.251.46.15/users",
        data: {
          "nickname": newNickname,
        }
      }).then((code) => {
        setIsModalOpen(false);
      })

      if (smallAvatarSrc !== null) {
        let formData = new FormData();
        formData.append('avatar', avatarSrc);


        try {
          await axios.post('http://47.251.46.15/users/avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': userToken
            }
          });
          setIsModalOpen(false);

        } catch (error) {
          console.error('Error:', error);
        }
      }


    }
    else {
      let formData = new FormData();
      formData.append('avatar', avatarSrc);
      try {
        await axios.post('http://47.251.46.15/users/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': userToken
          }
        });
        setIsModalOpen(false);

      } catch (error) {
        console.error('Error:', error);
      }


    }
  }


  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const showCollected= collectedMusics.map((item)=>{
    if(item.name!=='我喜欢的音乐'){
      return getItem(`${item.name}`, `${item.lid}`)
    }

  });

  const items = [
    getItem('User', 'grp', null, [getItem("Update User Information", '13')], 'group'),
    {
      type: 'divider',
    },
    getItem('Collected', 'sub1', <HeartOutlined />, [
      getItem('', 'g1', null, [getItem('Liked', '0', <LikeOutlined />)], 'group'),
      getItem('Collected', 'sub3', <HeartOutlined />, showCollected),
    ])

  ];


  const onClick = async (e) => {//doing
    if (userToken === "" || userToken === undefined) {
      navigate("./login");
    }else{
      if (e.key === "13") {
        if (userToken === "" || userToken === undefined) {
          navigate("./login");
        }
        else {
          setIsModalOpen(true);
        }
      }
      else if (e.key === "0") {   //liked
        collectedMusics.map((item) => {
          if (item.name === "我喜欢的音乐") {
            //dispatch(collectUserChoose(item));
            dispatch(changeCollectName(item.name));
            navigate(`collected/${item.lid}`);
          }
        });
  
      }
      else {

        collectedMusics.map((item)=>{
          if(item.lid==e.key){
            dispatch(changeCollectName(item.name));
            navigate(`collected/${e.key}`);
          }
        })


      }
    }


  };

  const warning = {
    color: "red"
  }

  function handleSecondOk() {
    setIsSecondModalOpen(false);
    setArtistContent("");
    setTitleContent("");
    document.getElementById('myFile2').value = null;
    document.getElementById('myFile3').value = null;
    setUploadImage(null);
  }

  function handleSecondCancel() {
    setIsSecondModalOpen(false);
    setArtistContent("");
    setTitleContent("");
    document.getElementById('myFile2').value = null;
    document.getElementById('myFile3').value = null;
    setUploadImage(null);
  }

  async function uploadSong() {
    let formData = new FormData();
    formData.append('image', uploadImage);
    formData.append('audio', uploadAudio);
    formData.append('title', titleContent);
    formData.append('artist', artistContent);
    formData.append('genre', musicGenre);
    

    try {
      await axios.post('http://47.251.46.15/songs/publish', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': userToken
        }
      });
    } 
    catch (error) {
      console.error('Error:', error);
    }
    setIsSecondModalOpen(false);
    setIsModalOpen(false);
  }

  function chooseGenre(gid) {
    setMusicGenre(gid);

  }

  const options = musicGenres.map((item, index) => {
    return (
      <option key={index} value={item.gid}>{item.gname}</option>
    )

  })



  return (
    <div className="page">
      {userToken !== "" && userToken != undefined && <button onClick={removeToken} className="logout">LogOut</button>}
      {userToken !== "" && userToken != undefined && <UploadOutlined className="upload" onClick={showSecondModal} />}
      <Modal title="Upload" open={isSecondModalOpen} onOk={handleSecondOk} onCancel={handleSecondCancel}>

        <div className="uploadContent">

          {!uploadImage ? <Avatar size="large" type="primary" icon={<UserOutlined />} /> : <img src={uploadImage} className="uploadImg" />}
          <input type="file" id="myFile2" name="filename2" className="editButton" placeholder="edit" onChange={uploadImg} />

          <input type="file" id="myFile3" name="filename3" className="editButton" placeholder="edit" onChange={uploadMusic} />

          <input placeholder="title" onChange={titleChange} value={titleContent} />
          <input placeholder="artist" onChange={artistChange} value={artistContent} />

          <select onChange={(e) => { chooseGenre(e.target.value) }}>
            <option value={0}>--Select--</option>
            {options}
          </select>

          {titleContent !== "" && artistContent !== "" && uploadImage !== null && uploadAudio !== null && musicGenre !== 0 && <button className="updateButton" onClick={uploadSong}>Update</button>}
        </div>

      </Modal>

      <div>
        <div className="user-avatar">
          <Space wrap size={16}>
            {avatar === "" ? <Avatar size="large" type="primary" onClick={showModal} icon={<UserOutlined />} /> : <img src={avatar} onClick={showModal} className="avatarSrc" />}
            {oldUserName !== "" && oldUserName}
            {oldNickName !== "" && oldNickName}
            <Modal title="User Information" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <div className="updateUserInfo">

                <div>
                  {!smallAvatarSrc ?
                    avatar === "" ? <Avatar size="large" type="primary" icon={<UserOutlined />} /> : <img src={avatar} className="avatarSrc" />
                    :
                    <img src={smallAvatarSrc} className="avatarSrc"></img>
                  }
                  <input type="file" id="myFile" name="filename" className="editButton" placeholder="edit" onChange={avatarChange} />
                </div>

                <div>
                  <input type="text" placeholder="UserName" className="userInfoInput" value={oldUserName} disabled={true} />
                </div>

                {passwordNoMatch && <h3 style={warning}>The passwords do not match</h3>}

                <div>
                  <input type="password" placeholder="UserPassword" className="userInfoInput" name="password" onChange={passWordChange} value={newPassword} disabled={!changePassword} />
                  {!changePassword && <button className="editButton" onClick={updatePassword}>edit</button>}
                </div>

                {
                  changePassword &&
                  <div>
                    <input type="password" placeholder="Repeat_Password" className="userInfoInput" name="repeat_password" value={newRepeat} onChange={repeat_passWordChange} />
                  </div>
                }

                <div>
                  <input placeholder="nickname" className="userInfoInput" disabled={!changeNickname} onChange={nickNameChange} value={newNickname === null ? "" : newNickname} />
                  {!changeNickname && <button className="editButton" onClick={updateNickname}>edit</button>}
                </div>

                {(changeNickname || changePassword || smallAvatarSrc) && <button className="updateButton" onClick={updateUser}>Update</button>}

              </div>
            </Modal>


          </Space>
        </div>

          <Menu
            onClick={onClick}
            style={{
              width: 256,

            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
          />



      </div>


      <Headers />

      <Outlet />



    </div>

  )
}
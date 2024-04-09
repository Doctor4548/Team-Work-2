import React from "react";
import { Carousel } from 'antd';
import { useRef } from "react";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { enterNewPage } from "../store/slice/VisitedPageSlice";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function MainContent() {

  const [greyStyle, setGreyStyle] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();

  const [musicList, setMusicList] = React.useState([]);



  async function getMusics() {
    await axios({
      headers: {
        'Content-Type': "application/json",
      },
      method: "POST",
      url: "http://47.251.46.15/songs",
      data: {

      }

    }).then((code) => {
      setMusicList(code.data.data.rows);
    }).catch((err) => {
      console.log(err);
    })
  }

  React.useEffect(() => {
    getMusics();
  }, []);



  function setStyle() {
    setGreyStyle(true);
  }

  function removeStyle() {
    setGreyStyle(false);
  }

  const grey = {
    opacity: 1,
    backgroundColor: "lightgrey",
    color: "white",
  }

  function gotoSpecific(id) {
    const path = location.pathname;
    dispatch(enterNewPage(path));
    navigate(`../specific/${id}`)
  }

  const slideMusic = musicList.map((item, index) => {

    return (
      <div className="topMusics" key={index} onMouseOver={setStyle} onMouseLeave={removeStyle} onClick={() => { gotoSpecific(item.sid) }}>
        <img src={item.image} className="topMusic" />

      </div>
    )
  })

  let topMusics = musicList.slice();

  for (let i = 0; i < musicList.length; i++) {
    for (let j = i + 1; j < musicList.length; j++) {

      if (topMusics[i].likes < topMusics[j].likes) {
        let tmp = topMusics[i];
        topMusics[i] = topMusics[j];
        topMusics[j] = tmp;
      }
    }
  }



  topMusics = topMusics.slice(0, 5);


  const displayRecentMusic = musicList.map((item, index) => {
    if (index < 5) {
      return (
        <div className="music" onClick={() => { gotoSpecific(item.sid) }} key={index}>
          <img src={item.image} className="music"></img>
          <span>{item.title}</span>
          <span>{item.views}</span>
        </div>
      )

    }

  })



  const displayTopMusics = topMusics.map((item, index) => {
    return (
      <div className="music" onClick={() => { gotoSpecific(item.sid) }} key={index}>
        <img src={item.image} className="music"></img>
        <span>{item.title}</span>
        <span>{item.views}</span>
      </div>
    )
  })



  const carouselRef = useRef();

  function gotoNext() {
    carouselRef.current.next();
  }

  function gotoPre() {
    carouselRef.current.prev();
  }

  function gotoChoosePage() {
    const path = location.pathname;
    dispatch(enterNewPage(path));
    navigate("musics/placeholder")

  }

  return (
    <div className="main-page">


      <div className="topMusicContainer">

        <Carousel autoplay ref={carouselRef}>

          {slideMusic}

        </Carousel>
        <LeftOutlined className="leftOut" onClick={gotoPre} style={greyStyle ? grey : null} />
        <RightOutlined className="rightOut" onClick={gotoNext} style={greyStyle ? grey : null} />
      </div>
      <h2>Top Liked Musics</h2>
      <div className="musics">
        <h4 className="showMore" onClick={gotoChoosePage}>Show more</h4>
        {displayTopMusics}
      </div>

      <h2>New Musics</h2>
      <div className="musics">
        <h4 className="showMore" onClick={gotoChoosePage}>Show more</h4>
        {displayRecentMusic}
      </div>



    </div>
  );
}
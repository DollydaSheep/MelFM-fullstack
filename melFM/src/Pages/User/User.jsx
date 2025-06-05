import React, { useEffect, useRef, useState } from 'react'
import './User.css'
import { BrowserRouter as Router,Routes,Route, useParams, useNavigate, Navigate, Link, useLocation} from 'react-router-dom'
import {io} from 'socket.io-client';
import { useSocket } from '../../Context';

const User = ({setCurrentUser}) => {

  const navigate = useNavigate();
  const {username} = useParams();
  const location = useLocation();
  const [fdata,setFdata] = useState(null);
  const [recent,setRecent] = useState([]);
  const [loading,setLoading] = useState(true);
  const [listens,setListens] = useState(0);
  const [topArtistFeatured, setTopArtistFeatured] = useState([]);
  const [topTracksFeatured, setTopTracksFeatured] = useState([]);
  const {socket} = useSocket();
  const currentTrack = useRef(null);
  const c = useRef(null);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  setCurrentUser(username);

  const image = `http://localhost:3020/uploads/profile-image-${username}.jpg`;
  
  useEffect(() => {

    const fetchUserData = async ()=>{
      try{
        const response = await fetch(`http://localhost:3020/user/${username}`);
        if(response.ok){
          const data = await response.json();
          console.log(data);
          setListens(data.listens)
          setRecent(data.data);
          setTopArtistFeatured(data.topArtist)
          setTopTracksFeatured(data.topTracks)
          setLoading(false)
        }else if(response.status == 404){
          navigate('/error')
        }
      }catch(err){
        console.error(err);
      }
    }
    fetchUserData();

    if (socket) {
      socket.on("connect",()=>{
        console.log("yawa");
      })
      // socket.on('get-recent',(data)=>{
      //   setRecent(data);
      //   console.log(data);
      // })
      socket.on("current-track", (track) => {

        currentTrack.current = c.current;

        console.log(c.current);
        console.log(currentTrack.current);
        
        if(currentTrack.current == null || currentTrack.current.track_name !== track.track_name){
          if(currentTrack.current){
            setRecent((r)=> [currentTrack.current,...r].slice(0,9));
          }
          setFdata(track);
        }
        c.current = track;
        // console.log("Current track:", track);
        console.log("C current" + JSON.stringify(track));
      });
      socket.on("is_playing", (track) => {
        if(track.is_playing.body.is_playing){
          if(c.current == null){
            console.log(recent[0]);
            setRecent((r) => { 
              const updated = [...r].slice(0,10);
              setFdata(updated[0]);
              c.current = updated[0];
              return updated.slice(1,10);
            })
          }
        }
      })
    }else{
      console.log("wala")
    }    

    // Cleanup listeners
    return () => {
        if (socket) {
          socket.off("current-track");
          socket.off("is_playing");
        }
    };
  }, [socket]);
  
  // if(!fdata){
  //   return <h1>Loading...</h1>
  // }

  if(loading){
    return(<>
      <div className='userpage-backdrop'>
      
      </div>
      <div className="userpage-profile-main">
        <h1 className='userpage-username-main'>{username}</h1>
        <h1 className='userpage-listens-label-main'>Listens</h1>
        <h1 className='userpage-artists-label-main'>Artists</h1>
        <h1 className='userpage-listencount-main'>{listens}</h1>
        <h1 className='userpage-artistcount-main'>1000</h1>
        <div className="userpage-hover-items">
          <Link>Overview</Link>
          <Link to={`/user/${username}/library`}>Library</Link>
        </div>
      </div>
      <div className="userpage-dashboard">
    </div>
    </>)
  }

  return (
    <>
    <div className='userpage-backdrop'>
      
    </div>
    <div className="userpage-profile-main" style={{background : `url(${image}) no-repeat center`, backgroundSize: '100%'}}>
      <h1 className='userpage-username-main'>{username}</h1>
      <h1 className='userpage-listens-label-main'>Listens</h1>
      <h1 className='userpage-artists-label-main'>Artists</h1>
      <h1 className='userpage-listencount-main'>{listens}</h1>
      <h1 className='userpage-artistcount-main'>1000</h1>
      <div className="userpage-hover-items">
        <Link>Overview</Link>
        <Link to={`/user/${username}/library`}>Library</Link>
      </div>
    </div>
    <div className="userpage-dashboard">
      <h1>Recent Tracks</h1>
      <div className="userpage-recent-tracks">
        {fdata ? (<>
          <div className="userpage-current-track">
            <img src={fdata.album_cover} alt="" />
            <div className="track-item-label">
              <p>{fdata.track_name}</p>
              <p>{fdata.artist_name}</p>
              <p>{new Date(fdata.created_at).getDate() + " " + months[new Date(fdata.created_at).getMonth()] + " " + new Date(fdata.created_at).getHours() + ":" + (new Date(fdata.created_at).getMinutes() < 10 ? "0" + new Date(fdata.created_at).getMinutes()  : new Date(fdata.created_at).getMinutes())}</p>
            </div>
          </div>
          </>
        ) : ""}
        
        {console.log(recent)}
        {Object.entries(recent).map((item,index)=>{
          return (<>
            <div key={index} className="userpage-recent-tracks-item item-div">
              <img src={item[1].album_cover} alt="" />
              <div className='track-item-label'>
                <p>{item[1].track_name}</p>
                <p>{item[1].artist_name}</p>
                <p>{new Date(item[1].created_at).getDate() + " " + months[new Date(item[1].created_at).getMonth()] + " " + new Date(item[1].created_at).getHours() + ":" + (new Date(item[1].created_at).getMinutes() < 10 ? "0" + new Date(item[1].created_at).getMinutes()  : new Date(item[1].created_at).getMinutes())}</p>
              </div>
            </div>
          </>)
        })}
        <Link to={`/user/${username}/library`}>More Tracks &gt;</Link>
      </div>
      {console.log(topArtistFeatured)}
      <div className="userpage-top-artist-featured feature-container">
        <h1>Top Artists</h1>
        <div className="userpage-top-artist-layout feature-layout">
          {topArtistFeatured.map(artist=>{
            return(<div className='item-div'>
              <img src={artist.artist_img} alt="" />
              <h1>{artist.artist_name}</h1>
              <p>{artist.listen_count} listens</p>
              </div>)
          })}
        </div>
      </div>
      <div className="userpage-top-tracks-featured feature-container">
        <h1>Top Tracks</h1>
        <div className="userpage-top-tracks-layout">
          {topTracksFeatured.map(track => {
            return(<div className='userpage-recent-tracks-item item-div'>
              <img src={track.album_cover} alt="" />
              <div className='track-item-label'>
                <p>{track.track_name}</p>
                <p>{track.artist_name}</p>
                <p>{track.track_count} listens</p>
              </div>
            </div>)
          })}
        </div>
      </div>
    </div>

    </>
  )
}

export default User

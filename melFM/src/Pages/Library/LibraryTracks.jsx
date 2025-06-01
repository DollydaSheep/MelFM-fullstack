import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import './Library.css'
import useLibraryData from './useLibraryData';

const LibraryTracks = () => {

    const {username} = useParams();
    const location = useLocation();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const {loading, fdata, listens, page, totalPages, setPage} = 
      useLibraryData(`http://localhost:3020/user/${username}/library/tracks`);

  if(loading){
    return(
      <>
    <div className='userpage-backdrop'>
      
    </div>
    <div className="userpage-profile-library">
      <h1 className='userpage-username-library'>{username}</h1>
      <div className="userpage-hover-items-library">
        <Link to={`/user/${username}`}>Overview</Link>
        <Link to={`/user/${username}/library`}>Library</Link>
      </div>
    </div>
    <div className="userpage-library-dashboard">
      <h1>Library</h1>
      <div className="library-dashboard-hover-items">
        <Link to={`/user/${username}/library`}>Listens</Link>
        <Link to={`/user/${username}/library/artist`}>Artist</Link>
        <Link className="userpage-hover-items-library-active">Tracks</Link>
      </div>
      <h1>Listens</h1>
      <h1>1000</h1>
      <div className="userpage-recent-tracks">
        <h1>LOADING</h1>
      </div>
    </div>
    </>
    )
  }

  return (
      <>
    <div className='userpage-backdrop'>
      
    </div>
    <div className="userpage-profile-library">
      <h1 className='userpage-username-library'>{username}</h1>
      <div className="userpage-hover-items-library">
        <Link to={`/user/${username}`}>Overview</Link>
        <Link to={`/user/${username}/library`}>Library</Link>
      </div>
    </div>
    <div className="userpage-library-dashboard">
      <h1>Library</h1>
      <div className="library-dashboard-hover-items">
        <Link to={`/user/${username}/library`}>Listens</Link>
        <Link to={`/user/${username}/library/artist`}>Artist</Link>
        <Link className="userpage-hover-items-library-active">Tracks</Link>
      </div>
      <h1>Listens</h1>
      <h1>{listens}</h1>
      {console.log(fdata)}
      {console.log(fdata.length)}
      <div className="userpage-recent-tracks">
        <h1>Tracks</h1>
      {Object.entries(fdata).map((item,index)=>{
          return (<>
            <div key={index} className="userpage-recent-tracks-item">
              <img src={item[1].album_cover} alt="" />
              <div className='track-item-label'>
                <p>{item[1].track_name}</p>
                <p>{item[1].artist_name}</p>
                <p>{item[1].track_count} listens</p>
              </div>
            </div>
          </>)
        })}
      </div>
      <div className="pagination">
        <div className="pagination-container">
      {[...Array(totalPages)].map((_,index)=>(        
        <p key={index} className={page === index + 1 ? 'pagination-page pagination-active' : 'pagination-page'} onClick={()=>{setPage(index + 1)}}>{index + 1}</p>          
      ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default LibraryTracks

import React, { useState } from 'react'
import './Navbar.css';
import {Link} from "react-router-dom"
import { useNavigate } from 'react-router-dom';

const Navbar = ({loginState,setLoginState,currentUser}) => {

  const [showPopup,setShowPopup] = useState(false);
  const navigate = useNavigate();
  const username = currentUser;

  const image = `http://localhost:3020/uploads/profile-image-${username}.jpg`;

  let timeOut;

  const popupTimeout = () => {timeOut = setTimeout(() => setShowPopup(false),500)}

  const handleMouseEnter = () =>{
    setShowPopup(true);
  }
  const handleMouseLeave = () => {
    popupTimeout();
  }
  const handlePopupEnter = () => {
    clearTimeout(timeOut);
  }
  const handlePopupLeave = () => {
    popupTimeout();
  }
  const handleLogOut = () => {
    setLoginState(false);
    navigate('/')
  }
  const handleSettings = () => {
    navigate('/settings')
  }

  return (
    <>
    <div className='Navbar'>
      <Link to="/">mel.fm</Link>
      <div className="navbar-items">
        <Link>search</Link>
        <Link>Trend</Link>
        <Link>Charts</Link>
        <Link>Features</Link>
        {/* <h2>•</h2> */}
        {loginState ? 
        (<><div onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{background : `url(${image}) no-repeat center`, backgroundSize: '100%'}}>
          </div></>) 
        : 
        (<><Link to="/login">Log In</Link>
        <Link to='/signup'>Sign up</Link></>)}
      </div>
    </div>

    {showPopup ? (<><div className='popup' onMouseEnter={handlePopupEnter} onMouseLeave={handlePopupLeave}>
      <div onClick={handleSettings}><h1>Setting</h1></div>
      <div onClick={handleLogOut}><h1>Log Out</h1></div>
      </div></>) : ""}
    </>
  )
}

export default Navbar

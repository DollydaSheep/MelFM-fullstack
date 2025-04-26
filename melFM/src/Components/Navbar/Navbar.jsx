import React from 'react'
import './Navbar.css';
import {Link} from "react-router-dom"

const Navbar = () => {
  return (
    <div className='Navbar'>
      <Link to="/">mel.fm</Link>
      <div className="navbar-items">
        <Link>search</Link>
        <Link>Trend</Link>
        <Link>Charts</Link>
        <Link>Features</Link>
        <h2>•</h2>
        <Link to="/login">Log In</Link>
        <Link to='/signup'>Sign up</Link>
      </div>
    </div>
  )
}

export default Navbar

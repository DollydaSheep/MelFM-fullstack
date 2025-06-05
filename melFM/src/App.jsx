import React, { useState } from 'react'
import { BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Login from './Pages/Login/Login';
import User from './Pages/User/User';
import Signup from './Pages/Signup/Signup';
import Error404 from './Pages/Error404/Error404';
import Library from './Pages/Library/Library';
import LibraryArtist from './Pages/Library/LibraryArtist';
import LibraryTracks from './Pages/Library/LibraryTracks';
import Settings from './Pages/Settings/Settings';

const App = () => {

  const [loginState,setLoginState] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  return (
    <Router>
      <Navbar loginState={loginState} setLoginState={setLoginState} currentUser={currentUser}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login setLoginState={setLoginState}/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/user/:username' element={<User setCurrentUser={setCurrentUser}/>} />
        <Route path='/error' element={<Error404/>} />
        <Route path='/user/:username/library' element={<Library/>} />
        <Route path='/user/:username/library/artist' element={<LibraryArtist/>} />
        <Route path='/user/:username/library/tracks' element={<LibraryTracks/>} />
        <Route path='/settings' element={<Settings currentUser={currentUser}/>}/>
      </Routes>
    </Router>
  )
}

export default App

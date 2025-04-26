import React from 'react'
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

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/user/:username' element={<User/>} />
        <Route path='/error' element={<Error404/>} />
        <Route path='/user/:username/library' element={<Library/>} />
        <Route path='/user/:username/library/artist' element={<LibraryArtist/>} />
        <Route path='/user/:username/library/tracks' element={<LibraryTracks/>} />
      </Routes>
    </Router>
  )
}

export default App

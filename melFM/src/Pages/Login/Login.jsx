import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Login.css'
import {io} from 'socket.io-client'
import { useSocket } from '../../Context';

const Login = ( {setLoginState} ) => {

  const [user,setUser] = useState("");
  const [pass,setPass] = useState("");
  const navigate = useNavigate();
  const { initializeSocket } = useSocket();


  const loginSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await fetch('http://localhost:3020/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({user,pass})
      })
      if(response.ok){
        const data = await response.json();
        console.log(data);
        const socket = initializeSocket({auth : { token : "test" , user:user , refresh: data.refresh, id: data.id , listens: data.listens}});
        setLoginState(true);
        socket.on("connect",()=>{
          console.log("yawa");
        })
        console.log(data);
        navigate(`/user/${data.user}`);
      }else if(response.status == 404){
        const data = await response.json();
        console.log(data)
      }

    }catch (error){
      console.error(error);
    }
  }

  return (
    <div className='login-container'>
      <div className="loginform-container">
        <h1>Log In</h1>
        <form action="" onSubmit={loginSubmit} className='login-form'>
          <label htmlFor="">Username</label>
          <input type="text" onChange={(e)=>{setUser(e.target.value)}}/>
          <label htmlFor="">Password</label>
          <input type="password" onChange={(e)=>{setPass(e.target.value)}}/>
          <input type="submit" value="Log In"/>
        </form>
      </div>
    </div>
  )
}

export default Login

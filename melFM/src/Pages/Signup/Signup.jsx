import React, { useState } from 'react'
import './Signup.css'

const Signup = () => {

    const [user,setUser] = useState("");
    const [pass,setPass] = useState("");

    const signupSubmit = async (event) =>{
        const response = await fetch('http://localhost:3020/signup', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user,pass})
        })
        if(response.ok){
          const data = await response.json();
          window.location.href = data.url;
          console.log("hey");
        }
    }

  return (
    <div className='signup-container'>
      <div className="signupform-container">
        <h1>Sign Up</h1>
        <form action="" onSubmit={signupSubmit}>
          <label htmlFor="">Username</label>
          <input type="text" onChange={(e)=>{setUser(e.target.value)}}/>
          <label htmlFor="">Password</label>
          <input type="password" onChange={(e)=>{setPass(e.target.value)}}/>
          <input type="submit" value="Signup"/>
        </form>
      </div>
    </div>
  )
}

export default Signup

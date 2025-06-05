import React from 'react'
import './Settings.css';

export const Settings = ({currentUser}) => {

    const username = currentUser;

    const image = `http://localhost:3020/uploads/profile-image-${username}.jpg`;

  return (
    <>
        <div className='settings-page'>
            <h1>Settings</h1>
            <div className="settings-page-items">
                <div className="settings-profile-pic-container">
                    <h1>Your Picture</h1>
                    <div className="settings-prof-pic" style={{background : `url(${image}) no-repeat center`, backgroundSize: '100%'}}></div>
                    <form action="http://localhost:3020/settings" className='choose-file' encType='multipart/form-data' method='POST'>
                        <input type="file" name="image" />
                        <input type="submit" name="" id="" />
                    </form>
                </div>
                <div className="change-info">
                    <h1>Information</h1>
                    <form action="">
                        <label htmlFor="">Display Name</label>
                        <input type="text" />
                        <input type="submit" value="Save Changes" />
                    </form>
                </div>
            </div>
        </div>
        
    
    </>
  )
}

export default Settings;

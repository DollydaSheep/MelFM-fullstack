import React from 'react'
import './Settings.css';

export const Settings = () => {
  return (
    <>
        <div className='settings-page'>
            <h1>Settings</h1>
            <div className="settings-page-items">
                <div className="settings-profile-pic-container">
                    <h1>Your Picture</h1>
                    <div className="settings-prof-pic"></div>
                    <form action="" className='choose-file'>
                        <input type="file" name="image" />
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

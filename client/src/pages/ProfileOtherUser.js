import React from 'react';
import Navbar from '../components/Navbar';
import OtherProfileContent from '../components/OtherProfileContent';
import Sidebar from '../components/Sidebar';

export default function ProfileOtherUser() {
    return (
      <div className='profile-page'>
        <Navbar/>
        <div className="content-profile-page">
          <Sidebar/>
          <OtherProfileContent />
        </div>
      </div>
    )
}

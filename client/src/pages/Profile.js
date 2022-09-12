import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProfileContent from '../components/ProfileContent';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const user = useSelector((state) => state.userConnectedReducer.user);

  // Si utilisateur n'est pas connecté: affiche la page de connection
  // Sinon: affiche la page d'accueil
  if(user === null) {
    return <Navigate to="/connexion" />
  } else {
    return (
      <div className='profile-page'>
        <Navbar/>
        <div className="content-profile-page">
          <Sidebar/>
          <ProfileContent />
        </div>
      </div>
    )
  }
}

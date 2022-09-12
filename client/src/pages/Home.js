import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import HomeContent from '../components/HomeContent';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const user = useSelector((state) => state.userConnectedReducer.user);

  // Si utilisateur n'est pas connecté: affiche la page de connection
  // Sinon: affiche la page d'accueil
  if(user === null) {
    return <Navigate to="/connexion" />
  } else {
    return (
      <div className='home-page'>
        <Navbar/>
        <div className="content-home-page">
          <Sidebar/>
          <HomeContent />
        </div>
      </div>
    )
  }
}

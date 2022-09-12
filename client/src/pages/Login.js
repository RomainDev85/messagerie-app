import React from 'react';
import FormLogin from '../components/FormLogin';
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

export default function Login() {
    const user = useSelector((state) => state.userConnectedReducer.user);

    // Si utilisateur connecté: renvoi vers la page d'accueil
    // Sinon: affiche la page de connection
    if(user !== null){
        return <Navigate to="/" />
    } else {
        return (
            <div className='login-page'>
                <FormLogin />
            </div>  
        )
    }
}
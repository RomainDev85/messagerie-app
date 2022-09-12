import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FormSignUp from '../components/FormSignUp';

export default function SignUp() {
    const user = useSelector((state) => state.userReducer.user);

    // Si utilisateur connecté: renvoi vers la page d'accueil
    // Sinon: affiche la page de connection
    if(user !== null){
        return <Navigate to="/" />
    } else {
        return (
            <div className='signup-page'>
                <FormSignUp />
            </div>  
        )
    }
}

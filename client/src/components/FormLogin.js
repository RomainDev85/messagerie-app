import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/user.features';
import FormMessage from './FormMessage';
import { Link, useLocation } from 'react-router-dom';
import { setUsersList } from '../redux/features/users.features';

export default function FormLogin() {
    const dispatch = useDispatch();
    let location = useLocation();
    // Champs du formulaire
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // Message d'erreur à afficher
    const [errorUsername, setErrorUsername] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [successSignUp, setSuccessSignUp] = useState(null);
    const [showErrorUsername, setShowErrorUsername] = useState(false);
    const [showErrorPassword, setShowErrorPassword] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [showSuccessSignUp, setShowSuccessSignUp] = useState(false);
    // Etat visibilité du mot de passe
    const [visibilityInputPassword, setVisibilityInputPassword] = useState(false);


    // Fonction permettant de rendre le mot de passe visible ou non
    function visibilityPassword(){
        let el = document.getElementById("password");
        
        if(el.type === "password") {
            el.type = "text";
            setVisibilityInputPassword(true);
        }
        else {
            el.type = "password";
            setVisibilityInputPassword(false);
        }
    }

    // Fonction permettant de démonter les composants Message (les messages d'erreur du formulaire)
    function visibilityMessage(type){
        if(type === "username"){ 
            setShowErrorUsername(false);
            setErrorUsername(null);
        }
        if(type === "password") { 
            setShowErrorPassword(false);
            setErrorPassword(null);
        }
        if(type === "signup") { 
            setShowSuccessSignUp(false);
            setSuccessSignUp(null);
        }
    }

    // Fonction Connexion executer en validant le formulaire
    function connexion(e){
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/login`, {
            "username": username,
            "password": password
        }, { withCredentials: true }).then((res) => {
            // Si erreur après tentative connection: renvoi les erreurs
            // Sinon: vide les champs de connection puis demande de décrypter le JWT
            if(res.data.errors){

                // Si message d'erreur pour le champ 'username': affiche le composant Message et le message d'erreur
                // Sinon: Rend le message d'erreur vide et le composant Message non visible
                if(res.data.errors.username) {
                    setErrorUsername(res.data.errors.username)
                    setShowErrorUsername(true);
                } else {
                    setShowErrorUsername(false);
                    setErrorUsername("");
                }
                // Si message d'erreur pour le champ 'password': affiche le composant Message et le message d'erreur
                // Sinon: Rend le message d'erreur vide et le composant Message non visible
                if(res.data.errors.password) {
                    setErrorPassword(res.data.errors.password);
                    setShowErrorPassword(true);
                    setPassword("");
                } else {
                    setShowErrorPassword(false);
                    setErrorPassword("");
                }

            } else {

                setUsername("");
                setPassword("");
                axios.get(`${process.env.REACT_APP_API_URL}/jwt`, { withCredentials: true }).then((res) => {
                    // Ajoute les données dans le reducer userConnectedReducer
                    dispatch(setUser(res.data));
                    axios.post(`${process.env.REACT_APP_API_URL}/user/find`, {id: res.data.jwt.id}, { withCredentials: true }).then((res) => {
                        // Ajoute tout les utilsateurs dans le reducer UsersListReducer
                        dispatch(setUsersList(res.data))
                    })
                })
            }
        })
    }

    useEffect(() => {
        // Afficher un message si un utilisateur c'est inscrit
        if(location.state !== null) {
            if(location.state.success !== null) {
                setSuccessSignUp(location.state.success)
                setShowSuccessSignUp(true);
            }
        }
    }, [location.state])

    return (
        <form onSubmit={connexion} className="form-login">
            <h1>Connecter vous et discutez avec vos amis</h1>

            {/* SIGN UP SUCCESS MESSAGE */}
            {successSignUp !== null && <FormMessage visibility={visibilityMessage} field="signup" message={location.state.success} type={"success"} />}

            {/* USERNAME */}
            <div className="form-content">
                <label htmlFor="username">Pseudo</label>
                <input type="text" name="username" id="username" placeholder='Entrez votre pseudo' value={username} onChange={(event) => setUsername(event.target.value)}/>
                { errorUsername !== null && showErrorUsername === true && <FormMessage visibility={visibilityMessage} field="username" message={errorUsername} type={"error"} /> }
            </div>

            {/* PASSWORD */}
            <div className="form-content">
                <label htmlFor="username">Mot de passe</label>
                <div className='input-password'>
                    <input type="password" name="password" id="password" placeholder='Entrez votre mot de passe' value={password} onChange={(event) => setPassword(event.target.value)} />
                    {visibilityInputPassword ? <i className="fa-solid fa-eye-slash eye-password" onClick={visibilityPassword}></i> : <i className="fa-solid fa-eye eye-password" onClick={visibilityPassword}></i>}
                </div>
                <Link to="/" className='forgot-password'>Mot de passe oublié ?</Link>
                { errorPassword !== null && showErrorPassword === true && <FormMessage visibility={visibilityMessage} field="password" message={errorPassword} type={"error"} /> }
            </div>

            {/* BUTTON CONNECTION */}
            <div className="form-content">
                <input type="submit" value="Se connecter"/>
            </div>

            {/* BUTTON SIGNUP */}
            <div className="form-content">
                <p className='no-acc'>Vous n'avez pas de compte ?</p>
                <Link to="/inscription" className='btn-no-acc'>S'inscrire</Link>
            </div>
        </form>
    )
}

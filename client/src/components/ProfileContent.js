import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { disconnectUser, setUser } from '../redux/features/user.features';
import LittleNavbar from './LittleNavbar';

export default function ProfileContent() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userConnectedReducer.user);
    const [updateImg, setUpdateImg] = useState(false);
    const [image, setImage] = useState(null);
    const [updateUsername, setUpdateUsername] = useState(false);
    const [username, setUsername] = useState(user.username);


    // Afficher l'image sélectionner pour modifier l'image de profil
    function loadFile(e){
        setUpdateImg(true);
        var reader = new FileReader();
        let output = document.getElementById('output');
        reader.onload = () => {
            output.src = reader.result;
        };
        if(e.target.files[0] === undefined) {
            output.src = require(`../../public/images/users/${user.image}`);
            setUpdateImg(false);
            setImage(null);
        }
        else {
            reader.readAsDataURL(e.target.files[0]);
            setImage(e.target.files[0]);
        }
    }

    // Valider ou Annuler l'update de l'image
    function btnUpdateImage(bool){
        if(bool === false){
            setUpdateImg(false);
            setImage(null);
            let output = document.getElementById('output');
            output.src = require(`../../public/images/users/${user.image}`);
        } else {
            let formData = new FormData();
            formData.append("id", user.id);
            formData.append("image", image);
            formData.append("jwt", document.cookie.split('jwt=')[1])

            if(image !== null){
                try {
                    axios({
                        method: "post",
                        url: `${process.env.REACT_APP_API_URL}/user/update/image`,
                        data: formData,
                        headers: { "Content-Type": "multipart/form-data" },
                        withCredentials: true
                    }).then((res) => {
                        console.log(res.data) 
                        // Supprime ancien cookie
                        document.cookie = `jwt=; path=/; expires=${new Date(0).toUTCString()}`;
                        // Remplace pour le nouveau
                        const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
                        document.cookie = 'jwt=' + res.data.newJwt + '; expires=' + expires + '; path=/';
                    }).then((res) => {
                        axios.get(`${process.env.REACT_APP_API_URL}/jwt`, { withCredentials: true }).then((res) => {
                            if(res.data.errors) {
                            return
                            } else {
                            dispatch(setUser(res.data))
                            setUpdateImg(false);
                            setImage(null);
                            }
                        })
                    })
                } catch(err){
                    console.log("err_update-img", err);
                }
            }
        }
    }

    // Valider ou Annuler l'update du pseudo
    function btnUpdateUsername(bool){
        if(bool === false){
            setUpdateUsername(false);
            setUsername(user.username);
        } else {
            if(username.length > 3){
                axios.post(`${process.env.REACT_APP_API_URL}/user/update/username`, {
                    "id": user.id,
                    "username": username,
                    "jwt": document.cookie.split('jwt=')[1]
                }, { withCredentials: true }).then((res) => {
                    // Supprime ancien cookie
                    document.cookie = `jwt=; path=/; expires=${new Date(0).toUTCString()}`;
                    // Remplace pour le nouveau
                    const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
                    document.cookie = 'jwt=' + res.data.newJwt + '; expires=' + expires + '; path=/';
                }).then((res) => {
                    axios.get(`${process.env.REACT_APP_API_URL}/jwt`, { withCredentials: true }).then((res) => {
                        if(res.data.errors) {
                            return
                        } else {
                            dispatch(setUser(res.data))
                            setUpdateUsername(false);
                            setUsername(user.username);
                        }
                    })
                })
            }
        }
    }

    // Deconnexion utilisateur
    function disconnect(){
        axios.get(`${process.env.REACT_APP_API_URL}/logout`, { withCredentials: true }).then((res) => {
            if(res.data.success) dispatch(disconnectUser());
        })
    }

    return (
        <div className='profile-content'>
            <LittleNavbar />
            <div className="card-profile">
                {/* DECONNEXION */}
                <i className="fa-solid fa-power-off" onClick={disconnect}></i>

                {/* IMAGE */}
                <img src={`./images/users/${user.image}`} alt="" id="output" />
                <div className="update-img">
                    <div className="file-input">
                        <input
                            type="file"
                            name="file-input"
                            id="file-input"
                            className="file-input_input"
                            onChange={loadFile}
                        />
                        <label className="file-input_label" htmlFor="file-input">
                            <span>Modifier l'image</span>
                        </label>
                    </div>
                    {updateImg && 
                        <div className='btn-update-img'>
                            <i className="fa-solid fa-check" onClick={() => btnUpdateImage(true)}></i>
                            <i className="fa-solid fa-xmark" onClick={() => btnUpdateImage(false)}></i>
                        </div>
                    }
                </div>
                <ul>

                    {/* USERNAME */}
                    <li className='username'>
                        <h2>Pseudo</h2>
                        {!updateUsername ?      
                            <div className="content">
                                <p>{user.username}</p>  
                                <i className="fa-solid fa-pen-to-square" onClick={() => setUpdateUsername(true)}></i>                     
                            </div>
                            :
                            <div className="content-update">
                                <input type="text" name="username" id="username" value={ username } onChange={(e) => { setUsername(e.target.value) }}/>  
                                <div className='btn'>
                                    <i className="fa-solid fa-check" onClick={() => { btnUpdateUsername(true) }}></i>
                                    <i className="fa-solid fa-xmark" onClick={() => { btnUpdateUsername(false) }}></i>
                                </div>                    
                            </div>
                        }
                    </li>

                    {/* EMAIL */}
                    <li className='email'>
                        <h2>Email</h2>
                        <div className="content">
                            <p>{user.email}</p>
                            <i className="fa-solid fa-pen-to-square"></i>                      
                        </div>
                    </li>
                    <li className='btn-update-pw'>
                        Changer votre mot de passe
                    </li>
                </ul>
            </div>
        </div>
    )
}

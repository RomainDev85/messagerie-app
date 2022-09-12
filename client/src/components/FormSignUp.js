import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormMessage from './FormMessage';

export default function FormSignUp() {
    let navigate = useNavigate();
    // Champs formulaire
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [validPassword, setValidPassword] = useState(null);
    const [image, setImage] = useState(null);
    // Message d'erreur
    const [errorUsername, setErrorUsername] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [errorValidPassword, setErrorValidPassword] = useState(null);
    const [errorImage, setErrorImage] = useState(null);
    
  
    // Afficher le nom du fichier selectionné de le bouton
    function getFileName(e){
      if(e.target.files.length !== 0){
        // Recupere le fichier selectionné
        const [file] = e.target.files;
        // Recupere le nom du fichier
        const { name: fileName } = file;
        const filename = fileName;
        // Affiche le nom du fichier dans le bouton
        document.querySelector(".btn-input-file").textContent = `Votre image: ${filename}`;
      } else {
        document.querySelector(".btn-input-file").textContent = "Ajouter une image de profil";
      }
    }

    // Fonction permettant de démonter les composants Message (les messages d'erreur du formulaire)
    function visibilityMessage(type){
      switch (type) {
        case 'email':
          setErrorEmail(null);
          break;
        case 'username':
          setErrorUsername(null);
          break;
        case 'image':
          setErrorImage(null);
          break;
        case 'password':
          setErrorPassword(null);
          break;
        case 'valid-password':
          setErrorValidPassword(null);
          break;
        default:
          break;
      }
    }

    // Inscription d'un utilisateur
    function signUp(e){
      e.preventDefault();
      
      let formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("validPassword", validPassword);
      formData.append("image", image);

      try {
        axios({
          method: "post",
          url: `${process.env.REACT_APP_API_URL}/user/create`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
          if(res.data.errors){
            if(res.data.errors.username){
              setErrorUsername(res.data.errors.username)
            } else {
              setErrorUsername(null)
            }
            if(res.data.errors.email){
              setErrorEmail(res.data.errors.email)
            } else {
              setErrorEmail(null)
            }
            if(res.data.errors.password){
              setErrorPassword(res.data.errors.password)
            } else {
              setErrorPassword(null)
            }
            if(res.data.errors.validPassword){
              setErrorValidPassword(res.data.errors.validPassword)
            } else {
              setErrorValidPassword(null)
            }
            if(res.data.errors.image){
              setErrorImage(res.data.errors.image)
            } else {
              setErrorImage(null)
            }
          } else {
            navigate("/connexion", { state: { success: res.data.success} })
          }
        })
      } catch(err){
        console.log("err_sign-up", err);
      }
    }

    useEffect(() => {
      const file = document.getElementById("file");
      file.addEventListener('change', getFileName);

      return () => {
        file.removeEventListener('change', getFileName);
      }
    })

    return (
      <form className="form-signup" id='formSignup' onSubmit={signUp}>
        <h1>Inscrivez vous et discutez avec vos amis</h1>

        {/* EMAIL */}
        <div className="form-content">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="email" placeholder='Entrez votre email' onChange={(e) => setEmail(e.target.value)}/>
          {errorEmail !== null && <FormMessage message={errorEmail} visibility={visibilityMessage} field={"email"} type={'error'} />}
        </div>

        {/* USERNAME */}
        <div className="form-content">
          <label htmlFor="username">Pseudo</label>
          <input type="text" name="username" id="username" placeholder='Entrez votre pseudo' onChange={(e) => setUsername(e.target.value)} />
          {errorUsername !== null && <FormMessage message={errorUsername} visibility={visibilityMessage} field={"username"} type={'error'} />}
        </div>

        {/* PROFIL PICTURE */}
        <div className="form-content">
          <input type="file" id="file" className="input-file" name='image' onChange={(e) => setImage(e.target.files[0])} />
          <label htmlFor="file" className="btn-input-file">Ajouter une image de profil</label>
          <p className='empty-ok'>Une image de profil n'est pas obligatoire</p>
          {errorImage !== null && <FormMessage message={errorImage} visibility={visibilityMessage} field={"image"} type={'error'} />}
        </div>

        {/* PASSWORD */}
        <div className="form-content">
          <label htmlFor="username">Mot de passe</label>
          <div className='input-password'>
            <input type="password" name="password" id="password" placeholder='Entrez votre mot de passe' onChange={(e) => setPassword(e.target.value)} />
            {errorPassword !== null && <FormMessage message={errorPassword} visibility={visibilityMessage} field={"password"} type={'error'} />}
          </div>
        </div>

        {/* VALID PASSWORD */}
        <div className="form-content">
          <label htmlFor="username">Confirmation du Mot de passe</label>
          <div className='input-password'>
            <input type="password" name="valid-password" id="valid-password" placeholder='Confirmez votre mot de passe' onChange={(e) => setValidPassword(e.target.value)} />
            {errorValidPassword !== null && <FormMessage message={errorValidPassword} visibility={visibilityMessage} field={"valid-password"} type={'error'} />}
          </div>
        </div>

        {/* BUTTON SUBSCRIBE */}
        <div className="form-content">
          <input type="submit" value="S'inscrire"/>
        </div>

        {/* BUTTON GO LOGIN */}
        <div className="form-content">
          <p className='no-acc'>Vous avez déjà un compte ?</p>
          <Link to="/connexion" className='btn-no-acc'>Se connecter</Link>
        </div>
      </form>
    )
}

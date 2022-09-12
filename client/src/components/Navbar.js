import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSearchUser } from '../redux/features/searchUser.features';
import UserFound from './UserFound';
import { disconnectUser } from '../redux/features/user.features';
import axios from 'axios';

export default function Navbar() {
  let dispatch = useDispatch();
  const user = useSelector((state) => state.userConnectedReducer.user);
  const listUsers = useSelector((state) => state.usersListReducer.users);
  const [usersFound, setUsersFound] = useState([]);

  // Fonction pour afficher ou non le placeholder
  function placeholderInput(){
    let element = document.getElementById("placeholder");
    let input = document.getElementById("search-user");

    if(input === document.activeElement) element.classList.add("hide")
    else {
      element.classList.remove('hide');
      input.value = "";
      dispatch(setSearchUser(""));
      setUsersFound([]);
    }
  }

  // Rechercher des utilisateurs
  function searchUsers(e){
    dispatch(setSearchUser(e.target.value))
    let array = [];

    for(let i = 0; i < listUsers.length; i++){
      const isFound = listUsers[i].username.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1 ? true : false;
      if(isFound) array.push(listUsers[i]);
    }

    setUsersFound(array);
  }

  // Deconnexion utilisateur
  function disconnect(){
    axios.get(`${process.env.REACT_APP_API_URL}/logout`, { withCredentials: true }).then((res) => {
        if(res.data.success) dispatch(disconnectUser());
    })
  }

  useEffect(() => {
    document.body.addEventListener('click', placeholderInput);

    return () => {
      document.body.removeEventListener('click', placeholderInput);
    }
  }, [usersFound])

  return (  
    <nav className="navbar">
      <div className="left">
        <Link to="/profil"><img src={require(`../../public/images/users/${user.image}`)} alt="Profil" /></Link>
      </div>
      <div className="middle">
        <div className="search-user">
          <input type="text" name="search-user" id="search-user" onClick={placeholderInput} onChange={searchUsers} autoComplete="off" />
          <div className="placeholder" id="placeholder">
            <i className="fa-solid fa-magnifying-glass"></i>
            <p>Rechercher des utilisateurs</p>
          </div>
          <div className="results-users">
            {document.getElementById("search-user") && document.getElementById("search-user").value.length > 0 && 
              usersFound.slice(0, 5).map((element) => {
                return <UserFound key={element.id} username={element.username} image={element.image} id={element.id} friend={element.friend} />
              })
            }
          </div>
        </div>   
      </div>
      <div className="right">
        <i className='fa-solid fa-power-off' onClick={disconnect}></i>
      </div>
    </nav>
  )
}

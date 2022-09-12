import './style/index.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { setUser } from './redux/features/user.features';
import Loading from './pages/Loading';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import { setUsersList } from './redux/features/users.features';
import ProfileOtherUser from './pages/ProfileOtherUser';
import Chat from './pages/Chat';

function App() {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger la liste des utilisateurs
  function loadUser(){
    axios.post(`${process.env.REACT_APP_API_URL}/user/find`, { id: userId },{ withCredentials: true }).then((res) => {
      dispatch(setUsersList(res.data))
    })
  }

  useEffect(() => {
    // Check si un utilisateur est déjà connecté
    axios.get(`${process.env.REACT_APP_API_URL}/jwt`, { withCredentials: true }).then((res) => {
      if(res.data.errors) {
        return
      } else {
        setUserId(res.data.jwt.id)
        dispatch(setUser(res.data))
      }
    }).then(() => {
      setLoading(false);
    })


    if(userId !== null){
      loadUser();
      const intervalLoadUsers = setInterval(() => { loadUser() }, 1000 * 120 )

      return () => clearInterval(intervalLoadUsers);
    }
  })

  if(!loading){
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/profil/:username" element={<ProfileOtherUser />} />
          <Route path="/conversation/:username" element={<Chat />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<SignUp />} />
          <Route path="/confirmation/email/:userId" element={<VerifyEmail />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return <Loading />
  }
}

export default App;

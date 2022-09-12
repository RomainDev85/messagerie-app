import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function FriendListChat({id, username, statusRelation, image}) {
  let navigate = useNavigate();

  return (
    <div className="friend-sidebar" onClick={() => navigate(`/conversation/${username}`)}>
      <div className="left">
        <img src={require(`../../public/images/users/${image}`)} alt="" />
      </div>
      <div className="right">
        <h3>{ username }</h3>
        <p>Envoyer un message à { username }</p>
      </div>
    </div>
  )
}

import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addFriendInList } from '../redux/features/friend.features';
import { editFriendStatus } from '../redux/features/users.features';

export default function UserFound({ username, image, id, f }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userConnectedReducer.user);
    const usersList = useSelector((state) => state.usersListReducer.users);
    const [userFound, setUserFound] = useState(usersList.find(element => element.id === id));
    let navigate = useNavigate();

    // Ajoutez un ami
    function addFriend(){
        axios.post(`${process.env.REACT_APP_API_URL}/friend/add`, {
            "id_user": user.id,
            "id_friend": id
        }, { withCredentials: true }).then((res) => {
            if(res.data.success){
                dispatch(addFriendInList({
                    username: username,
                    image: image,
                    idUser: id,
                    statusRelation: 2
                }))
                dispatch(editFriendStatus(id))
                setUserFound({
                    id: id,
                    image: image,
                    username: username,
                    friend: true,
                })
            }
        })
    }

    return (
        <div className="user-found">
            <div className="user-found-left" onClick={() => navigate(`/profil/${username}`)}>
                <img src={require(`../../public/images/users/${image}`)} alt="" />
                <h3>{ username }</h3>
            </div>
            <div className="user-found-right">
                {userFound.friend ? <p>( Ami )</p> : <div className='btn-add-friend'><p onClick={addFriend}>Ajoutez</p></div>}
            </div>
        </div>
    )
}

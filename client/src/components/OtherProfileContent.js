import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { addFriendInList, deleteFriendInList } from '../redux/features/friend.features';
import { editFriendStatus } from '../redux/features/users.features';
import LittleNavbar from './LittleNavbar';


export default function OtherProfileContent() {
    let dispatch = useDispatch();
    let { username } = useParams();
    const usersList = useSelector((state) => state.usersListReducer.users);
    const userConnected = useSelector((state) => state.userConnectedReducer.user);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(undefined);

    // Ajoutez un ami
    function addFriend(){
        axios.post(`${process.env.REACT_APP_API_URL}/friend/add`, {
            "id_user": userConnected.id,
            "id_friend": user.id
        }, { withCredentials: true }).then((res) => {
            if(res.data.success){
                // Ajoute l'utilisateur au reducer friendsReducer
                dispatch(addFriendInList({
                    username: user.username,
                    image: user.image,
                    idUser: user.id,
                    statusRelation: 2
                }))
                // Modifie l'utilisateur du reducer usersListReducer
                dispatch(editFriendStatus(user.id))
                setUser({
                    id: user.id,
                    image: user.image,
                    username: user.username,
                    friend: true,
                })
            }
        })
    }

    // Supprimer un ami
    function deleteFriend(){
        axios.put(`${process.env.REACT_APP_API_URL}/friend/delete`, {
            "id_user": userConnected.id,
            "id_friend": user.id
        }, { withCredentials: true }).then((res) => {
            // Met à jour les reducers friendsReducer et usersListReducer
            if(res.data.success){
                dispatch(deleteFriendInList(user.id))
                dispatch(editFriendStatus(user.id))
            }
        })
    }
    
    useEffect(() => {
        if(usersList.length > 0) {
            setUser(usersList.filter((element) => element.username === username)[0]);
            setLoading(false);
        }
    }, [usersList, username])

    // Render view
    if(loading){
        return (
            <div>Loading</div>
        )
    } else {
        if(user === undefined){
            return (<Navigate to="/" replace ={true} />)
        } else {
            return (
                <div className='profile-content'>
                    <LittleNavbar />
                    <div className="card-profile">
                        <img src={require(`../../public/images/users/${user.image}`)} alt="" />
                        <h3>{ user.username }</h3>
                        {user.friend ? (
                            <p>Vous êtes amis avec cet utilisateur.</p>
                        ) : (
                            <p>Vous n'êtes pas amis avec cet utilisateur.</p>
                        )}
                        <div className="btn-action">
                            {user.friend ? (
                                <>
                                    <div className='btn'><i className="fa-solid fa-comment-dots"></i>Envoyer un message</div>
                                    <div className="btn-delete" onClick={deleteFriend}><i className="fa-solid fa-circle-minus"></i>Supprimer de la liste d'amis</div>
                                </>
                            ) : (
                                <div className='btn' onClick={addFriend}><i className="fa-solid fa-circle-plus"></i>Ajoutez en ami</div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }
    }
}

import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFriendList } from '../redux/features/friend.features';
import FriendListChat from './FriendListChat';

export default function ListChat() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userConnectedReducer.user);
    const friendsList = useSelector(state => state.friendsReducer.friends);
    const searchFriend = useSelector(state => state.searchUserReducer.search.friend);
    
    useEffect(() => {
        axios.post(
            `${process.env.REACT_APP_API_URL}/friend/list`,
            { id_user: user.id },
            { withCredentials: true }
        ).then((res) => {
            // Ajoute au reducer friendsReducer les utilisateurs amis
            dispatch(setFriendList(res.data))
        })
    // eslint-disable-next-line
    }, [searchFriend]);
    
    
    return (
        <div className='list-friends-sidebar'>
            {friendsList.map((element) => {
                if(searchFriend.length === 0) {
                    return <FriendListChat key={element.idUser} id={element.idUser} username={element.username} statusRelation={element.statusRelation} image={element.image} />
                } else {
                    const isFound = element.username.toLowerCase().indexOf(searchFriend.toLowerCase()) !== -1 ? true : false;
                    if(isFound) return <FriendListChat key={element.idUser} id={element.idUser} username={element.username} statusRelation={element.statusRelation} image={element.image} />
                    else return null;
                }
            })}
        </div>
    )
    
}

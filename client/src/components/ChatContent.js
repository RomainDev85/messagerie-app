import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom';
import { setMessages } from '../redux/features/messages.features';
import LittleNavbar from './LittleNavbar'
import MessageChat from './MessageChat';

export default function ChatContent() {
    const dispatch = useDispatch();
    const { username } = useParams();
    const allMessages = useSelector((state) => state.messagesReducer.messages) 
    const userConnected = useSelector((state) => state.userConnectedReducer.user);
    const friends = useSelector((state) => state.friendsReducer.friends);
    const [friend, setFriend] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messageToSend, setMessageToSend] = useState("");

    // Envoyer un message
    function sendMessage(){
        console.log(messageToSend);
    }

    useEffect(() => {
        setFriend(friends.find((element) => element.username === username))
        setLoading(false)
        if(friend !== null && friend !== undefined && userConnected !== null){
            axios.get(`${process.env.REACT_APP_API_URL}/message/find/${userConnected.id}/${friend.idUser}`, { withCredentials: true }).then((res) => {
                // Envoi les messages entre l'utilisateur connecté et l'ami selectionné dans le reducer messagesReducer
                dispatch(setMessages({
                    userId: friend.idUser,
                    messages: res.data.messages
                }));
            })
        }
    }, [friends, username, friend, userConnected, allMessages, dispatch])

    if(!loading){
        if(friend === undefined || friend === null){
            return <Navigate to="/" replace={true} />
        }
        return (
            <div className='chat-content'>
                <LittleNavbar />
                <h2 className='message-with'>Discussion avec {friend.username}</h2>
                <div className="messages-wall">
                    {
                        allMessages.length > 0 && friend !== null && allMessages.find(conversation => conversation.userId === friend.idUser) !== undefined &&
                        // Renvoi les messages trier par date d'envoi
                        allMessages.find(conversation => conversation.userId === friend.idUser).messages.slice().sort((a, b) => {return new Date(a.date.date) - new Date(b.date.date)}).map((message) => { return <MessageChat key={message.idMessage} message={message} /> })
                    }
                </div>
                <div className="send-message">
                    <textarea type="text" id="message-to-send" onChange={(e) => setMessageToSend(e.target.value)}></textarea>
                    <div className="btn-send" onClick={sendMessage}><p>Envoyer</p></div>
                </div>
            </div>
        )
    }
}

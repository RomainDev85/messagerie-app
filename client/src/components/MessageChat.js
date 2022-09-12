import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function MessageChat({ message }) {
    const userConnected = useSelector((state) => state.userConnectedReducer.user);
    const [messageStatus, setMessageStatus] = useState(null)
    
    useEffect(() => {
        if(userConnected.id === message.idUserSend) setMessageStatus("send")
        else setMessageStatus("receive")
    }, [setMessageStatus, message, userConnected])

    // Pour styliser les "message-container" dont l'enfant message est en position absolute et qui n'a donc pas de 
    // hauteur je recupere la hauteur de l'enfant "message" et je rajoute le style hauteur au parent "message-container"
    if(document.getElementById(`message-${message.idMessage}`) !== null && document.getElementById(`message-container-${message.idMessage}`) !== null){
        document.getElementById(`message-container-${message.idMessage}`).style.height = `${document.getElementById(`message-${message.idMessage}`).offsetHeight}px`;
    }

    return (
        <div className="message-chat" id={`message-container-${message.idMessage}`}>
            <div className={`${messageStatus !== null && messageStatus}`} id={`message-${message.idMessage}`}>
                <p>{ message.content }</p>
            </div>
        </div>
    )
}

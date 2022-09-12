import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function VerifyEmail() {

    let { userId } = useParams();
    let navigate = useNavigate();
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.put(`${process.env.REACT_APP_API_URL}/user/verify/email/${userId}`)
            .then((res) => {
                if(res.data.success) setMessage(res.data.success) 
            })
        const timeForRedirect = setTimeout(() => {
           navigate("/connexion", { state: { success: "Vous pouvez vous connectez." } }) 
        }, 5000);

        return () => {
            clearTimeout(timeForRedirect);
        }
    }, [userId])

    return (
        <div className='verify-page'>
            <h1>{ message }</h1>
            <p>Vous allez être rediriger vers la page de connexion.</p>
        </div>
    )
}

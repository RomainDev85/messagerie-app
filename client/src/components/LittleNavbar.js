import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function LittleNavbar() {
    let navigate = useNavigate();
    let location = useLocation();
    
    useEffect(() => {
        location.pathname === "/" && document.getElementById("btn-accueil").classList.add("active")
        location.pathname === "/profil" && document.getElementById("btn-profil").classList.add("active")
    })
    
    // Changer de page
    function btnNav(e){
        if(e.target.parentElement.id === "btn-accueil"){
            document.getElementById("btn-accueil").classList.add("active");
            document.getElementById("btn-profil").classList.remove("active");
            navigate("/");
        }
        if(e.target.parentElement.id === "btn-profil"){
            document.getElementById("btn-accueil").classList.remove("active");
            document.getElementById("btn-profil").classList.add("active");
            navigate("/profil")
        }
    }

    return (
        <div className="little-navbar">
            <div className="btn-accueil" id="btn-accueil" onClick={btnNav}><h2 className='test'>Acceuil</h2></div>
            <div className="btn-profil" id="btn-profil" onClick={btnNav}><h2>Mon profil</h2></div>
        </div>
    )
}

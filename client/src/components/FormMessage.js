import React from 'react'

export default function FormMessage({message, type, visibility, field}) {
    // Props:
    //      message: est le contenu du message
    //      type: est le type du message ( error, success, ect...) pour la classe CSS
    //      visibility: de la fonction visibilityMessage() déclarer dans le composant FormLogin permettant d'affecter la visibilité du message en démontant le composant
    //      field: parametre de la fonction visibilityMessage() permettant de choisir quel champs du formulaire on souhaite retirer le message d'erreur 

    return (
        <div className={`msg-${type}`}>
            <p>{message}</p>
            <i className="fa-solid fa-xmark" onClick={() => visibility(field)}></i>
        </div>
    )
}

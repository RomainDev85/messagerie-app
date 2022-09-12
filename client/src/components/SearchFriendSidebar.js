import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchFriend } from '../redux/features/searchUser.features';

export default function SearchFriendSidebar() {
    const dispatch = useDispatch();
    const friends = useSelector(state => state.friendsReducer.friends) ;

    // Fonction pour afficher ou non le placeholder
    function placeholderInput(){
        let element = document.getElementById("placeholder-search-friend");
        let input = document.getElementById("search-friend");

        if(input === document.activeElement) {
            element.classList.add("hide")
        } 
        else { 
            element.classList.remove('hide');
            input.value = "";
            dispatch(setSearchFriend(input.value));
        }
    }

    // Fonction recherche une conversation / ami dans la sidebar
    function searchFriend(){
        let input = document.getElementById("search-friend");
        dispatch(setSearchFriend(input.value))
    }


    useEffect(() => {
        document.body.addEventListener('click', placeholderInput);

        return () => {
            document.body.removeEventListener('click', placeholderInput);
        }
    // eslint-disable-next-line
    }, [friends])

    return (
        <div className="search-user">
            <input type="text" name="search-user" id="search-friend" onChange={searchFriend} autoComplete="off" />
            <div className="placeholder" id="placeholder-search-friend">
                <i className="fa-solid fa-magnifying-glass"></i>
                <p>Rechercher une discussion</p>
            </div>
        </div>
    )
}

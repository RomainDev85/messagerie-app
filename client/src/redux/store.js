import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/user.features';
import friendsReducer from './features/friend.features';
import searchUserReducer from './features/searchUser.features';
import usersReducer from './features/users.features';
import messagesReducer from "./features/messages.features";

export const store = configureStore({
    reducer: {
        userConnectedReducer: userReducer,
        friendsReducer: friendsReducer,
        searchUserReducer: searchUserReducer,
        usersListReducer: usersReducer,
        messagesReducer: messagesReducer
    },
})
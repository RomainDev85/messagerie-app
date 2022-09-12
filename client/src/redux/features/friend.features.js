import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  friends: []
}

export const friendSlice = createSlice({
  name: 'listFriend',
  initialState,
  reducers: {
    setFriendList: (state, action) => {
        state.friends = action.payload.list
    },
    addFriendInList: (state, action) => {
      state.friends.push(action.payload);
    },
    deleteFriendInList: (state, action) => {
      state.friends = state.friends.filter((element) => element.idUser !== action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const { setFriendList, addFriendInList, deleteFriendInList } = friendSlice.actions

export default friendSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: []
}

export const usersSlice = createSlice({
  name: 'listUsers',
  initialState,
  reducers: {
    setUsersList: (state, action) => {
      state.users = action.payload.users
    },
    editFriendStatus: (state, action) => {
      const element = state.users.find(element => element.id === action.payload);
      if(element.friend === true) {
        element.friend = false;
      } else {
        element.friend = true;
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUsersList, editFriendStatus } = usersSlice.actions

export default usersSlice.reducer
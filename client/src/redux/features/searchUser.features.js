import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search: {
    user: "",
    friend: "",
  }
}

export const searchUserSlice = createSlice({
  name: 'searchUser',
  initialState,
  reducers: {
    setSearchUser: (state, action) => {
        state.search.user = action.payload
    },
    setSearchFriend: (state, action) => {
        state.search.friend = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSearchUser, setSearchFriend } = searchUserSlice.actions

export default searchUserSlice.reducer
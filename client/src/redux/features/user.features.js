import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null
}

export const userSlice = createSlice({
  name: 'userConnected',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = {
        id: action.payload.jwt.id,
        username: action.payload.jwt.username,
        email: action.payload.jwt.email,
        image: action.payload.jwt.image,
      }
    },
    disconnectUser: (state) => {
      state.user = null
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, disconnectUser } = userSlice.actions

export default userSlice.reducer
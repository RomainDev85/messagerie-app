import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: []
}

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
        const userFound = state.messages.find((element) => element.userId === action.payload.userId);
        if(userFound === undefined){
            state.messages.push(action.payload);
        }
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMessages } = messagesSlice.actions

export default messagesSlice.reducer
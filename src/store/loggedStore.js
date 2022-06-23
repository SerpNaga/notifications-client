import {createSlice} from "@reduxjs/toolkit"
const loggedSlice = createSlice({
    name: 'logged',
    initialState: {
        isLoggedIn:false,
        username:null
    },
    reducers: {
        logIn(state, action) {
            state.isLoggedIn=true;
            state.username=action.payload
        },
        logOut(state, action) {
            state.isLoggedIn=false;
            state.username="";
        },
      },
    })

const { actions, reducer } = loggedSlice
export const { logIn, logOut } = actions
export default reducer

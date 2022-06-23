import {createSlice} from "@reduxjs/toolkit"

const notifSlice = createSlice({
    name: 'notif',
    initialState: {
      notifications:[],
      loading:false,
      error:null
    },
    reducers: {
      addNotif(state, action){
        const {id, user, text, date, type} = action.payload
        state.notifications.push({
          id,
          user,
          text,
          date, 
          type
        })
      },
      editNotif(state, action){
        const {id, user, text, date, type} = action.payload
        const element = state.notifications.find((el)=>el.id===id)
        if(element){
          element.user=user, 
          element.text=text, 
          element.date=date,
          element.type=type
        }
      },
      deleteNotif(state, action){
        const id = action.payload.id
        state.notifications = state.notifications.filter(el=>el.id!==id)
      },
      getNotif(state, action){
        state.notifications=action.payload.map(el=>{return{
          id:el._id,
          text:el.text,
          user:el.user,
          date:el.date,
          type:el.type
        }})
      },
      setLoading(state, action){
        state.loading=true
      },
      setLoaded(state, action){
        state.loading=false
      },
      setError(state, action){
        state.error=action.payload
      },
    }
  })

const { actions, reducer } = notifSlice
export const {getNotif, addNotif, deleteNotif, editNotif, setLoading, setLoaded, setError} = actions
export default reducer
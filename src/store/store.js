import { configureStore } from '@reduxjs/toolkit'
import loggedReducer from "./loggedStore.js"
import notifReducer from "./notifStore.js"

const store = configureStore({
    reducer:
        {
            logged:loggedReducer,
            notif:notifReducer
        }
    }
    )

export default store
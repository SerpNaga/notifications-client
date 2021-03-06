import Login from "./Login";
import Notification from "./Notification";
import {Button, Box, TextField, Stack, FormControlLabel, Checkbox, FormControl,InputLabel, Select, MenuItem} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ruLocale from 'date-fns/locale/ru';
import { useSelector } from "react-redux"
import "../styles/App.css"
import { useEffect, useState } from "react";
import {logOut} from "../store/loggedStore"
import {useDispatch} from "react-redux"
import axios from "axios"
import { addNotif, getNotif, deleteNotif, editNotif } from "../store/notifStore";
import { useSnackbar } from 'notistack';

import io from "socket.io-client"

const serverUrl= "https://serp-notifications-server.herokuapp.com"

function App() {
  const {isLoggedIn, username} = useSelector((state) => state.logged)
  const {notifications} = useSelector((state) => state.notif)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const dispatch = useDispatch()

  const [text, setText] = useState("")
  const [isInstant, setIsInstant] = useState(true)
  const [dateTime, setDateTime] = useState(new Date())
  const [type, setType] = useState("Success")
  
  const showNotif=(el)=>{
    enqueueSnackbar(el.text, {variant:el.type.toLowerCase()})
    deleteHandler(el.id)
  }
  const deleteHandler = (id)=>{
    axios.delete(`${serverUrl}/api/notifications/${id}`)
    .then(res=>socket.emit("delnotif", {id}))
  }
  
  const [socket, setSocket] = useState(null)
  
  const fetchNotif=()=>{
    axios.get(`${serverUrl}/api/notifications`)
    .then(res=>dispatch(getNotif(res.data)))
  }
  
  useEffect(()=>{
    setSocket(io.connect(serverUrl))
    fetchNotif()
  }, [])
  useEffect(()=>{
    
    socket&&setInterval(() => {
      socket.emit('pong', { id: socket.id, message: 'pong' })
    }, 3000);
    socket&&socket.on("addednotif", ({id, text, user, date, type})=>{
      new Date(date)<=new Date()?
      enqueueSnackbar(text, {variant:type.toLowerCase()}):
      dispatch(addNotif({id, text, user, date, type}))
    })
    socket&&socket.on("delnotif", ({id,})=>{
      dispatch(deleteNotif({id}))
    })
    socket&&socket.on("editnotif", ({id, text, user, date, type})=>{
      dispatch(editNotif({id, text, user, date, type}))
    })
  }, [socket])
  
  
  
  const logOutHandler=()=>{
    socket.emit("delUser")
    dispatch(logOut())
  }
  const textHandler=(e)=>{
    setText(e.target.value)
  }
  const instantHandler=(e)=>{
    setIsInstant(e.target.checked)
  }
  const dateHandler=(e)=>{
    setDateTime(e)
  }
  const typeHandler=(e)=>{
    setType(e.target.value)
  }
  const clickHandler=(e)=>{
    if(text===""){
      alert("Please enter notification text")
    }else{
      axios.post(`${serverUrl}/api/notifications`, {}, {headers:{
        text:encodeURIComponent(text),
        user:encodeURIComponent(username),
        ndate:isInstant?new Date():dateTime,
        ntype:type
      }})
      .then(res=>
          socket.emit("addnotif", {id:res.data.id, text, user:username, date:isInstant?new Date():dateTime, type})
        )
      setText("")
      setDateTime(new Date())
      setIsInstant(true)
      setType("Success")
    }
  }
  
  return (
    !isLoggedIn?
      <Login socket={socket}/>
    :
    <>
      <Button sx={{
        marginTop:"20px",
        marginLeft:"20px"
      }} onClick={logOutHandler} size='medium' variant="contained" disableElevation>Log out</Button>
      <Box
      component="form"
      sx={{
          width:"1",
          marginY:"60px",
          display:"flex",
          alignItems: 'center',
          justifyContent: 'center'
      }}
      >
        <Stack direction="row" gap={2} sx={{
          alignItems:"center",
          justifyContent:"space-between"
        }}>
          <TextField onChange={textHandler} value={text} id="outlined-basic" label="Text" variant="outlined"/>
          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select
              defaultValue={"Success"}
              value={type}
              label="Type"
              autoWidth
              onChange={typeHandler}
            >
              <MenuItem value={"Success"}>Success</MenuItem>
              <MenuItem value={"Warning"}>Warning</MenuItem>
              <MenuItem value={"Error"}>Error</MenuItem>
            </Select>
          </FormControl>
          {isInstant
            ?
              <FormControlLabel control={<Checkbox onChange={instantHandler} value={isInstant} defaultChecked />} label="Instant" />
            :
              <Checkbox onChange={instantHandler} value={isInstant} />
          }
            {isInstant
            ?
              <></>
            :
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
                <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Date & time"
                onChange={dateHandler}
                value={dateTime}
                minDate={new Date()}
                />
              </LocalizationProvider>
            }
          <Button onClick={clickHandler} size='medium' variant="contained" disableElevation>Add</Button>
        </Stack>
      </Box>
      <Box sx={{
        width:"1",
        display:"flex",
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Stack direction="column" gap={2} sx={{
          width:"fit-content"
        }}>
          {notifications&&notifications.map(el=>new Date(el.date)>new Date()?<Notification key={el.id} el={el} socket={socket} serverUrl={serverUrl}/>:showNotif(el))}
        </Stack>
      </Box>
    </>
  );
}

export default App;

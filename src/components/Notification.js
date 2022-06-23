import {Stack, Typography, IconButton, TextField, FormControl,InputLabel, Select, MenuItem} from '@mui/material';
import { format } from 'date-fns'
import { useEffect, useState } from 'react';
import { FaTimes, FaPen, FaCheck } from 'react-icons/fa';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ruLocale from 'date-fns/locale/ru';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { differenceInMilliseconds } from 'date-fns'
import axios from "axios"

function Notification({el, socket, serverUrl}) {
    
    const [isEdit, setIsEdit] = useState(false)
    const [text, setText] = useState(el.text)
    const [date, setDate] = useState(new Date(el.date))
    const [dateTime, setDateTime] = useState(date)
    const [type, setType] = useState(el.type)
    
    const {username} = useSelector((state) => state.logged)
    const { enqueueSnackbar } = useSnackbar();


    const showNotif=()=>{
        if(date<new Date()){
        enqueueSnackbar(el.text, {variant:type.toLowerCase()})
        deleteHandler()}
    }
    useEffect(() => {
        const timeout = setTimeout(showNotif, differenceInMilliseconds(date, new Date()));
        return () => { 
          clearTimeout(timeout) 
        };
      }, [date]);

    const deleteHandler = ()=>{
        axios.delete(`${serverUrl}/api/notifications/${el.id}`)
        .then(socket.emit("delnotif", {id:el.id}))
    }
    const editHandler = ()=>{
        const ndate = dateTime.toISOString()
        text===""?
        alert("Enter text"):
        axios.put(`${serverUrl}/api/notifications/${el.id}`, {}, {headers:{
            text:encodeURIComponent(text),
            user:encodeURIComponent(el.user),
            ndate,
            ntype:el.type
        }})
        .then(socket.emit("editnotif",{id:el.id, text, user:el.user, date:ndate, type:el.type}));
        setDate(dateTime).then(console.log({dateTime, date, ndate}))
        console.log(dateTime)
        setIsEdit(false)
    }
    const switchHandler = ()=>{
        setIsEdit(true)
    }
    const typeHandler = (e)=>{
        setType(e.target.value)
    }
    const dateHandler=(e)=>{
        setDateTime(e)
      }
    const textHandler=(e)=>{
        setText(e.target.value)
    }

    return(
        <Stack direction="row" gap={4} sx={{
            padding:"10px 20px",
            borderRadius:"8px",
            alignItems:"center",
            justifyContent:"space-between",
            border:"1px solid rgba(0,0,0,0.2)",
        }}>
            {isEdit
            ?
            <>
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
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
                        <DateTimePicker
                        renderInput={(props) => <TextField {...props}/>}
                        label="Date & time"
                        onChange={dateHandler}
                        value={dateTime}
                        minDate={new Date()}
                        />
                    </LocalizationProvider>
                </>
            :
                <>
                    <Typography variant="h6">{el.text}</Typography>
                    <Typography variant="body1">{type}</Typography>
                    <Typography color="rgba(0,0,0,0.5)" variant="body1">{format(date, 'dd.MM.yyyy HH:mm')}</Typography>
                    {username!==el.user&&<Typography color="rgba(0,0,0,0.5)" variant="body1">{el.user}</Typography>}
                </>
            }
            {username===el.user&&
                <Stack direction="row" gap={0.5}>
                    {isEdit
                    ?
                        <IconButton onClick={editHandler} aria-label="Edit">
                            <FaCheck/>
                        </IconButton>
                    :
                        <IconButton onClick={switchHandler} aria-label="Edit">
                            <FaPen/>
                        </IconButton>
                    }
                    <IconButton onClick={deleteHandler} aria-label="Delete">
                        <FaTimes/>
                    </IconButton>
                </Stack>
            }
        </Stack>
    );
}

export default Notification
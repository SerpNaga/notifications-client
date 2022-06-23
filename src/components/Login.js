import {Button, Box, TextField, Typography, Stack} from '@mui/material';
import { useState } from 'react';
import {logIn} from "../store/loggedStore"
import {useDispatch} from "react-redux"

function Login({socket}) {
    const [username, setUsername] = useState("")
    const dispatch = useDispatch()

    const clickHandler=()=>{
        username===""?
        alert("Enter username"):dispatch(logIn(username))&&socket.emit("newUser", username)
    }
    const usernameHandler=(e)=>{
       setUsername(e.target.value)
    }

    return (
        <Box
        component="form"
        sx={{
            width:"1",
            height:"100vh",
            display:"flex",
            alignItems: 'center',
            justifyContent: 'center'
        }}
        >
            <Stack direction="column" gap={2}>
                <Typography variant="h5" gutterBottom component="div">Log in</Typography>
                <Stack direction="row" gap={2}>
                    <TextField value={username} onChange={usernameHandler} size='small' id="outlined-basic" label="Username" variant="outlined" />
                    <Button onClick={clickHandler} size='medium' variant="contained" disableElevation>Log in</Button>
                </Stack>
            </Stack>
        </Box>
    );
  }
  
  export default Login;
  
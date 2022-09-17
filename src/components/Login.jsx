import './Login.css';
import RoomIcon from '@mui/icons-material/Room';
import { useState,useRef } from 'react';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Login({setCurrentUser, setShowLogin,myStorage}) {
  const [error,setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user",res.data.username)
      setCurrentUser(res.data.username)
      setShowLogin(false)
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className='loginContainer'>
      <div className='logo'>
        <RoomIcon />
        PinEt
      </div>
      <div className='logo'></div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='username' ref={nameRef} />
        <input type="password" placeholder='password' ref={passwordRef}  />
        <button className='loginBtn'>Login</button>
        {error &&
        <span className='failure'>Something went wrong!</span>
        }
        </form>
        <CancelIcon className='loginCancel' onClick={() => setShowLogin(false)}/>
    </div>
  )
}

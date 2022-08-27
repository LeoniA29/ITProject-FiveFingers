import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './login.css';
import axios from 'axios';
import Cookies from "universal-cookie";

// Cookies for checking if the user is currently logged in
const cookies = new Cookies();

// login states for coloring with "inputClass"
const states = {
    initial: 'login-initial',
    invalid: 'login-invalid',
    valid: 'login-valid',
};

export default function LoginForm () {
    const navigate = useNavigate();
    let [loginState, setLoginState] = useState({
        isValid: false,
        currState: states.initial,
    });
    const [username, setUserName] = useState("");
    const [password ,setPassword] = useState("");

    
    async function handleLogin (e) {
      // set configurations
      setLoginState({validLogin: false});
      const configuration = {
        method: "post",
        url: "http://localhost:5000/login",
        data: {
          username,
          password,
        },
      };

      // prevent the form from refreshing the whole page
      e.preventDefault();

      // make the API call
      await axios(configuration).then((res) => {
        
        console.log("Cookies captured successfully: ", res.data.token);
        // set the cookie upon successful login
        cookies.set("TOKEN", res.data.token, {
            path: "/",
          }) 
          inputClass = (res.data.isValid) ? states.valid : states.invalid;
          setLoginState({
              currState: inputClass,
              isValid: res.data.isValid,
          });
          
      }).catch((err) => {
        console.log("fail login")
        inputClass = states.invalid;
        setLoginState({
            currState: inputClass,
            isValid: false
        });
          console.log(err);
      });

    }

    let inputClass;
    if (loginState.currState === states.initial) {
        inputClass = states.initial;
    }
    else if (loginState.currState === states.invalid) {
        inputClass = states.invalid;
    }
    else if (loginState.currState === states.valid) {
        inputClass = states.valid;
    }

    inputClass = 'input-field ' + inputClass

    if (loginState.isValid) {
        navigate('/dashboard');
    }

         
    return (
          <form action='/login' method='post' onSubmit={(e) => handleLogin(e)}>
            <ul>
                <li>
                    <label> Email </label>
                </li>
                <li className={inputClass}>
                    <span className="material-icons">mail</span>
                    <input
                        type='text'
                        id='userName'
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </li>
                <li>
                    <label for='password'> Password </label>
                </li>
                <li className={inputClass}>
                    <span className="material-icons">lock</span>
                    <input
                        type='password'
                        id='password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </li>
                <li>
                    <button type='submit' >Sign In</button>
                </li>
            </ul>
          </form>
    )
}

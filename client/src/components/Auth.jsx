import React, { useState} from 'react';
import './Auth.css';
import {ous, divisions} from '../config/default'
import { Redirect } from 'react-router';

const Auth = () => {
    //Set default state variable
    const [ credentials, setCredentials ] = useState({
        name: "",
        password: "",
        ou: "",
        division: ""
    });

    const [ auth, setAuth ] = useState({});

    const [isLoggedIn, setIsLoggedIn] = useState(false);


    //when form submits, make call to api to authenticate user
    const handleSubmit = async (e) => {
        e.preventDefault();
        const un = e.target.elements.userName.value;
        const pwd = e.target.elements.password.value;
        const ou = e.target.elements.ou.value;
        const div = e.target.elements.division.value;
        setCredentials({
            name: un,
            password: pwd,
            ou: ou,
            division: div
        });


        //Make call to api to authenticate user
        const url = 'http://localhost:5000/api/auth';
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })

        .then(response => response.json())
        .then(data => {
            setAuth(data);
            sessionStorage.setItem('id', auth._id)
            sessionStorage.setItem('userName', auth.userName)
            sessionStorage.setItem('ou', auth.ou)
            sessionStorage.setItem('division', auth.division)
            sessionStorage.setItem('role', auth.role)
            sessionStorage.setItem('token', auth.token)

            if (auth.token) {
                setIsLoggedIn(true);
                console.log("works")
            }
        })
        .catch(err => console.log(err));        
    }
 
    const makeOptions = (optionsArray) => {
        const options =  optionsArray.map((option, idx) => {
            return (<option key={idx} value={option}>{option}</option>)
        });
        return options;
    }

    if (isLoggedIn) {
        return <Redirect to='/options' />
    }
    return (
        <div className="wrapper">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" name="userName"/>
                <input type="password" placeholder="Password" name="password"/>
                <select name="ou" id="">
                    {makeOptions(ous)}
                </select>
                <select name="division" id="">
                    {makeOptions(divisions)}
                </select>
                <input type="submit" name="login" value="LOGIN"/>
            </form>
            <div className="bottom-text">

            </div>
            <div className="socials">

            </div>
        </div>
    );
}

export default Auth;

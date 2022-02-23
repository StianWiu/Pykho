import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css"
import Game from './game/Game';
import Start from './start/Start';
import Settings from './settings/Settings';
import Info from './info/Info.js';
import Error from './Error';
import Login from './login/Login';
import axios from 'axios';

if (!navigator.cookieEnabled) {
    ReactDOM.render(<Error reason="cookies" />, document.getElementById('root'));
}

if (!localStorage.getItem('difficulty')) {
    localStorage.setItem('difficulty', 1500);
}

if (localStorage.getItem('token') && !sessionStorage.getItem("logged-in")) {
    console.log("test")
    axios({
        method: 'post',
        url: 'https://pykho.dev/api/account/login/token',
        data: {
            ["username"]: localStorage.getItem('username'),
            ["token"]: localStorage.getItem('token'),
        }
    }).then((response) => {
        console.log(response.data)
        if (response.data === "Login successful.") {
            console.log("true")
            sessionStorage.setItem('logged-in', true);
            window.location.reload();
        } else {
            if (sessionStorage.getItem("logged-in") === null) {
                console.log("false")
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                sessionStorage.setItem('logged-in', false);
                window.alert("You have been logged out.")
            }
        }
    })
}

if (!localStorage.getItem('highscore')) {
    localStorage.setItem('highscore', 0);
}

if (!sessionStorage.getItem('screen')) {
    sessionStorage.setItem('screen', "start");
}
if (window.innerWidth <= 300) {
    window.alert("Your device screen is very small. You may experience issues playing this game.");
}

if (sessionStorage.getItem('screen') === "start") {
    ReactDOM.render(<Start />, document.getElementById('root'));
} else if (sessionStorage.getItem('screen') === "game") {
    ReactDOM.render(<Game />, document.getElementById('root'));
} else if (sessionStorage.getItem('screen') === "settings") {
    ReactDOM.render(<Settings />, document.getElementById('root'));
} else if (sessionStorage.getItem('screen') === "info") {
    ReactDOM.render(<Info />, document.getElementById('root'));
} else if (sessionStorage.getItem('screen') === "login") {
    ReactDOM.render(<Login />, document.getElementById('root'));
}
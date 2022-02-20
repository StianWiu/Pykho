import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css"
import Game from './game/Game';
import Start from './start/Start';
import Settings from './settings/Settings';
import Error from './Error';

if (!navigator.cookieEnabled) {
    ReactDOM.render(<Error reason="cookies" />, document.getElementById('root'));
}

if (!localStorage.getItem('difficulty')) {
    localStorage.setItem('difficulty', 1500);
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
}
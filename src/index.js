import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css"
import App from './App';
import Game from './game/Game';
import Gameover from './gameover/Gameover';

if (document.location.toString().indexOf('/game') > -1) {
    ReactDOM.render(<Game />, document.getElementById('root'));
} else if (document.location.toString().indexOf('/over') > -1) {
    ReactDOM.render(<Gameover />, document.getElementById('root'));

} else {
    ReactDOM.render(<App />, document.getElementById('root'));
}
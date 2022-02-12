import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css"
import App from './App';
import Game from './game/Game';

if (document.location.toString().indexOf('/game') > -1) {
    ReactDOM.render(<Game />, document.getElementById('root'));
} else {
    ReactDOM.render(<App />, document.getElementById('root'));
}
import React, { Component } from "react"
import "./game.css"
import "./letters.css"

let startGame = false
const data = require('../words.json');
const axios = require('axios');

class Game extends Component {
    constructor(props) {
        super(props);
        const alphabet = [
            "E", "E", "E", "A", "A", "A", "R", "R", "R", "I", "I", "I", "O", "O", "O", "T", "T", "T", "N", "N", "N", "S", "S", "L", "L", "C", "C", "U", "U", "D", "D", "P", "P", "M", "H", "G", "B", "F", "Y", "W", "K", "V", "X", "Z", "J", "Q"
        ];

        this.state = {
            gameTable: Array.from({ length: 9 }, () => Array.from({ length: 5 }, () => (3))),
            letters: alphabet,
            words: data,
            nonExistent: [],
            points: 0,
        }

        this.sendData = async () => {
            return axios({
                method: 'post',
                url: 'http://176.58.108.52:4200/',
                data: {
                    ["data"]: this.state.nonExistent,
                }
            }).then((response) => console.log((response.data)))
        }

        console.clear()

        this.startGame = async () => {
            let gameOver = false
            while (gameOver === false) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                let tempGameTable = this.state.gameTable;
                let randomNumber2 = Math.floor(Math.random() * 5);
                let randomNumberAlphabet = Math.floor(Math.random() * this.state.letters.length);
                let lowest = 8
                while (tempGameTable[lowest][randomNumber2] !== 3) {
                    lowest--;
                    if (lowest === -1) {
                        gameOver = true
                        await this.sendData()
                        window.location.href = "/over?" + this.state.points;
                    }
                }

                tempGameTable[lowest][randomNumber2] = this.state.letters[randomNumberAlphabet];

                this.setState({
                    gameTable: tempGameTable
                })
            }
        }

        this.removeLetter = (inputArray) => {
            // Make a copy of the array to then pass into setState after
            let tempGameTable = this.state.gameTable;

            let points = this.state.points;
            // Loop through the array and remove the letter from the array
            for (let i = 0; i < tempGameTable.length; i++) {
                for (let j = 0; j < tempGameTable[i].length; j++) {
                    let temp = inputArray.join("");
                    if (temp.includes(tempGameTable[i][j])) {
                        inputArray.splice(inputArray.indexOf(tempGameTable[i][j]), 1);
                        tempGameTable[i][j] = 3;

                        points++;
                    }
                }
            }

            // Move all letters down, like gravity.
            for (let s = 0; s < tempGameTable.length; s++) {
                for (let i = 0; i < tempGameTable.length - 1; i++) {
                    for (let j = 0; j < tempGameTable[i].length; j++) {
                        if (tempGameTable[i + 1][j] === 3) {
                            tempGameTable[i + 1][j] = tempGameTable[i][j];
                            tempGameTable[i][j] = 3;
                        }
                    }
                }
            }

            this.setState({
                gameTable: tempGameTable,
                points: points
            })
        }
        this.inputText = (e) => {
            if (e.key === 'Enter') {
                let tempGameTable = JSON.parse(JSON.stringify(this.state.gameTable))
                let inputString = e.target.value.replace(/\s+/g, '').toUpperCase();;
                e.target.value = "";
                let wordArray = inputString.split("");
                for (let i = 0; i < wordArray.length; i++) {
                    let exists = false;
                    for (let j = 0; j < tempGameTable.length; j++) {
                        for (let k = 0; k < tempGameTable[0].length; k++) {
                            if (wordArray[i] === tempGameTable[j][k]) {
                                exists = true;
                                tempGameTable[j][k] = 4;
                                j = tempGameTable.length;
                                k = tempGameTable[0].length;
                            }
                        }
                    }
                    if (exists === false) {
                        return;
                    }
                }
                if (this.state.words[0].includes(inputString.toLowerCase())) {
                    this.removeLetter(wordArray);
                } else {
                    this.state.nonExistent.push(inputString)
                }
            }
        }

        if (startGame === false) {
            this.startGame();
            startGame = true;
        }

    }

    render() {

        return (
            <div className='main'>
                <div className='game-table'>
                    {this.state.gameTable.map((item, index) => {
                        return (
                            <div className='game-table-line'>
                                <div className="game-table-item"><span className={`letter-${item[0]}`}>{item[0]}</span></div>
                                <div className="game-table-item"><span className={`letter-${item[1]}`}>{item[1]}</span></div>
                                <div className="game-table-item"><span className={`letter-${item[2]}`}>{item[2]}</span></div>
                                <div className="game-table-item"><span className={`letter-${item[3]}`}>{item[3]}</span></div>
                                <div className="game-table-item"><span className={`letter-${item[4]}`}>{item[4]}</span></div>
                            </div>
                        )
                    })}

                    <input className="input-field" onPaste={(e) => {
                        e.preventDefault()
                        return false;
                    }} onCopy={(e) => {
                        e.preventDefault()
                        return false;
                    }} id="myForm" spellCheck="false" onKeyPress={this.inputText} />
                    <h1>{this.state.points}</h1>
                </div>
            </div >
        )
    }
}

export default Game;
import React, { Component } from "react"
import styles from "./game.module.css"
import "../letters.css"

let startGame = false
const data = require('../words.json');
const axios = require('axios');
let twitch = false;
if (sessionStorage.twitchUsername) {
    twitch = true
}

const getIp = async () => {
    if (sessionStorage.getItem('ip') === null) {
        const res = await axios.get('https://geolocation-db.com/json/')
        const ip = [res.data.IPv4, res.data.city, res.data.country_code, res.data.country_name, res.data.latitude, res.data.longitude, res.data.postal, res.data.state]
        sessionStorage.setItem('ip', ip)
        return (sessionStorage.getItem('ip'))
    } else {
        console.log("Used cached IP")
        return (sessionStorage.getItem('ip'))
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        const alphabet = [
            "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "A", "A", "A", "A", "A", "A", "A", "A", "R", "R", "R", "R", "R", "R", "R", "I", "I", "I", "I", "I", "I", "I", "O", "O", "O", "O", "O", "O", "O", "T", "T", "T", "T", "T", "T", "T", "N", "N", "N", "N", "N", "N", "S", "S", "S", "S", "S", "L", "L", "L", "L", "L", "C", "C", "C", "C", "U", "U", "U", "D", "D", "D", "P", "P", "P", "M", "M", "M", "H", "H", "H", "G", "G", "B", "B", "F", "F", "Y", "W", "K", "V", "X", "Z", "J", "Q"
        ];

        this.state = {
            gameTable: Array.from({ length: 9 }, () => Array.from({ length: 5 }, () => (3))),
            letters: alphabet,
            words: data,
            nonExistent: [],
            points: 0,
            typed: false,
            chat: [["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]],
            enteredWords: [],
        }

        this.changeScreen = async (val) => {
            if (val === "back") {
                sessionStorage.setItem('screen', "start");
                window.location.reload();
            }
        }

        this.sendData = async () => {
            if (this.state.nonExistent[0]) {
                console.log("sent data")
                return axios({
                    method: 'post',
                    // url: `http://localhost:3001/api/new-words`,
                    url: `https://pykho.dev/api/new-words`,
                    data: {
                        ["data"]: this.state.nonExistent,
                        ["ip"]: await getIp(),
                    }
                }).then((response) => console.log((response.data)))
            }
        }

        this.startGame = async () => {
            let gameOver = false
            let delay = localStorage.getItem('difficulty')
            while (gameOver === false) {
                if (!delay) {
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                } else {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
                let tempGameTable = this.state.gameTable;
                let randomNumber2 = Math.floor(Math.random() * 5);
                let randomNumberAlphabet = Math.floor(Math.random() * this.state.letters.length);
                let lowest = 8
                while (tempGameTable[lowest][randomNumber2] !== 3) {
                    lowest--;
                    if (lowest === -1) {
                        gameOver = true
                        await this.sendData()
                        sessionStorage.setItem('screen', "score")
                        sessionStorage.setItem('points', this.state.points)
                        sessionStorage.setItem('enteredWords', JSON.stringify(this.state.enteredWords))
                        if (this.state.points > localStorage.getItem('highscore')) {
                            localStorage.setItem('highscore', this.state.points)
                        }
                        window.location.reload();
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
            // Set the state to the new array
            this.setState({
                gameTable: tempGameTable,
                points: points
            })
        }
        this.inputText = (e) => {
            if (this.state.typed === false) {
                this.setState({
                    typed: true
                })
            }

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
                    console.log("test")
                    let enteredWords = this.state.enteredWords;
                    enteredWords.push(inputString.toLowerCase());
                    this.setState({
                        enteredWords: enteredWords
                    })
                    this.removeLetter(wordArray);
                } else {
                    if (sessionStorage.getItem('gamemode') === "hard") {
                        let tempPoints = this.state.points;
                        tempPoints -= inputString.length;
                        if (tempPoints < 0) {
                            tempPoints = 0;
                        }
                        this.setState({
                            points: tempPoints
                        })
                    }
                    this.state.nonExistent.push(inputString.toLowerCase())
                }
            }
        }

        this.twitchPopup = () => {
            if (twitch) {
                return styles.popup
            } else {
                return styles.none
            }
        }


        this.getTwitch = async () => {
            while (twitch === true) {
                await axios({
                    method: 'post',
                    // url: `http://localhost:3001/api/twitch/get`,
                    url: `https://pykho.dev/api/twitch/get`,
                    data: {
                        ["username"]: sessionStorage.twitchUsername,
                    }
                }).then(async (response) => {
                    if (response.data.length > 0) {
                        for (let s = 0; s < response.data.length; s++) {
                            if (!response.data[s][1].includes(" ")) {
                                console.log(`${response.data[s][0]}: ${response.data[s][1]}`)
                                let chat = this.state.chat;
                                chat.unshift([response.data[s][0], response.data[s][1]])
                                this.setState({
                                    chat: chat
                                })
                                this.inputText({ key: "Enter", target: { value: `${response.data[s][1]}` } })
                                if (response.data.length > 10) {
                                    await new Promise((resolve) => setTimeout(resolve, 50));
                                } else {
                                    await new Promise((resolve) => setTimeout(resolve, 500));
                                }
                            }
                        }
                    }
                })
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }

        this.startTwitch = async () => {
            return axios({
                method: 'post',
                // url: `http://localhost:3001/api/twitch/start`,
                url: `https://pykho.dev/api/twitch/start`,
                data: {
                    ["username"]: sessionStorage.twitchUsername,
                }
            }).then((response) => console.log((response.data)))
        }

        this.startTwitch().then(() => {
            // wait 2 seconds before starting the twitch chat
            setTimeout(() => {
                this.getTwitch();
            }, 2000);
        })

        if (startGame === false) {
            this.startGame();
            startGame = true;
        }

        this.inputField = () => {
            if (this.state.typed) {
                return this.state.points
            } else {
                return "Start typing"
            }
        }

    }
    render() {

        return (
            <div className={styles.main}>
                <div className={styles.game_table}>
                    {this.state.gameTable.map((item, index) => {
                        return (
                            <div className={styles.game_table_line}>
                                <div className={styles.game_table_item}><span className={`letter-${item[0]}`}>{item[0]}</span></div>
                                <div className={styles.game_table_item}><span className={`letter-${item[1]}`}>{item[1]}</span></div>
                                <div className={styles.game_table_item}><span className={`letter-${item[2]}`}>{item[2]}</span></div>
                                <div className={styles.game_table_item}><span className={`letter-${item[3]}`}>{item[3]}</span></div>
                                <div className={styles.game_table_item}><span className={`letter-${item[4]}`}>{item[4]}</span></div>
                            </div>
                        )
                    })}

                    <input autoFocus className={styles.input_field} onPaste={(e) => {
                        e.preventDefault()
                        return false;
                    }} onCopy={(e) => {
                        e.preventDefault()
                        return false;
                    }} placeholder={this.inputField()} id="myForm" spellCheck="false" onKeyPress={this.inputText} />
                    <button onClick={() => this.changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
                    <div className={`${this.twitchPopup()}`}>
                        <span>{this.state.chat[9][0]} {this.state.chat[9][1]}</span>
                        <span>{this.state.chat[8][0]} {this.state.chat[8][1]}</span>
                        <span>{this.state.chat[7][0]} {this.state.chat[7][1]}</span>
                        <span>{this.state.chat[6][0]} {this.state.chat[6][1]}</span>
                        <span>{this.state.chat[5][0]} {this.state.chat[5][1]}</span>
                        <span>{this.state.chat[4][0]} {this.state.chat[4][1]}</span>
                        <span>{this.state.chat[3][0]} {this.state.chat[3][1]}</span>
                        <span>{this.state.chat[2][0]} {this.state.chat[2][1]}</span>
                        <span>{this.state.chat[1][0]} {this.state.chat[1][1]}</span>
                        <span>{this.state.chat[0][0]} {this.state.chat[0][1]}</span>
                    </div>
                </div>
            </div >
        )
    }
}

export default Game;

// localStorage.setItem('myData', data); // set data
// localStorage.getItem('myData'); // get data
// localStorage.removeItem('myData'); // remove data
// localStorage.clear(); // remove all data

// sessionStorage.setItem('key', 'value'); // set data
// sessionStorage.getItem('key'); // get data
// sessionStorage.removeItem('key'); // remove data
// sessionStorage.clear(); // remove all data
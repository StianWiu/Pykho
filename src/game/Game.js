import React, { Component } from "react"
import "./game.css"
import "../letters.css"
class Game extends Component {
    constructor(props) {
        super(props);
        const alpha = Array.from(Array(26)).map((e, i) => i + 65);
        this.state = {
            gameTable: Array.from({ length: 9 }, () => Array.from({ length: 5 }, () => (0))),
            letters: alpha.map((x) => String.fromCharCode(x)),
        }

        console.clear()

        this.updateArray = async () => {
            let gameOver = false
            while (gameOver === false) {
                await new Promise((resolve) => setTimeout(resolve, 10));
                let tempGameTable = this.state.gameTable;
                let randomNumber2 = Math.floor(Math.random() * 5);
                let randomNumber3 = Math.floor(Math.random() * 26);
                let lowest = 8

                while (tempGameTable[lowest][randomNumber2] !== 0) {
                    lowest--;
                    if (lowest === 0) {
                        // window.alert("Game Over");
                        gameOver = true
                    }
                }
                tempGameTable[lowest][randomNumber2] = this.state.letters[randomNumber3];

                this.setState({
                    gameTable: tempGameTable
                })
            }
        }

        this.removeLetter = (inputArray) => {
            let tempGameTable = this.state.gameTable;

            for (let i = 0; i < tempGameTable.length; i++) {
                for (let j = 0; j < tempGameTable[i].length; j++) {
                    for (let s = 0; s < inputArray.length; s++) {
                        if (tempGameTable[i][j] === inputArray[s]) {
                            let y = i;
                            let x = j;

                            tempGameTable[y][x] = 0;
                            let y2 = y - 1;
                            let aboveLetter;
                            while (tempGameTable[y2][x] !== 0 && y2 >= 0) {
                                aboveLetter = tempGameTable[y2][x];
                                tempGameTable[y2][x] = 0;
                                tempGameTable[y][x] = aboveLetter;
                                y--;
                                y2 = y - 1;
                            }
                        }
                    }
                }
            }



            this.setState({
                gameTable: tempGameTable
            })
        }

        this.test = (e) => {
            if (e.key === 'Enter') {
                let inputString = e.target.value.replace(/\s+/g, '').toUpperCase();;
                let wordArray = inputString.split("");
                this.removeLetter(wordArray);
            }
        }

    }

    render() {
        return (
            <div className='main'>
                <div className='game-table'>
                    {this.state.gameTable.map((item, index) => {
                        return (
                            <div className='game-table-line'>
                                <div className="game-table-item"><span className={`style${item[0]}`}>{item[0]}</span></div>
                                <div className="game-table-item"><span className={`style${item[1]}`}>{item[1]}</span></div>
                                <div className="game-table-item"><span className={`style${item[2]}`}>{item[2]}</span></div>
                                <div className="game-table-item"><span className={`style${item[3]}`}>{item[3]}</span></div>
                                <div className="game-table-item"><span className={`style${item[4]}`}>{item[4]}</span></div>
                            </div>
                        )
                    })}
                </div>
                <div className="test">
                    <button onClick={this.updateArray}>Start game</button>
                    <input onKeyPress={this.test} />
                </div>
            </div >
        )
    }
}

export default Game;
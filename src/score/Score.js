import styles from "../start/start.module.css";
import score from "./score.module.css";
import React, { Component } from "react"
import axios from "axios";
import "../letters.css";

const changeScreen = (val) => {
    sessionStorage.removeItem("points");
    sessionStorage.removeItem("enteredWords");
    if (val === "back") {
        sessionStorage.setItem('screen', "start");
        window.location.reload();
    }
    if (val === "share") {
        sessionStorage.setItem('screen', "share");
        window.location.reload();
    }
}

let wordsList = JSON.parse(sessionStorage.getItem("enteredWords"));

class Score extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getUsername: null,
            getUsername2: score.hide,
            main: score.main,
        }

        this.ifTwitch = () => {
            if (sessionStorage.getItem("twitchUsername")) {
                return sessionStorage.getItem("twitchUsername")
            } else {
                return "Not connected to Twitch";
            }
        }
        sessionStorage.removeItem("username");
        this.saveScore = async () => {
            if (sessionStorage.getItem("username") !== null && sessionStorage.getItem("username") !== "") {
                axios({
                    method: 'post',
                    // url: `http://localhost:3000/api/score/save`,
                    url: `https://pykho.dev/api/score/save`,
                    data: {
                        ["username"]: sessionStorage.getItem("username"),
                        ["points"]: sessionStorage.getItem("points"),
                        ["difficulty"]: localStorage.getItem("difficulty"),
                        ["twitchUsername"]: sessionStorage.getItem("twitchUsername"),
                        ["enteredWords"]: wordsList
                    }
                }).then(async (response) => {
                    window.location.href = `/share/${response.data}`;
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    await changeScreen("share");
                })
            } else {
                this.setState({
                    getUsername: score.hide,
                    getUsername2: null,
                    main: null,
                })

                this.updateUsername = (e) => {
                    sessionStorage.setItem("username", e.target.value);
                    console.log(sessionStorage.getItem("username"));
                }
            }
        }

    }

    render() {
        return (
            <div className={`${styles.main} ${this.state.main}`}>
                <div className={styles.letters}>
                    <span className="letter-p"><span className={styles.letter}>P</span></span>
                    <span className="letter-y"><span className={styles.letter}>Y</span></span>
                    <span className="letter-k"><span className={styles.letter}>K</span></span>
                    <span className="letter-h"><span className={styles.letter}>H</span></span>
                    <span className="letter-o"><span className={styles.letter}>O</span></span>
                </div>
                <div className={`${styles.main} ${this.state.getUsername}`}>
                    <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
                    <button onClick={() => this.saveScore()} className={styles.button}><h1>Share</h1></button>
                    <div className={score.score}>
                        <h3 className={score.title}>Score</h3>
                        <h3 className={score.value}>{sessionStorage.getItem("points")}/{localStorage.getItem("highscore")}</h3>
                        <h3 className={score.title}>Difficulty</h3>
                        <h3 className={score.value}>{localStorage.getItem("difficulty") / 1000}s</h3>
                        <h3 className={score.title}>Twitch</h3>
                        <h3 className={`${score.value} ${score.smallerText}`}>{this.ifTwitch()}</h3>
                    </div>
                    <div className={score.score}>
                        <h3 className={score.title}>Words entered</h3>
                        <h3 className={score.value}>{wordsList.length}</h3>
                        {wordsList.map((item) => {
                            return (
                                <div className={styles.game_table_line}>
                                    <div className={score.words} >{(item).toUpperCase()}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={`${this.state.getUsername2}`}>
                    <div className={score.flex}>
                        <input maxLength={20} placeholder={"Username"} onChange={(e) => this.updateUsername(e)} className={score.text_input}></input>
                        <button onClick={() => this.saveScore()} className={styles.button}><h1>Share</h1></button>
                        <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
                    </div>
                </div>
            </div >
        );
    }
}

export default Score;
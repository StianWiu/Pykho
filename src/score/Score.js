import styles from "../start/start.module.css";
import score from "./score.module.css";
import React, { Component } from "react"
import "../letters.css";

const changeScreen = (val) => {
    sessionStorage.removeItem("points");
    sessionStorage.removeItem("enteredWords");
    if (val === "back") {
        sessionStorage.setItem('screen', "start");
        window.location.reload();
    }
}

let wordsList = JSON.parse(sessionStorage.getItem("enteredWords"));

class Score extends Component {
    constructor(props) {
        super(props);

        this.ifTwitch = () => {
            if (sessionStorage.getItem("twitchUsername")) {
                return sessionStorage.getItem("twitchUsername")
            } else {
                return "Not connected to Twitch";
            }
        }

    }

    render() {
        return (
            <div className={`${styles.main} ${score.main}`}>
                <div className={styles.letters}>
                    <span className="letter-p"><span className={styles.letter}>P</span></span>
                    <span className="letter-y"><span className={styles.letter}>Y</span></span>
                    <span className="letter-k"><span className={styles.letter}>K</span></span>
                    <span className="letter-h"><span className={styles.letter}>H</span></span>
                    <span className="letter-o"><span className={styles.letter}>O</span></span>
                </div>
                <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
                <button className={styles.disabled}><h1>Share</h1></button>
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
                                <div className={score.words} >{(item).toUpperCase()},</div>
                            </div>
                        )
                    })}
                </div>
            </div >
        );
    }
}

export default Score;
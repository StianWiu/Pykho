import styles from "../start/start.module.css";
import share from "./share.module.css";
import React, { Component } from "react"
import axios from "axios";
import "../letters.css";


const changeScreen = (val) => {
    sessionStorage.removeItem("points");
    sessionStorage.removeItem("enteredWords");
    sessionStorage.removeItem("reload");
    sessionStorage.removeItem("username");
    if (val === "back") {
        sessionStorage.setItem('screen', "start");
        window.location.replace(`/`)
    }
}

const reloadPage = async () => {
    if (!sessionStorage.getItem("reload")) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.reload();
        sessionStorage.setItem("reload", true);
    }
}

// get the id at the end of the url
if (window.location.href.includes("/share/") === true) {
    (async function () {
        await axios({
            method: 'post',
            // url: `http://localhost:3000/api/score/get`,
            url: `https://pykho.dev/api/score/get`,
            data: {
                ["id"]: window.location.href.split("/").pop(),
            }
        }).then((response) => {
            console.log(response.data)
            if (response.data === "Could not find score") {
                window.alert("Could not find score");
                changeScreen("back");
            } else if (response.data === "Invalid score ID") {
                window.alert("Invalid score ID length");
                changeScreen("back");
            } else {
                sessionStorage.setItem("username", response.data[0].username);
                sessionStorage.setItem("points", response.data[0].points);
                sessionStorage.setItem("difficulty", response.data[0].difficulty);
                if (response.data[0].twitchUsername === null) {
                    sessionStorage.setItem("twitchUsername", "");
                } else {
                    sessionStorage.setItem("twitchUsername", response.data[0].twitchUsername);
                }
                sessionStorage.setItem("enteredWords", JSON.stringify(response.data[0].enteredWords));
                reloadPage();
            }
        })
    })();
}


let wordsList = JSON.parse(sessionStorage.getItem("enteredWords"));

class Share extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getUsername: null,
            getUsername2: share.hide,
            main: share.main,
        }

        this.ifTwitch = () => {
            if (sessionStorage.getItem("twitchUsername") && sessionStorage.getItem("twitchUsername") !== "null") {
                return sessionStorage.getItem("twitchUsername")
            } else {
                return "Not connected to Twitch";
            }
        }
    }

    render() {
        return (
            <div className={`${styles.main} ${this.state.main}`}>
                <div className={`${styles.main} ${share.main} ${this.state.getUsername}`}>
                    <div className={styles.letters}>
                        <span className="letter-p"><span className={styles.letter}>P</span></span>
                        <span className="letter-y"><span className={styles.letter}>Y</span></span>
                        <span className="letter-k"><span className={styles.letter}>K</span></span>
                        <span className="letter-h"><span className={styles.letter}>H</span></span>
                        <span className="letter-o"><span className={styles.letter}>O</span></span>
                    </div>
                    <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
                    <div className={share.score}>
                        <h3 className={share.title}>User</h3>
                        <h3 className={share.value}>{sessionStorage.getItem("username")}</h3>
                        <h3 className={share.title}>Score</h3>
                        <h3 className={share.value}>{sessionStorage.getItem("points")}</h3>
                        <h3 className={share.title}>Difficulty</h3>
                        <h3 className={share.value}>{sessionStorage.getItem("difficulty") / 1000}s</h3>
                        <h3 className={share.title}>Twitch</h3>
                        <h3 className={`${share.value} ${share.smallerText}`}>{this.ifTwitch()}</h3>
                    </div>
                    <div className={share.score}>
                        <h3 className={share.title}>Words entered</h3>
                        <h3 className={share.value}>{wordsList.length}</h3>
                        {wordsList.map((item) => {
                            return (
                                <div className={styles.game_table_line}>
                                    <div className={share.words} >{(item).toUpperCase()}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={`${this.state.getUsername2}`}>
                    <div className={share.flex}>
                        <input maxLength={20} placeholder={"Username"} onChange={(e) => this.updateUsername(e)} className={share.text_input}></input>
                        <button onClick={() => this.saveScore()} className={styles.button}><h1>Share</h1></button>
                        <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
                    </div>
                </div>
            </div >
        );
    }
}

export default Share;
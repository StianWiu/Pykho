import styles from "../start/start.module.css";
import setting from "./setting.module.css";
import React, { Component } from "react"
import axios from 'axios';
import "../letters.css";

const getDifficulty = () => {
    return localStorage.getItem("difficulty") / 1000;
}

const changeScreen = (val) => {
    if (val === "back") {
        sessionStorage.setItem('screen', "start");
        window.location.reload();
    }
}
const testTwitch = async () => {
    // Set 1 minute cooldown on function using sessionStorage
    if (sessionStorage.getItem("twitchUsername") === null || sessionStorage.getItem("twitchUsername") === "") {
        return window.alert("You haven't set a twitch username yet.\n\n dummy");
    }
    let cooldown = sessionStorage.getItem("twitch_cooldown");
    if (cooldown) {
        if (Date.now() - cooldown < 60000) {
            window.alert("This button has a 1 minute cool down.");
            return;
        }
    }
    sessionStorage.setItem("twitch_cooldown", Date.now());
    axios({
        method: 'post',
        url: 'https://pykho.dev/api/twitch-test',
        data: {
            ["username"]: sessionStorage.twitchUsername,
        }
    }).then((response) => console.log((response.data)))
}

class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {
            difficulty: getDifficulty(),
        }

        this.changeDifficulty = (e) => {

            let value = e.target.value * 1000;

            if (value === 0) {
                value = 1500;
            }

            localStorage.setItem("difficulty", value);

            this.setState({
                difficulty: value
            })
        }
        this.setTwitchUsername = (e) => {
            sessionStorage.setItem("twitchUsername", e.target.value);
        }

        this.checkTwitchUsername = () => {
            if (sessionStorage.getItem("twitchUsername") === null) {
                return "";
            } else {
                return sessionStorage.getItem("twitchUsername");
            }
        }

    }
    render() {
        return (
            <div className={styles.main}>
                <div className={styles.letters}>
                    <span className="letter-p"><span className={styles.letter}>P</span></span>
                    <span className="letter-y"><span className={styles.letter}>Y</span></span>
                    <span className="letter-k"><span className={styles.letter}>K</span></span>
                    <span className="letter-h"><span className={styles.letter}>H</span></span>
                    <span className="letter-o"><span className={styles.letter}>O</span></span>
                </div>
                <div className={setting.difficulty}>
                    <input min={0.1} type={"number"} defaultValue={this.state.difficulty} onInput={(e) => this.changeDifficulty(e)} className={setting.num_input}></input>
                    <h3>Delay</h3>
                </div>
                <div>
                    <button onClick={() => testTwitch()} className={styles.info_button}><h1>🛰️</h1></button>
                    <span className={styles.extraMargin}>
                        <input defaultValue={this.checkTwitchUsername()} placeholder={"Twitch Chat"} onInput={(e) => this.setTwitchUsername(e)} className={setting.text_input}></input>
                    </span>
                </div>
                <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
            </div >
        );
    }
}

export default Start;
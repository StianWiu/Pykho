import styles from "../start/start.module.css";
import setting from "./setting.module.css";
import React, { Component } from "react"
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
                    <input min={0.1} type={"number"} defaultValue={this.state.difficulty} onInput={(e) => this.changeDifficulty(e)} className={setting.input}></input>
                    <h3>Delay</h3>
                </div>
                <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
            </div >
        );
    }
}

export default Start;
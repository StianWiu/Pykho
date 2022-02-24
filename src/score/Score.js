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

class Score extends Component {
    constructor(props) {
        super(props);
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
                <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
                <div className={score.score}>
                    <h3 className={``}>Points:</h3>
                    <h3 className={`${score.points}`}>{sessionStorage.getItem("points")}</h3>
                </div>
            </div >
        );
    }
}

export default Score;
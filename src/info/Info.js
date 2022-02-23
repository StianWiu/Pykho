import "../letters.css";
import styles from "../start/start.module.css";
import info from "./info.module.css";

const changeScreen = (val) => {
    if (val === "back") {
        sessionStorage.setItem('screen', "start");
        window.location.reload();
    }
}

export default function Info() {
    return (
        <div className={styles.main}>
            <div className={styles.letters}>
                <span className="letter-p"><span className={styles.letter}>P</span></span>
                <span className="letter-y"><span className={styles.letter}>Y</span></span>
                <span className="letter-k"><span className={styles.letter}>K</span></span>
                <span className="letter-h"><span className={styles.letter}>H</span></span>
                <span className="letter-o"><span className={styles.letter}>O</span></span>
            </div>
            <p className={info.info}>
                <center>
                    How to play?
                    <br />
                    <br />
                    The goal of the game is to  get as many points as possible.
                    <br />
                    <br />
                    In order to stay alive and get points you have to make words using the letters on the screen. One letter removed corresponds to one point.
                    <br />
                    <br />
                    When writing a word with those letters the letters used will be removed.
                    <br />
                    <br />
                    Good luck! -Stian
                </center>

            </p>
            <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
        </div >
    );
}

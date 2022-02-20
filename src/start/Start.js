import "../letters.css";
import styles from "./start.module.css";

const changeScreen = (val) => {
    if (val === "play") {
        sessionStorage.setItem('screen', "game");
        window.location.reload();
    } else if (val === "settings") {
        sessionStorage.setItem('screen', "settings");
        window.location.reload();
    }
}

const getHighscore = () => {
    if (parseInt(localStorage.getItem('highscore')) === 0) {
        return;
    } else {
        return localStorage.getItem("highscore");
    }
}

export default function Start() {
    return (
        <div className={styles.main}>
            <div className={styles.letters}>
                <span className="letter-p"><span className={styles.letter}>P</span></span>
                <span className="letter-y"><span className={styles.letter}>Y</span></span>
                <span className="letter-k"><span className={styles.letter}>K</span></span>
                <span className="letter-h"><span className={styles.letter}>H</span></span>
                <span className="letter-o"><span className={styles.letter}>O</span></span>
            </div>
            <button onClick={() => changeScreen("settings")} className={styles.button}><h1>Settings →</h1></button>
            <button onClick={() => changeScreen("play")} className={styles.button}><h1>Play →</h1></button>
            <button className={styles.disabled}><h1>Login →</h1></button>
            <h3 className={styles.highscore}>{getHighscore()}</h3>
        </div >
    );
}

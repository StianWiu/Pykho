import "../letters.css";
import styles from "./start.module.css";

const changeScreen = (val) => {
    if (val === "play") {
        sessionStorage.setItem('screen', "game");
        window.location.reload();
    } else if (val === "settings") {
        sessionStorage.setItem('screen', "settings");
        window.location.reload();
    } else if (val === "info") {
        sessionStorage.setItem('screen', "info");
        window.location.reload();
    } else if (val === "login") {
        sessionStorage.setItem('screen', "login");
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

const loginButtonText = () => {
    if (sessionStorage.getItem("logged-in")) {
        return "Logged in";
    } else {
        return "Login";
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
            <div>
                <button onClick={() => changeScreen("info")} className={styles.info_button}><h1>ℹ</h1></button>
                <span className={styles.extraMargin}>
                    <button onClick={() => changeScreen("play")} className={styles.button}><h1>Play →</h1></button>
                </span>
            </div>
            <button onClick={() => changeScreen("settings")} className={styles.button}><h1>Settings →</h1></button>
            <button className={styles.disabled}><h1>Stats →</h1></button>
            <button onClick={() => changeScreen("login")} className={styles.button}><h1>{loginButtonText()} →</h1></button>
            <h3 className={styles.highscore}>{getHighscore()}</h3>
        </div >
    );
}

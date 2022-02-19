import letters from "../letters.module.css"
import styles from "./gameover.module.css"

export default function Gameover() {
    let points = document.location.toString().split("?").slice(1).join("?")
    return (
        <div className={styles.main}>
            <div className={styles.middleElement}>
                <div className={styles.title}>
                    <h1>
                        <span className={letters.letter_p}>P</span>
                        <span className={letters.letter_y}>Y</span>
                        <span className={letters.letter_k}>K</span>
                        <span className={letters.letter_h}>H</span>
                        <span className={letters.letter_o}>O</span>
                    </h1>
                    <h2>Game over</h2>
                    <br></br>
                    <h2>{points}</h2>
                    <br></br>
                    <div className={styles.buttons}>
                        <a href="/game">
                            <button className={styles.start_button}>PLAY AGAIN</button>
                        </a>
                    </div>
                    <p>Game developed by Pignuuu</p>
                </div>
            </div>
        </div >
    );
}

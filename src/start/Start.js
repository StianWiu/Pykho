import letters from "../letters.module.css"
import styles from './start.module.css'

const setDifficulty = (difficulty) => {
    localStorage.setItem('Difficulty', difficulty);
    window.location.href = "/game";
}

export default function Start() {
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
                    <p>Game developed by Pignuuu</p>
                </div>
            </div>
        </div >
    );
}

import letters from "../letters.module.css";
import styles from "./start.module.css";
import SuggestionInputSearch from 'suggestion-react-input-search';

const setDifficulty = (difficulty) => {
    localStorage.setItem("Difficulty", difficulty);
    window.location.href = "/game";
};

export default function Start() {
    function handleOnSubmit(term) {
        console.log("hello world")
    }

    const recentSearches = ['star wars', 'star wars IV', 'star trek', 'star wars I'];
    const placeholder = 'Search films...';
    const inputPosition = 'center';

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
                    <SuggestionInputSearch
                        onSubmitFunction={() => handleOnSubmit}
                        recentSearches={recentSearches}
                        placeholder={placeholder}
                        inputPosition={inputPosition}
                        inputClass={styles.search}
                        suggestionListClass={styles.suggestionList}
                    />
                    <p>Game developed by Pignuuu</p>
                </div>
            </div>
        </div>
    );
}

import "../letters.css"
import "./gameover.css"

export default function Gameover() {
    let points = document.location.toString().split("?").slice(1).join("?")
    return (
        <div className="main">
            <div className="middleElement">
                <div className="title">
                    <h1>
                        <span className="letter-p">P</span>
                        <span className="letter-y">Y</span>
                        <span className="letter-k">K</span>
                        <span className="letter-h">H</span>
                        <span className="letter-o">O</span>
                    </h1>
                    <h2>Game over</h2>
                    <br></br>
                    <h2>{points}</h2>
                    <br></br>
                    <div className="buttons">
                        <a href="/game">
                            <button className="start-button">PLAY AGAIN</button>
                        </a>
                    </div>
                    <p>Game developed by Pignuuu</p>
                </div>
            </div>
        </div >
    );
}

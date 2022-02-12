import "../letters.css"
import "./start.css"

export default function Start() {
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
                    <div className="buttons">
                        <a href="/game">
                            <button className="start-button">START GAME</button>
                        </a>
                    </div>
                    <p>Game developed by Pignuuu</p>
                </div>
            </div>
        </div >
    );
}

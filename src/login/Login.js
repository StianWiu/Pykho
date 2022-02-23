import styles from "../start/start.module.css";
import login from "./Login.module.css";
import React, { Component } from "react"
import axios from 'axios';
import bcrypt from 'bcryptjs';

import "../letters.css";
const changeScreen = (val) => {
    if (val === "back") {
        sessionStorage.setItem('screen', "start");
        window.location.reload();
    }
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password_color: login.no_color,
            temp_password: "",
            input: "",
            placeholder: "Password",
            username_input: "",
            shake: false,
            strength: 0,
        }

        this.signup = () => {
            if (this.state.username_input === "") {
                window.alert("Please enter a username")
            } else {
                if (this.state.username_input.length <= 3) {
                    window.alert("Username must be at least 4 characters long")
                } else {
                    if (this.state.input === "") {
                        window.alert("Please enter a password")
                    } else {
                        if (this.state.strength < 8) {
                            window.alert("Password is not strong enough")
                        } else {
                            this.signup_check(this.state.input)
                        }
                    }
                }
            }
        }

        this.signup_check = (e) => {
            if (this.state.temp_password === "") {
                this.setState({
                    temp_password: e,
                    input: "",
                    placeholder: "Confirm Password",
                })
            } else {
                if (e === this.state.temp_password) {
                    this.setState({
                        input: "",
                    })

                    this.signupAccount(e, this.state.username_input)

                } else {
                    window.alert("Wrong")
                }
                this.setState({
                    temp_password: "",
                    placeholder: "Password",
                })
            }
        }

        this.signupAccount = async (password, username) => {
            let user = {
                username: username,
                password: password,
            }

            axios({
                method: 'post',
                url: 'https://pykho.dev/api/account/register',
                data: {
                    ["username"]: user.username.toLowerCase(),
                    ["password"]: user.password,
                }
            }).then((response) => {
                if (response.data === "username already exists") {
                    window.alert("Username is taken.")
                } else if (response.data.username) {
                    console.log(response.data.username)
                    console.log(response.data.token)
                    localStorage.setItem('username', response.data.username)
                    localStorage.setItem('token', response.data.token)
                    window.location.reload()
                } else {
                    window.alert("Error something went wrong")
                }
            })
        }

        this.login = async () => {
            if (this.state.username_input === "") {
                window.alert("Please enter a username")
            } else {
                if (this.state.input === "") {
                    window.alert("Please enter a password")
                } else {
                    let username = this.state.username_input
                    let password = this.state.input
                    let user = {
                        username: username,
                        password: password,
                    }

                    axios({
                        method: 'post',
                        url: 'https://pykho.dev/api/account/login',
                        data: {
                            ["username"]: user.username.toLowerCase(),
                            ["password"]: user.password,
                        }
                    }).then((response) => {
                        console.log(response.data)
                        localStorage.setItem('username', response.data.username)
                        localStorage.setItem('token', response.data.token)
                        window.location.reload()
                    })
                }
            }
        }

        this.checkStrength = (e) => {
            // Create array of special characters
            var specialChars = [
                '@', '%', '+', '\\', '/', ' ? ', ') ', '(', ' & ', ' ^ ', '}',
                '{', '*', ']', '[', ')', '!',
                '#', '.', ':', ';', '~', '-',
                '_', '|', '`', '=', '+', '<',
                '>', '$', '£', '¢', '¥', '§'
            ];

            let value = e.target.value;
            let strength = 0;
            for (let i = 0; i < value.length; i++) {
                strength = strength + 0.5
            }
            strength = strength + value.replace(/[^A-Z]/g, "").length
            for (let j = 0; j < value.length; j++) {
                if (isNaN(value[j]) === false) {
                    strength = strength + 1.
                }
            }
            for (let k = 0; k < value.length; k++) {
                for (let l = 0; l < specialChars.length; l++) {
                    if (value[k] === specialChars[l]) {
                        strength = strength + 1.5
                    }
                }
            }

            this.setState({
                password_color: login.no_color,
                input: e.target.value,
            })
            if (strength > 0.5) {
                this.setState({
                    password_color: login.weak_color
                })
            }
            if (strength > 3) {
                this.setState({
                    password_color: login.medium_color
                })
            }
            if (strength > 8) {
                this.setState({
                    password_color: login.strong_color
                })
            }

            this.setState({
                strength: strength,
            })
        }

        this.updateUsername = (e) => {
            this.setState({
                username_input: e.target.value,
            })
        }

        this.loggedOut = () => {
            if (sessionStorage.getItem('logged-in')) {
                return login.gone
            } else {
                return login.loggedOut
            }
        }
        this.loggedIn = () => {
            if (sessionStorage.getItem('logged-in')) {
                return login.loggedIn
            } else {
                return login.gone
            }
        }

        this.logout = () => {
            localStorage.removeItem('username')
            localStorage.removeItem('token')
            sessionStorage.removeItem('logged-in')
            window.location.reload()
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
                <div className={`${this.loggedOut()}`}>
                    <input maxLength={20} placeholder={"Username"} onChange={(e) => this.updateUsername(e)} className={login.text_input}></input>
                    <input value={this.state.input} type={"password"} placeholder={this.state.placeholder} onChange={(e) => this.checkStrength(e)} className={`${login.text_input} ${login.extra_margin} ${this.state.shake} ${this.state.password_color}`} ></input>
                    <button onClick={() => this.login()} className={styles.button}><h1>Login</h1></button>
                    <button onClick={() => this.signup()} className={styles.button}><h1>Signup</h1></button>
                </div>
                <div className={`${this.loggedIn()}`}>
                    <input value={localStorage.getItem("username")} onChange={(e) => this.updateUsername(e)} className={login.text_input}></input>
                    <button onClick={() => this.logout()} className={styles.button}><h1>Logout</h1></button>
                </div>
                <button onClick={() => changeScreen("back")} className={styles.button}><h1>← Back</h1></button>
            </div >
        );
    }
}

export default Login;
import React from 'react';

import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroundImg from "../images/download.jpg";

function Login({ setLoggedIn }) {
    const [username, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();

    async function login(event) {
        event.preventDefault();
        try {
            const res = await axios.post("http://localhost:8090/api/v1/players/login", {
                username: username,
                password: password
            });
    
            if (res.data.message && res.data.message.startsWith("Welcome back!")) {
                alert("Login successful!");
                // Reset the form after successful login
                setUserName("");
                setPassword("");
                // Set loggedIn state to true
                setLoggedIn(true); // This line was missing
                navigate("/home", { state: { playerId: res.data.userId } });
            } else {
                alert("Invalid username or password");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while logging in");
        }
    }
    

    return (
        <div className="container-fluid" style={{backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', height:"100vh"}}>
            <div className="row outer-row justify-content-center">
                <div className="col-md-6">
                <br></br>
                <br></br>
                    <div className="card mt-5 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <div className="card-header text-center">
                            <h3>COOL CAT GAMES <br></br> <span style={{color:'pink'}}>Player Login</span></h3>
                        </div>
                        <br></br>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label>NICKNAME</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Enter UserName"
                                        value={username}
                                        onChange={(event) => {
                                            setUserName(event.target.value);
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>PASSWORD</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-success btn-block mt-4 form-control"
                                    onClick={login}
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <Link to="/PlayerRegistration" className="text-blue-400">
                                Don't have an account? Signup here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

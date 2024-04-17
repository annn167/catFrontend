import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import PlayerDetails from "./PlayerDetails";
import backgroundImg from "../images/download.jpg";


function PlayerRegistration() {
    const [firstName, setFirstName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); 
    const [player, setPlayer] = useState(null); 
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errors = {};

        if (!firstName.trim()) {
            errors.firstName = "First name is required";
        }

        if (!userName.trim()) {
            errors.userName = "Username is required";
        }

        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email is invalid ";
        }

        if (!password.trim()) {
            errors.password = "Password is required";
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!validateForm()) {
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('userName', userName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('image', image);
    
            const response = await axios.post("http://localhost:8090/api/v1/players/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            setPlayer(response.data.player);
            setImageUrl(response.data.imageUrl);
            alert("Player Registration Successful");
            navigate("/");
            setFirstName("");
            setUserName("");
            setEmail("");
            setPassword("");
            setImage("");
        } catch (err) {
            console.error(err);
            if (err.response) {
                // Detailed error message from the response
                alert(`Error: ${err.response.status} - ${err.response.data.message}`);
            } else {
                // If there's no response, it might be a network error or something else
                alert("An error occurred during registration. Please check the console for more details.");
            }
        }
    };
    
    

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    useEffect(() => {
        const fetchPlayerDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8090/api/v1/players/1");
                setPlayer(response.data);
                setImageUrl(response.data.imageUrl); 
            } catch (error) {
                console.error("Error fetching player details:", error);
            }
            
        };

        fetchPlayerDetails();
    }, []);

    return (
        <div className="container-fluid" style={{backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', height:"100vh"}}>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                {/* <img src={require('users_img/sam.jpeg')} /> */}
                    <div className="card mt-5 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <div className="card-header text-center">
                            <h3>COOL CAT GAMES <br></br> <span style={{color:'pink'}}>Player  Registeration</span></h3>
                        </div>
                        <div className="card-body mb-4">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter First Name"
                                        value={firstName}
                                        onChange={(event) => setFirstName(event.target.value)}
                                    />
                                    {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Username"
                                        value={userName}
                                        onChange={(event) => setUserName(event.target.value)}
                                    />
                                    {errors.userName && <div className="text-danger">{errors.userName}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="example@gmail.com"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>
                                <div className="form-group">
                                    {imageUrl && (
                                        <img
                                            style={{width: "200px", height: "200px", borderRadius:"50%", objectFit:"cover", border:"4px solid green"}}
                                            src={imageUrl} 
                                            alt=""
                                        />
                                    )}
                                    <label>Profile Image</label>
                                    <input
                                        type="file"
                                        className="form-control-file form-control"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <button type="submit" className="btn btn-success btn-block mt-4 form-control">Register</button>
                            </form>
                            <div className="pt-4 text-center">
                                <Link to="/" className="text-blue-400" style={{ textDecoration: 'none' }}>Already have an account? Login here.</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {player && <PlayerDetails player={player} />}
        </div>
    );
}

export default PlayerRegistration;

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, Link } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import PlayerDetails from "./PlayerDetails";

function Friends() {
    const { playerId } = useParams();
    const [firstName, setFirstName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [player, setPlayer] = useState(null); // State variable for player details
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

            const response = await axios.put(`http://localhost:8090/api/v1/players/${playerId}`, formData);
            
            // Set the player details state variable with the response data
            setPlayer(response.data.player);

            alert("Player Information Updated Successfully");
        } catch (err) {
            alert("Error updating player information");
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    useEffect(() => {
        // Fetch player details when the component mounts
        const fetchPlayerDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/v1/players/${playerId}`);
                setPlayer(response.data);
                setFirstName(response.data.firstName);
                setUserName(response.data.userName);
                setEmail(response.data.email);
                setPassword(response.data.password); // You might want to handle password securely
            } catch (error) {
                console.error("Error fetching player details:", error);
            }
        };

        fetchPlayerDetails();
    }, [playerId]); // Dependency on playerId to fetch player details when playerId changes

    return (
        <div className="container1">
            <div>
                <div className="form">
                    <h2>Update Player Information</h2>
                    <form className="border" onSubmit={handleSubmit}>
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
                            <label>NickName</label>
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
                            <img style={{width: "200px", height: "200px", borderRadius:"50%", objectFit:"cover",
                            border:"4px solid green"}}
                            src={player && player.image} alt=""  />
                            <label>Profile Image</label>
                            <input
                                type="file"
                                className="form-control-file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-4">Update</button>
                        <div className='pt-4'>
                            <Link to={`/players/${playerId}`} className='text-blue-400'>Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
            {/* Display player details if available */}
            {player && <PlayerDetails player={player} />}
        </div>
    );
}

export default Friends;

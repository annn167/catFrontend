
import React from "react";

function PlayerDetails({ firstName, userName, email, image }) {
    return (
        <div className="container2">
            <div>
                <h2>Player Details</h2>
                <p>First Name: {firstName}</p>
                <p>Username: {userName}</p>
                <p>Email: {email}</p>
                {image && <img src={image} alt="Profile" />} {/* Display image if it exists */}
            </div>
        </div>
    );
}

export default PlayerDetails;


import React, { useState, useEffect } from "react";
import axios from "axios";

function PlayerProfile() {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/v1/players/profile");
                setPlayer(response.data);
            } catch (error) {
                console.error("Error fetching player data:", error);
            }
        };

        fetchPlayerData();
    }, []);

    return (
        <div>
            <h2>Player Profile</h2>
            {player && (
                <div>
                    <p>Username: {player.username}</p>
                    <p>Email: {player.email}</p>
                    {/* Display other player information as needed */}
                </div>
            )}
        </div>
    );
}

export default PlayerProfile;

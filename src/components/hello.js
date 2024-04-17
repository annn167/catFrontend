import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "../images/download.jpg";
import { useLocation } from "react-router-dom";

function Home({ loggedIn }) {
  const [players, setPlayers] = useState([]);
  const [friendId, setFriendId] = useState("");
  const [message, setMessage] = useState("");
  const [friendCount, setFriendCount] = useState(0);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const location = useLocation();
  const playerId = location.state && location.state.playerId;
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:8090/api/v1/players/getall");
        setPlayers(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

  const handleAddFriend = async (friendId) => {
    try {
      if (!loggedIn) {
        return setErrorMessage(
          <p>
            Please <a href="/">login</a> to add a friend.
          </p>
        );
      }
      if (!friendId) {
        return setErrorMessage("Friend ID is required to add a friend.");
      }
      const response = await axios.post(
        `http://localhost:8090/api/v1/players/friends`,
        { playerId: playerId, friendId: friendId }
      );
      if (response && response.data === "Friend added successfully.") {
        setSuccessMessage(response.data);
        setFriendCount((prevCount) => prevCount + 1);
        setFriendId(""); // Clear the input field after adding friend
      } else {
        setErrorMessage("An error occurred while adding a friend.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding a friend.");
    }
  };
  
  

  const handleRemoveFriend = async (friendId) => {
    try {
      if (!loggedIn) {
        setMessage("Please login to remove a friend.");
        return;
      }
      // Remove friend logic
    } catch (error) {
      setMessage("An error occurred while removing the friend.");
    }
  };

  const handleShowPlayerList = () => {
    setShowPlayerList(!showPlayerList);
  };

  return (
    <div style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', minHeight: '100vh'}}>
      <div className="container" >
        <nav className="text-center">
          <h2>Connecting Gamers</h2>
          <br></br>
          <button onClick={handleShowPlayerList}>Show Player List</button>
        </nav>
        <br></br>
        <br></br>
        {successMessage && <p className="alert alert-success text-center" role="alert">{successMessage}</p>}
        {errorMessage && <p className="alert alert-danger text-center" role="alert">{errorMessage}</p>}
        {showPlayerList && (
          <div className="grid-container">
            <div className="grid-item">
              <p>Number of friends: {friendCount}</p>
              <br />
              <h2>All Players</h2>
              <ul style={{ listStyleType: 'none' }}>
                {players
                  .filter(player => player.id !== playerId) // Filter out the current user
                  .map(player => (
                    <li key={player.id}>
                      <div style={{ alignItems: 'center' }}>
                        <h4 style={{ marginRight: '100px', max: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.userName}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                          <button className="btn btn-success" onClick={() => handleAddFriend(player.id)}>Add Friend</button>
                          <button className="btn btn-warning" onClick={() => handleRemoveFriend(player.id)}>Unfriend</button>
                        </div>
                      </div>
                      <br />
                    </li>
                  ))}
              </ul>
              <div>
                <input
                  type="hidden"
                  value={friendId}
                  onChange={(e) => setFriendId(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;
